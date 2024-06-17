<template>
  <div class="min-h-screen bg-green-800 flex flex-col items-center px-16 pt-11 pb-0 mb-0 w-full max-md:px-5 max-md:max-w-full">
    <header class="flex flex-col mb-16 w-full max-w-[1111px] max-md:mb-10 max-md:max-w-full">
      <section class="mt-20 max-md:pr-5 max-md:mt-10 max-md:max-w-full flex-grow">
        <div class="flex gap-5 max-md:flex-col max-md:gap-0">
          <div class="flex flex-col w-[66%] max-md:ml-0 max-md:w-full">
            <article class="flex flex-col grow text-white max-md:mt-10 max-md:max-w-full">
              <h2 v-if="!tokenCheck()" class="text-5xl font-black leading-[63px] max-md:max-w-full max-md:text-4xl max-md:leading-[56px] tracking-in-expand">
                Camping made easy.
              </h2>
              <h2 v-else class="text-5xl font-black leading-[63px] max-md:max-w-full max-md:text-4xl max-md:leading-[56px] tracking-in-expand">
                Hi, {{ firstName }}. Let's book the trip of your dreams.
              </h2>
              <p class="mt-8 text-base leading-8 max-md:max-w-full tracking-in-expand">
                With camp finder, you can find beautiful camping spots in the blink of an eye. Filter out by location, amenities, and other preferences.
              </p>
            </article>
          </div>
          <aside class="flex flex-col ml-5 w-[34%] max-md:ml-0 max-md:w-full">
            <div class="flex flex-col items-center p-5 bg-white rounded-lg shadow-md transition-all duration-500" :class="{ expanded: checkInDate && checkOutDate }">
              <div class="w-full mb-4">
                <label for="checkInDate" class="block text-center text-green-700">Check-In Date</label>
                <Calendar v-model="checkInDate" :min-date="new Date()" showIcon :showOnFocus="false" inputId="checkInDate" class="calendar-element w-full" />
              </div>
              <div class="w-full mb-4">
                <label for="checkOutDate" class="block text-center text-green-700">Check-Out Date</label>
                <Calendar v-model="checkOutDate" :min-date="maxDate" showIcon :showOnFocus="false" inputId="checkOutDate" class="calendar-element w-full" />
              </div>
              <transition name="expand">
                <div v-if="checkInDate && checkOutDate" class="w-full mt-4">
                  <label for="amenities" class="block text-center text-green-700">Amenities</label>
                  <MultiSelect v-model="selectedAmenities" :options="amenitiesOptions" :maxSelectedLabels="3" class="w-full" />
                </div>
              </transition>
            </div>
          </aside>
        </div>
      </section>
    </header>

    <!-- Slogan Divs -->
    <section class="flex flex-wrap justify-center gap-6 mt-10 max-w-[1111px]">
      <div class="slogan-card relative group">
        <h3 class="slogan-title">Explore the Outdoors</h3>
        <p class="slogan-text">Find the best camping spots in nature.</p>
        <div class="campfire-animation"></div>
      </div>
      <div class="slogan-card relative group">
        <h3 class="slogan-title">Reconnect with Nature</h3>
        <p class="slogan-text">Discover tranquil and serene locations.</p>
        <div class="campfire-animation"></div>
      </div>
      <div class="slogan-card relative group">
        <h3 class="slogan-title">Easy Booking</h3>
        <p class="slogan-text">Book your perfect campsite effortlessly.</p>
        <div class="campfire-animation"></div>
      </div>
    </section>

    <div v-if="checkInDate && checkOutDate" class="w-full max-w-[1111px] mt-16">
      <div class="">
        <list-campsites :startDate="formattedCheckInDate" :endDate="formattedCheckOutDate" :amenities="selectedAmenities"></list-campsites>
      </div>
    </div>
  </div>
</template>


<script>
import { ref, computed, watch, onMounted } from 'vue';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';

import Calendar from 'primevue/calendar';
import ListCampsites from './ListCampsites.vue';
import { jwtDecode } from 'jwt-decode';
import MultiSelect from 'primevue/multiselect';
import Map from './Map.vue';
export default {
  name: 'HomePage',
  components: {
    IconField,
    InputIcon,
    InputText,
    Calendar,
    ListCampsites,
    MultiSelect,
    Map
  },
  setup() {
    const amenitiesOptions = ref([]);
    const selectedAmenities = ref([]);
    const checkInDate = ref(null);
    const checkOutDate = ref(null);
    const firstName = ref('');
    const lastName = ref('');
    const maxDate=ref(new Date());
    maxDate.value.setDate(maxDate.value.getDate() + 1);

    const formatDate = (date) => {
      if (!date) return '';
      const d = new Date(date);
      let month = '' + (d.getMonth() + 1);
      let day = '' + d.getDate();
      const year = d.getFullYear();
      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;
      return [month, day, year].join('/');
    };

    const tokenCheck = () => {
      return sessionStorage.getItem('jwtToken');
    };

    const GetAmenities = async () => {
      try {
        const amenities = await fetch("https://localhost:7084/Amenities/GetAllAmenities");
        const data = await amenities.json();
        amenitiesOptions.value = data.map(amens => amens.name);
      } catch {
        console.log("Error occurred with fetching amenities");
      }
    };

    const formattedCheckInDate = computed(() => formatDate(checkInDate.value));
    const formattedCheckOutDate = computed(() => formatDate(checkOutDate.value));

    watch([formattedCheckInDate, formattedCheckOutDate], ([newCheckIn, newCheckOut]) => {
      console.log(`Formatted Check-In Date: ${newCheckIn}, Formatted Check-Out Date: ${newCheckOut}`);
    });

    onMounted(() => {
      const token = sessionStorage.getItem('jwtToken');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          firstName.value = decodedToken.FirstName;
          lastName.value = decodedToken.LastName;
        } catch (error) {
          console.error("Error decoding JWT token:", error.message);
        }
      } else {
        console.error("JWT token not found in local storage");
      }
      GetAmenities();
    });

    return {
      checkInDate,
      checkOutDate,
      formattedCheckInDate,
      formattedCheckOutDate,
      firstName,
      lastName,
      tokenCheck,
      amenitiesOptions,
      selectedAmenities,
      GetAmenities,
      maxDate
      
    };
  },
};
</script>

<style scoped>
.calendar-element label {
  display: block;
  text-align: center;
}

.calendar-element .p-inputtext {
  text-align: center;
}

.bg-green-800 {
  background-color: #2f855a;
}

.calendar-element,
.campsite-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.calendar-element:hover,
.campsite-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.slogan-card {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
}

.slogan-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
}

.slogan-icon {
  width: 50px;
  height: 50px;
  margin-bottom: 10px;
}

.slogan-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #2f855a;
  margin-bottom: 5px;
}

.slogan-text {
  font-size: 1rem;
  color: #4a5568;
}

.campfire-animation {
  position: absolute;
  bottom: -50px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 120px;
}

.campfire-animation .flame {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 30px;
  height: 80px;
  background: radial-gradient(ellipse at bottom, #ff6f3c, transparent);
  border-radius: 50% 50% 0 0;
  transform-origin: bottom;
  animation: flame 1s infinite;
}

.campfire-animation .flame:nth-child(2) {
  width: 20px;
  height: 60px;
  animation: flame 1s infinite 0.1s;
}

.campfire-animation .flame:nth-child(3) {
  width: 40px;
  height: 100px;
  animation: flame 1s infinite 0.2s;
}

.campfire-animation .log {
  position: absolute;
  bottom: 0;
  width: 80px;
  height: 20px;
  background: #6b4423;
  border-radius: 0 0 5px 5px;
}

.campfire-animation .log:nth-child(5) {
  transform: rotate(45deg);
  bottom: 10px;
  left: 10px;
}

.campfire-animation .log:nth-child(6) {
  transform: rotate(-45deg);
  bottom: 10px;
  right: 10px;
}

/* Animation for expanding section */
.expand-enter-active, .expand-leave-active {
  transition: max-height 0.5s ease-in-out, opacity 0.5s ease-in-out;
}
.expand-enter, .expand-leave-to {
  max-height: 0;
  opacity: 0;
}

/* Tracking-in-expand animation */
.tracking-in-expand {
  -webkit-animation: tracking-in-expand 0.7s cubic-bezier(0.215, 0.610, 0.355, 1.000) both;
          animation: tracking-in-expand 0.7s cubic-bezier(0.215, 0.610, 0.355, 1.000) both;
}
@-webkit-keyframes tracking-in-expand {
  0% {
    letter-spacing: -0.5em;
    opacity: 0;
  }
  40% {
    opacity: 0.6;
  }
  100% {
    opacity: 1;
  }
}
@keyframes tracking-in-expand {
  0% {
    letter-spacing: -0.5em;
    opacity: 0;
  }
  40% {
    opacity: 0.6;
  }
  100% {
    opacity: 1;
  }
}
</style>
