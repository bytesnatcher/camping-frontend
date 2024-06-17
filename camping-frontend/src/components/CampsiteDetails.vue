<template>
  <div class="bg-gray-100 min-h-screen flex flex-col items-center p-6">
    <div v-if="campsite" class="w-full max-w-5xl bg-white shadow-md rounded-lg overflow-hidden">
      <div class="flex flex-col md:flex-row">
        <div class="flex-grow">
          <Galleria :value="campsite.images" :responsiveOptions="responsiveOptions" :numVisible="5" containerStyle="max-width: 100%" :showItemNavigators="true">
            <template #item="slotProps">
              <div class="flex justify-center">
                <img :src="slotProps.item" :alt="slotProps.item" class="object-cover w-full h-72 transition-transform duration-300 hover:scale-105" />
              </div>
            </template>
            <template #thumbnail="slotProps">
              <img :src="slotProps.item" :alt="slotProps.item" class="object-cover w-24 h-24 transition-transform duration-300 hover:scale-105" />
            </template>
          </Galleria>
        </div>
        <div class="flex flex-col p-6">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">{{ campsite.name }}</h1>
          <p class="text-gray-600 mb-4">Belgium > {{ campsite.address }}</p>
          <div class="flex items-center mb-4">
            <span class="text-4xl font-semibold text-green-500">{{ campsite.rating }}</span>
          </div>
          <div class="flex space-x-4 mb-6">
            <a href="#" class="flex items-center space-x-1 text-gray-600 hover:text-gray-800">
              <i class="pi pi-globe"></i> <span>Website</span>
            </a>
            <a href="#" class="flex items-center space-x-1 text-gray-600 hover:text-gray-800">
              <i class="pi pi-phone"></i> <span>Contact</span>
            </a>
            <a href="#" class="flex items-center space-x-1 text-gray-600 hover:text-gray-800">
              <i class="pi pi-share-alt"></i> <span>Share</span>
            </a>
            <a href="#" class="flex items-center space-x-1 text-gray-600 hover:text-gray-800">
              <i class="pi pi-heart"></i> <span>Favorite</span>
            </a>
          </div>
          <button @click="toggleCalendar" class="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300 relative">
            Check Availability
            <span v-if="loading" class="absolute right-4 top-2">
              <i class="pi pi-spinner pi-spin"></i>
            </span>
          </button>
        </div>
      </div>

      <transition name="swoop">
        <div v-if="showCalendarButtonClicked" class="calendar-container p-6">
          <Panel>
            <div class="flex flex-col space-y-4">
              <label for="checkInDate">Check-in Date</label>
              <VueDatePicker v-model="checkInDate" :min-date="new Date()" :disabled-dates="disabledDates" :format="format" :enableTimePicker="false" />
              <label for="checkOutDate">Check-out Date</label>
              <VueDatePicker v-model="checkOutDate" :min-date="new Date()" :disabled-dates="disabledDates" :format="format" :enableTimePicker="false" />
              <Button class="mt-5 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition duration-300" @click="handleBooking" label="Complete Booking" text raised />
            </div>
          </Panel>
        </div>
      </transition>

      <Panel class="mt-10 p-6" header="Map" toggleable>
        <DisplayMap :coordinates="campsite.coordinates" />
      </Panel>

      <Panel class="mt-10 p-6" header="Reviews" toggleable>
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
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import Galleria from 'primevue/galleria';
import Button from 'primevue/button';
import Panel from 'primevue/panel';
import VueDatePicker from '@vuepic/vue-datepicker';
import { jwtDecode } from 'jwt-decode';
import DisplayMap from './DisplayMap.vue'; // Import the MapDisplay component

export default {
  name: 'CampsiteDetails',
  components: { Galleria, Button, Panel, VueDatePicker, DisplayMap }, // Register the MapDisplay component
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
    const disabledDates = ref([]);

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
    const format = (date) => {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      return `Selected date is ${month}/${day}/${year}`;
    }

    const fetchBookings = async () => {
      try {
        const id = route.params.id;
        const response = await fetch(`https://localhost:7084/Booking/GetCampsiteBookings?campsiteId=${id}`);
        if (!response.ok) throw new Error('Failed to fetch bookings');
        const data = await response.json();
        bookings.value = data;
        updateDisabledDates();
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
            checkin_date: formatDate(checkInDate.value),
            checkout_date: formatDate(checkOutDate.value)
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
        console.log(first_check)
        if (!first_check) {
          alert('Campsite already booked for those dates.');
          return;
        }
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.UserID;
        const bookingData = {
          userId: userId,
          checkin_date: formatDate(checkInDate.value),
          checkout_date: formatDate(checkOutDate.value),
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
    const formatDate = (date) => {
      if (!date) return ''; // Return empty string if date is not provided

      const d = new Date(date);
      let month = '' + (d.getMonth() + 1);
      let day = '' + d.getDate();
      const year = d.getFullYear();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      return [year,month,day].join('-')
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

    const getAllBookedDates = () => {
      const bookedDates = [];
      bookings.value.forEach(booking => {
        const checkIn = new Date(booking.checkin_date);
        const checkOut = new Date(booking.checkout_date);
        for (let d = new Date(checkIn); d <= checkOut; d.setDate(d.getDate() + 1)) {
          bookedDates.push(new Date(d));
        }
      });
      return bookedDates;
    };

    const updateDisabledDates = () => {
      disabledDates.value = getAllBookedDates();
    };

    const isDateRangeAvailable = (checkIn, checkOut) => {
      return bookings.value.every(booking => {
        const existingCheckIn = new Date(booking.checkin_date);
        const existingCheckOut = new Date(booking.checkout_date);
        // Check if there is any overlap
        return (checkIn > existingCheckOut || checkOut < existingCheckIn);
      });
    };

    watch(campsite, (newCampsite) => {
      campsiteImages.value = newCampsite ? newCampsite.images : [];
    });

    watch([checkInDate, checkOutDate], async ([newCheckInDate, newCheckOutDate]) => {
      if (newCheckInDate && newCheckOutDate) {
      
        const isAvailable = isDateRangeAvailable(newCheckInDate, newCheckOutDate);
        if (!isAvailable) {
          alert('The selected date range overlaps with an existing booking.');
          checkInDate.value = null;
          checkOutDate.value = null;
        }
      }
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
      disabledDates,
      getAllBookedDates,
      format,
      formatDate
    };
  }
};
</script>

<style scoped>
body {
  font-family: 'Roboto', sans-serif;
}

h1 {
  font-family: 'Roboto', sans-serif;
}

.star-rating {
  color: gold;
}

.star-rating .filled {
  color: gold;
}

.bg-gray-100 {
  background-color: #f7fafc;
}

.text-green-500 {
  color: #48bb78;
}

.calendar-container {
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 10px;
}

.btn-primary {
  background-color: #1a4731;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  display: inline-block;
}

.btn-primary:hover {
  background-color: #276749;
}

.panel-header {
  color: #81c784;
  font-size: 1.25rem;
  font-weight: bold;
  text-transform: uppercase;
}

.panel {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #81c784;
  border-radius: 10px;
  padding: 20px;
  margin-top: 20px;
}

.panel-toggleable {
  transition: max-height 0.5s ease-in-out;
}

.panel-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.5s ease-in-out;
}

.panel-content.open {
  max-height: 1000px; /* Adjust based on your content */
}

.galleria-container {
  margin: 0 auto;
  max-width: 100%;
}

.galleria-item {
  transition: transform 0.3s ease-in-out;
}

.galleria-item:hover {
  transform: scale(1.05);
}

.galleria-thumbnail {
  transition: transform 0.3s ease-in-out;
}

.galleria-thumbnail:hover {
  transform: scale(1.05);
}

a {
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.text-gray-600 {
  color: #718096;
}

.text-gray-800 {
  color: #2d3748;
}

.text-green-500 {
  color: #48bb78;
}

.text-yellow-500 {
  color: #ecc94b;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}

@keyframes swoopIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.swoop-enter-active, .swoop-leave-active {
  animation: swoopIn 0.5s ease;
}

.swoop-leave-active {
  animation-direction: reverse;
}
</style>
