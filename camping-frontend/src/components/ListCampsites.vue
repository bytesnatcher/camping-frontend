<template>
  <div v-if="startDate && endDate" class="campsites grid grid-cols-3 gap-4">
    <div class="campsite pb-10" v-for="campsite in filteredCampsites" :key="campsite.id">
      <Card class="h-full w-full cursor-pointer hover:animate-shake relative">
        <template #header>
          <img :src="campsite.images[0]" :alt="campsite.name" />
        </template>
        <template #title>
          <router-link class="font-thin" :to="{ name: 'CampsiteDetails', params: { id: campsite.id } }">
            {{ campsite.name }}
          </router-link>
        </template>
        <template #content>
          <p class="font-light">{{ campsite.address }}</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pb-1">
            <Chip v-for="(amenity, index) in campsite.amenities" :key="index" :label="amenity" />
          </div>
          <div class="price-tag">
            €{{ campsite.price }} per night
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import Card from 'primevue/card';
import Chip from 'primevue/chip';
import InputNumber from 'primevue/inputnumber';

const props = defineProps({
  startDate: String,
  endDate: String,
  amenities: Array // New prop for desired amenities
});

const campsites = ref([]);

// Fetch campsites function
const fetchCampsites = async (startDate, endDate) => {
  try {
    const response = await fetch(`https://localhost:7084/Campsite/GetAvailableCampsites?start_date=${startDate}&end_date=${endDate}`);
    campsites.value = await response.json();
    fetchCampsiteAmenities();
  } catch (error) {
    console.error("Error fetching campsites:", error.message);
  }
};

// Fetch amenities data for each campsite
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

fetchCampsites(props.startDate, props.endDate);

// Watch for changes in startDate, endDate, or amenities props
watch([() => props.startDate, () => props.endDate, () => props.amenities], ([newStartDate, newEndDate, newAmenities]) => {
  if (newStartDate && newEndDate) {
    fetchCampsites(newStartDate, newEndDate);
  }
});

const filteredCampsites = computed(() => {
  if (!props.amenities || props.amenities.length === 0) {
    return campsites.value;
  }
  return campsites.value.filter(campsite => 
    props.amenities.every(amenity => campsite.amenities.includes(amenity))
  );
});
</script>

<style scoped>
.campsite img {
  max-width: 100%;
  height: auto;
  border-radius: 5px;
}

.price-tag {
  background-color: #4CAF50; /* Green */
  color: white;
  font-size: 1.25rem;
  font-weight: bold;
  padding: 0.5em;
  border-radius: 5px;
  text-align: center;
  position: absolute;
  top: 1rem;
  left: 1rem;
}

.animate-shake {
  animation: shake 0.8s cubic-bezier(0.215, 0.61, 0.35, 1) infinite;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25%, 75% { transform: translateX(-5px); }
  50% { transform: translateX(10px); }
}
</style>
