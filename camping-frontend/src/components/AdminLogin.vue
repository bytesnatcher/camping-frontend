<template>
    <div>
      <navbar></navbar>
  
      
      <div class="login-form">
        <h2>Login</h2>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <FloatLabel>
                <InputText id="email" v-model="email" />
                <label v-if="showLabel" for="email">Email</label>
            </FloatLabel>
          </div>
          <br>
          <div class="form-group">
            <FloatLabel>
              <InputText type="password" id="password" v-model="password" />
              <label v-if="showLabel" for="password">Password</label>
          </FloatLabel>
  
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent, ref } from 'vue';
  import { useRouter } from 'vue-router'; 
  import InputText from 'primevue/inputtext';
  import FloatLabel from 'primevue/floatlabel';
  import Password from'primevue/password';
  
  export default defineComponent({
    name: 'LoginForm',
    components:{
      InputText,
      FloatLabel,
      Password
    },
    setup() {
      var email = ref('');
      var password = ref('');
      const showLabel = ref(true); // Boolean variable to control label visibility
      const router = useRouter(); // Initialize router
  
      const handleLogin = async () => {
        try {
          const userData = {
            email: email.value,
            password: password.value,
          };
  
          const response = await fetch('https://localhost:7084/User/Authenticate', {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          });
  
          if (!response.ok) {
            throw new Error("Invalid credentials");
          }
  
          const token = await response.text();
          // Save token to local storage
          sessionStorage.setItem('jwtToken', token);
  
          console.log("JWT Token:", token);
  
          // Redirect to user page after successful login
          router.push('/').then(() => {
            // Refresh the home page
            window.location.reload();
          }); // Assuming '/user' is the route to the user page
        } catch (error) {
          console.error("Login failed:", error.message);
        }
      };
  
      return {
        email,
        password,
        handleLogin,
        showLabel, // Return the showLabel ref
      };
    },
  });
  </script>
  
  <style scoped>
  .login-form {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #f9f9f9;
  }
  
  .login-form h2 {
    margin-bottom: 20px;
    text-align: center;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 5px;
  }
  
  .form-group input {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  button {
    width: 100%;
    padding: 10px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #218838;
  }
  
  p {
    text-align: center;
  }
  </style>
  