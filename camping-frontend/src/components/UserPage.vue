<template>
  <div>
    <router-link to="/settings" class="btn">User Settings</router-link>

    <div>
      <div class="welcome-message">
        <h1>Hi, {{ firstName }} {{ lastName }}! Fancying a trip?</h1>
      </div>

      <!-- Start date picker -->
      <input type="date" v-model="startDate" @change="fetchCampsites" />

      <!-- End date picker -->
      <input type="date" v-model="endDate" @change="fetchCampsites" />
      
      <div class="campsites">
        <div class="campsite" v-for="campsite in campsites" :key="campsite.id">
          <!-- Make campsite name clickable -->
          <router-link :to="{ name: 'CampsiteDetails', params: { id: campsite.id } }">
            <h2>{{ campsite.name }}</h2>
          </router-link>
          <p>{{ campsite.address }}</p>
          <p>City ID: {{ campsite.city_id }}</p>
          <img :src="campsite.images[0]" :alt="campsite.name" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import { jwtDecode } from 'jwt-decode';

export default defineComponent({
  name: 'UserPage',
  setup() {
    const firstName = ref('');
    const lastName = ref('');
    const campsites = ref([]);
    const startDate = ref('');
    const endDate = ref('');

    // Function to fetch campsite data from backend based on start and end dates
    const fetchCampsites = async () => {
      try {
        const response = await fetch(`https://localhost:7084/Campsite/GetAvailableCampsites?start_date=${startDate.value}&end_date=${endDate.value}`);
        const data = await response.json();
        campsites.value = data;
      } catch (error) {
        console.error("Error fetching campsites:", error.message);
      }
    };

    // On component mount, decode the JWT token
    onMounted(() => {
      const token = sessionStorage.getItem('jwtToken');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          firstName.value = decodedToken.FirstName; // Assuming firstName is a property in the token
          lastName.value = decodedToken.LastName; // Assuming lastName is a property in the token
        } catch (error) {
          console.error("Error decoding JWT token:", error.message);
        }
      } else {
        // Token not found in local storage, handle accordingly
        console.error("JWT token not found in local storage");
      }
    });

    return {
      firstName,
      lastName,
      campsites,
      startDate,
      endDate,
      fetchCampsites
    };
  }
});
</script>

<style scoped>
.welcome-message {
  text-align: center;
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
}

.campsites {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.campsite {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
  width: 300px;
}

.campsite img {
  max-width: 100%;
  height: auto;
  border-radius: 5px;
}
</style>
