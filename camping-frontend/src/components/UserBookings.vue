<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-5">
    <Card class="w-full max-w-5xl shadow-lg rounded-lg overflow-hidden">
      <template #title>
        <h1 class="text-3xl font-bold text-green-900">My Bookings</h1>
      </template>
      <template #content>
        <div v-if="bookings.length > 0" class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div v-for="booking in bookings" :key="booking.id" class="booking-card bg-white shadow-md rounded-lg p-5 flex flex-col justify-between">
            <div>
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-semibold text-green-800">{{ booking.campsiteName }}</h2>
                <span class="bg-green-200 text-green-800 py-1 px-3 rounded-full">{{ booking.checkin_date }}</span>
              </div>
              <p class="text-gray-600 mb-2"><strong>Check-In:</strong> {{ booking.checkin_date }}</p>
              <p class="text-gray-600 mb-2"><strong>Check-Out:</strong> {{ booking.checkout_date }}</p>
              <p class="text-gray-600 mb-2"><strong>Booking ID:</strong> {{ booking.id }}</p>
              
            </div>
            <div v-if="hasReview(booking.id)" class="mt-4">
              <Rating v-model="getReview(booking.id).rating" readonly :cancel="false"></Rating>
            </div>
            <div v-else class="mt-4">
              <router-link :to="{ name: 'BookingReview', params: { id: booking.id } }">
                <button class="w-full py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition duration-300">Leave a review</button>
              </router-link>
            </div>
          </div>
        </div>
        <div v-else class="text-center text-gray-700 mt-6">
          <p>No bookings found.</p>
        </div>
      </template>
    </Card>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import Card from 'primevue/card';
import Rating from 'primevue/rating';
import { jwtDecode } from 'jwt-decode';

export default defineComponent({
  components: {
    Card,
    Rating
  },
  setup() {
    const bookings = ref([]);
    const reviews = ref([]);

    const fetchBookings = async () => {
      const token = sessionStorage.getItem('jwtToken');
      if (!token) {
        console.error('JWT token not found in session storage.');
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.UserID;
        const response = await fetch(`https://localhost:7084/Booking/GetUserBookings?userId=${userId}`);
        const data = await response.json();

        // Fetch campsite details for each booking
        const campsitePromises = data.map(async (booking) => {
          const campsiteResponse = await fetch(`https://localhost:7084/Campsite/GetCampsiteById?id=${booking.campsiteId}`);
          const campsiteData = await campsiteResponse.json();
          booking.campsiteName = campsiteData.name;
          return booking;
        });

        bookings.value = await Promise.all(campsitePromises);

        // Fetch reviews for each booking's campsite
        const reviewPromises = data.map(booking =>
          fetch(`https://localhost:7084/Review/GetCampsiteReviews?campsiteId=${booking.campsiteId}`).then(res => res.json())
        );
        const reviewsData = await Promise.all(reviewPromises);
        reviews.value = reviewsData.flat();
      } catch (error) {
        console.error('Error fetching bookings or reviews:', error.message);
      }
    };

    const hasReview = (bookingId) => {
      return reviews.value.some(review => review.bookingId === bookingId);
    };

    const getReview = (bookingId) => {
      return reviews.value.find(review => review.bookingId === bookingId);
    };

    onMounted(fetchBookings);

    return {
      bookings,
      hasReview,
      getReview,
    };
  },
});
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}

.bg-gray-100 {
  background-color: #f7fafc;
}

.text-green-900 {
  color: #22543d;
}

.text-green-800 {
  color: #276749;
}

.bg-green-600 {
  background-color: #2f855a;
}

.bg-green-700 {
  background-color: #2c7a7b;
}

.booking-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.booking-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
}

button {
  transition: background-color 0.3s ease;
}
</style>
