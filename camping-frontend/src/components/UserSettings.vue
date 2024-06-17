<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-5">
    <div class="card bg-white shadow-lg rounded-lg p-8 w-full max-w-5xl">
      <div class="flex items-center mb-8">
        <img :src="profilePictureUrl" alt="Profile Picture" class="w-24 h-24 rounded-full border-2 border-gray-300 mr-6">
        <div>
          <h2 class="text-3xl font-semibold text-gray-900">{{ firstName }} {{ lastName }}</h2>
          <p class="text-gray-600">{{ email }}</p>
        </div>
      </div>

      <h3 class="text-xl font-semibold text-gray-900 mb-4">Edit Information</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 mt-10">
        <div>
          <FloatLabel>
            <InputText id="firstName" v-model="firstName" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"/>
            <label for="firstName">First Name</label>
          </FloatLabel>
        </div>
        <div>
          <FloatLabel>
            <InputText id="lastName" v-model="lastName" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"/>
            <label for="lastName">Last Name</label>
          </FloatLabel>
        </div>
        <div>
          <FloatLabel>
            <InputText id="email" v-model="email" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"/>
            <label for="email">Email</label>
          </FloatLabel>
        </div>
        <div>
          <FloatLabel>
            <Dropdown id="gender" v-model="gender" :options="genders" optionLabel="name" placeholder="Gender" class="w-full h-10.2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-base" />


            <label for="gender">Gender</label>
          </FloatLabel>
        </div>
        <div>
          <FloatLabel>
            <VueDatePicker v-model="dob"   :format="format" :enableTimePicker="false" @open="onCalendarToggle" :disabledDates="disableDates"/>
          
            
            <label v-if="!isCalendarOpen" for="dob">Date of Birth</label>
          
          </FloatLabel>
        </div>
      </div>
      <Button label="Save Changes" class="w-full bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition duration-300" @click="saveChanges"/>

      <h3 class="text-xl font-semibold text-gray-900 mt-10 mb-4">Password Reset</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <FloatLabel>
            <InputText id="password" v-model="password" type="password" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"/>
            <label for="password">New Password</label>
          </FloatLabel>
        </div>
        <div>
          <FloatLabel>
            <InputText id="confirm-password" v-model="confirm_password" type="password" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" :invalid="!passwordsMatch"/>
            <label for="confirm-password">Confirm Password</label>
          </FloatLabel>
          <small v-if="!passwordsMatch" class="text-red-500">Passwords do not match.</small>
        </div>
      </div>
      <Button label="Reset Password" class="w-full bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition duration-300" :disabled="!passwordsMatch" @click="resetPassword"/>

      <Button label="View Bookings" class="mt-6 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition duration-300" @click="redirectToUserBookings"/>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { jwtDecode } from 'jwt-decode';
import { onMounted } from 'vue';
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';
import Dropdown from 'primevue/dropdown';
import Card from 'primevue/card';
import Button from 'primevue/button';
import VueDatePicker from '@vuepic/vue-datepicker';

const profilePictureUrl = ref('https://i.pinimg.com/736x/2b/67/2c/2b672cf567fada2260c7feb0e87b2eb7.jpg'); // Replace with actual profile picture URL
const firstName = ref('Olivia');
const lastName = ref('Rhye');
const email = ref('olivia@untitledui.com');
const gender = ref();
const genders = ref([
    { name: 'Female', code: 'F' },
    { name: 'Male', code: 'M' },
    { name: 'Other', code: 'X' },
]);
const dob = ref('1990-01-01');
const password = ref('');
const minDate = computed(() => {
  const today = new Date();
  today.setFullYear(today.getFullYear() - 18);
  return today;
});

// Computed property that returns a function to disable dates before the minimum date
const disableDates = computed(() => {
  return (date) => {
    return date > minDate.value;
  };
});

const confirm_password = ref('');
const router = useRouter();
const isCalendarOpen = ref(false);
const redirectToUserBookings = () => {
  // Redirect to userbookings page
  router.push('/bookings');
};
const onCalendarToggle = () => {
  if(isCalendarOpen.value==true){
    isCalendarOpen.value = false;

  }
  else{
    isCalendarOpen.value = true;
  }
  
  console.log('value is', isCalendarOpen.value);
};
const passwordsMatch = computed(() => {
  return password.value !== '' && password.value === confirm_password.value;
});
const getUser = async () => {
  try {
    const decodedToken = jwtDecode(sessionStorage.getItem('jwtToken')); // Decode JWT token
    const userId = decodedToken.UserID;
    const response = await fetch(`https://localhost:7084/User/${userId}`);
    
    if (response.ok) {
      const data = await response.json();
      
      firstName.value = data.firstName;
      lastName.value = data.lastName;
      dob.value = data.dob;
      gender.value = data.gender;
      email.value = data.email;
    } else {
      console.error('Failed to fetch user data:', response.statusText);
    }
  } catch (error) {
    console.error('An error occurred while fetching user data:', error);
  }
};
const resetPassword = async () => {
  const jwtToken = sessionStorage.getItem('jwtToken');
  if (!jwtToken) {
    console.error('JWT token not found in session storage');
    return;
  }

  try {
    const decodedToken = jwtDecode(jwtToken); // Decode JWT token
    const userId = decodedToken.UserID; // Extract user ID from decoded token
    console.log('User ID:', userId);
    const response = await fetch("https://localhost:7084/User/ResetPassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        new_password: password.value,
        confirm_password: confirm_password.value
      })
    });

    if (response.ok) {
      // Password reset successfully
      console.log('Password reset successfully');
      alert("Password reset successfully.")
    } else {
      console.error('Failed to reset password:', response.statusText);
      alert("Password reset failed.")
    }
  } catch (error) {
    console.error('An error occurred:', error);
    alert("Password reset failed.")
  }
}
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


const saveChanges = async () => {
  const jwtToken = sessionStorage.getItem('jwtToken');
  if (!jwtToken) {
    console.error('JWT token not found in session storage');
    return;
  }

  try {
    const decodedToken = jwtDecode(jwtToken);
    const userId = decodedToken.UserID;
    console.log('User ID:', userId);

    const requestData = {
      id: userId,
      firstName: firstName.value || '',
      lastName: lastName.value || '',
      dob: new Date(dob.value).toISOString() || '',
      gender: gender.value.name || '',
      email: email.value || ''
    };

    const response = await fetch("https://localhost:7084/User/ModifyUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      },
      body: JSON.stringify(requestData)
    });

    if (response.ok) {
      console.log('User information updated successfully');
      alert("User information updated successfully.");
    } else {
      console.error('Failed to update user information:', response.statusText);
      alert("Failed to update user information.");
    }
  } catch (error) {
    console.error('An error occurred:', error);
    alert("Failed to update user information.");
  }
};
onMounted(() => {
  if(!sessionStorage.getItem("jwtToken")){
    router.push('/');
  }
  getUser();
});
</script>

<style scoped>
.min-h-screen {
  background: linear-gradient(135deg, #f3f4f6 0%, #ffffff 100%);
}

.card {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

button {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #2f855a;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #276749;
}

.text-gray-900 {
  color: #1a202c;
}

.text-gray-600 {
  color: #718096;
}

.text-red-500 {
  color: #f56565;
}

.w-24 {
  width: 6rem;
}

.h-24 {
  height: 6rem;
}

.rounded-full {
  border-radius: 9999px;
}

.border-2 {
  border-width: 2px;
}

.border-gray-300 {
  border-color: #d1d5db;
}

.mr-6 {
  margin-right: 1.5rem;
}

.grid {
  display: grid;
}

.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

.md\:grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.gap-6 {
  gap: 1.5rem;
}

</style>
