<template>
  <div class="relative min-h-screen flex flex-col items-center justify-center">
    <video autoplay muted loop class="absolute top-0 left-0 w-full h-full object-cover z-0">
      <source src="../assets/hiking.mp4" type="video/mp4">
      Your browser does not support the video tag.
    </video>
    <div class="relative z-10 w-full max-w-md">
      <navbar></navbar>
      <div class="login-form bg-white shadow-lg rounded-lg p-8">
        <h2 class="text-3xl font-bold text-center mb-6">Login</h2>
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div class="form-group">
            <FloatLabel>
              <InputText id="email" v-model="email" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"/>
              <label v-if="showLabel" for="email">Email</label>
            </FloatLabel>
          </div>
          <div class="form-group">
            <FloatLabel>
              <InputText type="password" id="password" v-model="password" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"/>
              <label v-if="showLabel" for="password">Password</label>
            </FloatLabel>
          </div>
          <button type="submit" class="w-full py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-transform transform hover:scale-105 duration-300">Login</button>
        </form>
      </div>
      <p class="mt-4 text-center text-white">New user? <span><router-link to="/register" class="text-green-600 hover:underline">Register here</router-link></span></p>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import {jwtDecode} from 'jwt-decode';
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';
import Password from 'primevue/password';

export default defineComponent({
  name: 'LoginForm',
  components: {
    InputText,
    FloatLabel,
    Password,
  },
  setup() {
    const email = ref('');
    const password = ref('');
    const showLabel = ref(true);
    const router = useRouter();

    const handleLogin = async () => {
      try {
        const userData = {
          email: email.value,
          password: password.value,
        };

        const response = await fetch('https://localhost:7084/User/Authenticate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        if (!response.ok) {
          alert('Invalid credentials');
          throw new Error('Invalid credentials');
        }

        const token = await response.text();
        const decodedToken = jwtDecode(token);

        sessionStorage.setItem('jwtToken', token);

        if (decodedToken.IsAdmin === 'False') {
          router.push('/').then(() => {
            window.location.reload();
          });
        } else {
          router.push('/admin/settings').then(() => {
            window.location.reload();
          });
        }
      } catch (error) {
        console.error('Login failed:', error.message);
      }
    };

    return {
      email,
      password,
      handleLogin,
      showLabel,
    };
  },
});
</script>

<style scoped>
.login-form {
  max-width: 400px;
  width: 100%;
  animation: fadeInUp 1s ease-in-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Ensure video background covers entire screen */
video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
}

.relative.z-10 {
  z-index: 10;
}
</style>
