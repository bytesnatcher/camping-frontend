<template>
  <div class="bg-white flex flex-col items-center justify-center min-h-screen">
    <div v-if="campsite" class="text-center">
      <h1 class="text-6xl font-light mb-4 text-gray-800">{{ campsite.name }}</h1>
      <div class="mx-auto max-w-sm">
        <Galleria :value="campsite.images" :responsiveOptions="responsiveOptions" :numVisible="5" containerStyle="max-width: 500px" :showItemNavigators="true">
          <template #item="slotProps">
            <div class="flex justify-center">
              <img :src="slotProps.item" :alt="slotProps.item" style="width: 600px; height: 300px;" />
            </div>
          </template>
          <template #thumbnail="slotProps">
            <img :src="slotProps.item" :alt="slotProps.item" style="width: 50%" />
          </template>
        </Galleria>
      </div>
      <button @click="toggleCalendar" class="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
        Check Availability
      </button>
      <div v-if="showCalendarButtonClicked" class="calendar-container mt-10 space-x-5">
        <label for="checkInDate">Check-in Date</label>
        <Calendar v-model="checkInDate" :minDate="minCheckInDate">
          <template #date="slotProps">
            <strong v-if="isDateBooked(slotProps.checkInDate)" style="text-decoration: line-through">{{ slotProps.checkInDate.day }}</strong>
            <template v-else>{{ slotProps.date.day }}</template>
          </template>
        </Calendar>
        <label for="checkOutDate">Check-out Date</label>
        <Calendar v-model="checkOutDate" :minDate="minCheckOutDate">
          <template #date="slotProps">
            <strong v-if="slotProps.checkOutDate.day > 10 && slotProps.checkOutDate.day < 15" style="text-decoration: line-through">{{ slotProps.checkOutDate.day }}</strong>
            <template v-else>{{ slotProps.checkOutDate.day }}</template>
          </template>
        </Calendar>
      </div>
      <Panel class="mt-10 border-green-500" header="Reviews" toggleable>
        <div v-if="reviews.length > 0">
          <div v-for="review in reviews" :key="review.id" class="mb-4">
            <p class="font-semibold">Rating: {{ review.rating }}/5</p>
            <div class="star-rating text-yellow-500 mb-2">
              <span v-for="star in 5" :key="star" :class="{ 'filled': star <= review.rating }">&#9733;</span>
            </div>
            <p>{{ review.text }}</p>
          </div>
        </div>
        <div v-else>
          <p>No reviews yet.</p>
        </div>
      </Panel>
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch, computed, h } from 'vue';
import { useRoute } from 'vue-router';
import Galleria from 'primevue/galleria';
import Button from 'primevue/button';
import Panel from 'primevue/panel';
import Calendar from 'primevue/calendar';
import { jwtDecode } from 'jwt-decode';

export default {
  name: 'CampsiteDetails',
  components: { Galleria, Button, Panel, Calendar },
  setup() {
    const route = useRoute();
    const campsite = ref(null);
    const campsiteImages = ref([]);
    const reviews = ref([]);
    const responsiveOptions = ref([
      { breakpoint: '1300px', numVisible: 4 },
      { breakpoint: '575px', numVisible: 1 }
    ]);
    const checkInDate = ref(null);
    const checkOutDate = ref(null);
    const showCalendarButtonClicked = ref(false);
    const bookings = ref([]);
    
    const fetchCampsite = async () => {
      try {
        const id = route.params.id;
        const response = await fetch(`https://localhost:7084/Campsite/GetCampsiteById?id=${id}`);
        if (!response.ok) throw new Error('Failed to fetch campsite data');
        const data = await response.json();
        campsite.value = data;
        campsiteImages.value = data.images;
      } catch (error) {
        console.error('Error fetching campsite data:', error.message);
      }
    };
    function alertelement(x)
    {
      alert(x);
      return true;
    };

    const fetchReviews = async () => {
      try {
        const id = route.params.id;
        const response = await fetch(`https://localhost:7084/Review/GetCampsiteReviews?campsiteId=${id}`);
        if (!response.ok) throw new Error('Failed to fetch reviews');
        const data = await response.json();
        reviews.value = data;
      } catch (error) {
        console.error('Error fetching reviews:', error.message);
      }
    };

    const fetchBookings = async () => {
      try {
        const id = route.params.id;
        const response = await fetch(`https://localhost:7084/Booking/GetCampsiteBookings?campsiteId=${id}`);
        if (!response.ok) throw new Error('Failed to fetch bookings');
        const data = await response.json();
        bookings.value = data;
      } catch (error) {
        console.error('Error fetching bookings:', error.message);
      }
    };

    const checkAvailability = async () => {
      if (!checkInDate.value || !checkOutDate.value) return true;
      try {
        const response = await fetch('https://localhost:7084/Booking/CheckCampsiteAvailability', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: 0,
            campsiteId: campsite.value.id,
            checkin_date: checkInDate.value,
            checkout_date: checkOutDate.value
          })
        });
        if (!response.ok) throw new Error('Failed to check campsite availability');
        const data = await response.text();
        return data === 'true';
      } catch (error) {
        console.error('Error checking availability:', error.message);
        return false;
      }
    };

    const handleBooking = async () => {
      try {
        const token = sessionStorage.getItem('jwtToken');
        if (!token) {
          alert("You aren't logged in.");
          return;
        }
        const first_check = await checkAvailability();
        if (!first_check) {
          alert('Campsite already booked for those dates.');
          return;
        }
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.UserID;
        const bookingData = {
          userId: userId,
          checkin_date: checkInDate.value,
          checkout_date: checkOutDate.value,
          campsiteId: campsite.value.id
        };
        const response = await fetch('https://localhost:7084/Booking/AddBooking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json-patch+json', Accept: '*/*' },
          body: JSON.stringify(bookingData)
        });
        if (!response.ok) throw new Error('Failed to create booking');
        const result = await response.text();
        console.log('Booking successful:', result);
        alert('Booking successful!');
      } catch (error) {
        console.error('Error creating booking:', error.message);
        alert('Booking failed. Please check console for details.');
      }
    };

    const toggleCalendar = () => {
      showCalendarButtonClicked.value = !showCalendarButtonClicked.value;
    };

    const minCheckInDate = computed(() => new Date());
    const minCheckOutDate = computed(() => {
      const date = new Date();
      date.setDate(date.getDate() + 2);
      return date;
    });

    const isDateBooked = (date) => {
      return bookings.value.some(booking => {
        const checkIn = new Date(booking.checkin_date);
        const checkOut = new Date(booking.checkout_date);
        console.log( date >= checkIn && date <= checkOut);
        return date >= checkIn && date <= checkOut;
      });
    };

    const dateTemplate = (slotProps) => {
      const date = slotProps.date;
      const day = date.getDate();
      const isBooked = isDateBooked(date);

      return isBooked 
        ? h('strong', { style: 'text-decoration: line-through' }, day)
        : h('span', day);
    };

    watch(campsite, (newCampsite) => {
      campsiteImages.value = newCampsite ? newCampsite.images : [];
    });

    onMounted(() => {
      fetchCampsite();
      fetchReviews();
      fetchBookings();
    });

    return {
      campsite,
      campsiteImages,
      reviews,
      responsiveOptions,
      checkInDate,
      checkOutDate,
      showCalendarButtonClicked,
      fetchCampsite,
      fetchReviews,
      fetchBookings,
      checkAvailability,
      handleBooking,
      toggleCalendar,
      minCheckInDate,
      minCheckOutDate,
      isDateBooked,
      dateTemplate
    };
  }
};
</script>

<style scoped>
.star-rating {
  color: gold;
}
.star-rating .filled {
  color: gold;
}
</style>
