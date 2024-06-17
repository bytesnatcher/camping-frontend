<template>
    <div class="campsites grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      <div class="campsite" v-for="campsite in campsites" :key="campsite.id">
        <Card class="h-full w-full cursor-pointer transition-transform transform hover:scale-105 hover:shadow-xl">
          <template #header>
            <img :src="campsite.images[0]" :alt="campsite.name" class="rounded-t-lg"/>
          </template>
          <template #title>
            <router-link class="font-semibold text-lg text-gray-800" :to="{ name: 'CampsiteDetails', params: { id: campsite.id } }">
              {{ campsite.name }}
            </router-link>
          </template>
          <template #content>
            <p class="font-light text-gray-600">{{ campsite.address }}</p>
            <div class="grid grid-cols-2 gap-2 mt-2">
              <Chip v-for="(amenity, index) in campsite.amenities" :key="index" :label="amenity" class="p-chip--rounded bg-blue-100 text-blue-600"/>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import Card from 'primevue/card';
  import Chip from 'primevue/chip';
  
  export default {
    components: {
      Card,
      Chip
    },
    props: {
      startDate: String,
      endDate: String,
      amenities: Array
    },
    setup(props) {
      const campsites = ref([]);
  
      const fetchCampsites = async (startDate, endDate) => {
        try {
          const response = await fetch('https://localhost:7084/Campsite');
          campsites.value = await response.json();
          fetchCampsiteAmenities();
        } catch (error) {
          console.error("Error fetching campsites:", error.message);
        }
      };
  
     
      const fetchCampsiteAmenities = async () => {
        try {
          for (const campsite of campsites.value) {
            const amenityResponse = await fetch(`https://localhost:7084/Amenities/GetCampsiteAmenities?campsite_id=${campsite.id}`);
            const amenityData = await amenityResponse.json();
            campsite.amenities = amenityData.map(amenity => amenity.name);
          }
        } catch (error) {
          console.error("Error fetching amenities:", error.message);
        }
      };
  
      onMounted(() => {
        fetchCampsites(props.startDate, props.endDate);
      });
  
      return {
        campsites
      };
    }
  };
  </script>
  
  <style scoped>
  .campsite img {
    max-width: 100%;
    height: auto;
    border-radius: 5px;
  }
  
  .campsite {
    border-radius: 10px;
    overflow: hidden;
    transition: box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out;
  }
  
  .campsite:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
  
  .campsite .p-chip--rounded {
    border-radius: 9999px;
    padding: 0.5rem 1rem;
  }
  </style>
  