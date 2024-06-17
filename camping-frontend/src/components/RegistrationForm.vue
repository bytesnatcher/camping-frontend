<template>
  <div class="registration-container">
    <div class="left-panel">
      <div id="campfire">
        <div class="section-center">
          <div class="moon">
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div class="shooting-star"></div>
          <div class="shooting-star-2"></div>
          <div class="star"></div>
          <div class="star snd"></div>
          <div class="star trd"></div>
          <div class="star fth"></div>
          <div class="star fith"></div>
          <div class="circle"></div>
          <div class="wood-circle"></div>
          <div class="wood"></div>
          <div class="tree-1"></div>
          <div class="tree-2"></div>
          <div class="fire">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div class="smoke">
            <span class="s-0"></span>
            <span class="s-1"></span>
            <span class="s-2"></span>
            <span class="s-3"></span>
            <span class="s-4"></span>
            <span class="s-5"></span>
            <span class="s-6"></span>
            <span class="s-7"></span>
            <span class="s-8"></span>
            <span class="s-9"></span>
          </div>
        </div>
      </div>
      <h1>Find Your Perfect Campsite</h1>
      <p>Join our community and discover the best campsites around the world.</p>
      
    </div>
    <div class="right-panel">
      <h2>Create an Account</h2>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="firstName">First Name:</label>
          <input type="text" id="firstName" v-model="firstName" required>
        </div>
        <div class="form-group">
          <label for="lastName">Last Name:</label>
          <input type="text" id="lastName" v-model="lastName" required>
        </div>
        <div class="form-group">
          <label for="dob">Date of Birth:</label>
          <input type="date" id="dob" v-model="dob" required>
        </div>
        <div class="form-group">
          <label for="gender">Gender:</label>
          <select id="gender" v-model="gender" required>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="email" required>
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="password" required>
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const firstName = ref('');
    const lastName = ref('');
    const dob = ref('');
    const gender = ref('');
    const email = ref('');
    const password = ref('');
    const router = useRouter();

    onMounted(() => {
      // Load the campfire animation script
      const script = document.createElement('script');
      script.innerHTML = `
        $("#switch").on('click', function () {
          if ($("body").hasClass("fire-off")) {
            $("body").removeClass("fire-off");
            $("#switch").removeClass("switched");
          } else {
            $("body").addClass("fire-off");
            $("#switch").addClass("switched");
          }
        });
      `;
      document.body.appendChild(script);
    });

    const handleRegister = async () => {
      const userData = {
        firstName: firstName.value,
        lastName: lastName.value,
        dob: new Date().toISOString(),
        gender: gender.value,
        email: email.value,
        password: password.value,
      };

      const registrationResponse = await fetch('https://localhost:7084/User/AddUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      const successRegister = await registrationResponse.text();
      alert(successRegister);
      if (successRegister) {
        const loginResponse = await fetch('https://localhost:7084/User/Authenticate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: email.value, password: password.value }),
        });
        if (!loginResponse.ok) {
          alert('WRONG LOGIN');
        }

        const token = await loginResponse.text();
        sessionStorage.setItem('jwtToken', token);
        console.log('JWT Token:', token);
        router.push('/').then(() => {
          window.location.reload();
        });
      }
    };

    return {
      firstName,
      lastName,
      dob,
      gender,
      email,
      password,
      handleRegister
    };
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap');

.registration-container {
  display: flex;
  height: 100vh;
  background: linear-gradient(135deg, #0b3d0b, #004d00);
  font-family: 'Montserrat', sans-serif;
}

.left-panel {
  flex: 1;
  background: #0b3d0b;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  position: relative;
}

#campfire {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 100px;
  height: 100px;
  z-index: 0;
}

.left-panel h1 {
  font-size: 2rem;
  margin-top: 150px;
  text-align: center;
  z-index: 1;
}

.left-panel p {
  font-size: 1rem;
  text-align: center;
  max-width: 400px;
  z-index: 1;
}

.right-panel {
  flex: 1;
  background: #004d00;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  box-shadow: -10px 0 20px rgba(0, 0, 0, 0.5);
}

.right-panel h2 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: white;
}

.form-group {
  margin-bottom: 1rem;
  width: 100%;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: white;
  font-weight: bold;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

button {
  width: 100%;
  
  border: none;
  border-radius: 4px;
  background-color: #1a751a;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #145214;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  box-shadow: 0 0 5px #1a751a;
}

.section-center {
  position: relative;
  width: 300%;
  height: 300%;
  top: 0;
  left: 0;
  display: block;
  overflow: hidden;
  border-radius: 50%;
  z-index: 5;
  background-color: #1d4456;
  box-shadow: 0 0 50px 5px rgba(255, 148, 0, .1);
}

.wood {
  position: absolute;
  z-index: 21;
  left: 50%;
  bottom: 12%;
  width: 100px;
  margin-left: -50px;
  height: 36px;
  background-image: url('https://ivang-design.com//svg-load/air/wood.png');
  background-size: 100px 36px;
}

.wood-circle {
  position: absolute;
  z-index: 20;
  left: 50%;
  bottom: 11%;
  width: 120px;
  margin-left: -60px;
  height: 26px;
  border-radius: 100%;
  background-color: #0a171d;
}

.circle {
  position: absolute;
  z-index: 6;
  right: -300px;
  bottom: -450px;
  width: 750px;
  height: 700px;
  border-radius: 100%;
  background-color: #112630;
}

.moon {
  position: absolute;
  top: 50px;
  left: 115px;
  width: 80px;
  display: block;
  height: 80px;
  background-color: #b2b7bc;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow:
    inset -20px 2px 0 0px #c0c3c9,
    0 0 10px 5px rgba(228, 228, 222, .4);
  z-index: 1;
  animation: brilla-moon 4s alternate infinite;
}

.moon div:nth-child(1) {
  position: absolute;
  top: 50%;
  left: 10%;
  width: 12%;
  height: 12%;
  border-radius: 50%;
  border: 1px solid #adaca2;
  border-radius: 50%;
  box-shadow: inset 2px -1px 0 0px #85868b;
  opacity: 0.4;
}

.moon div:nth-child(2) {
  position: absolute;
  top: 20%;
  left: 38%;
  width: 16%;
  height: 16%;
  border-radius: 50%;
  border: 1px solid #adaca2;
  border-radius: 50%;
  box-shadow: inset 2px -1px 0 0px #85868b;
  opacity: 0.4;
}

.moon div:nth-child(3) {
  position: absolute;
  top: 60%;
  left: 45%;
  width: 20%;
  height: 20%;
  border-radius: 50%;
  border: 1px solid #adaca2;
  border-radius: 50%;
  box-shadow: inset 2px -1px 0 0px #85868b;
  opacity: 0.4;
}

.moon {
  -webkit-transition: all 2000ms linear;
  transition: all 2000ms linear;
}

@keyframes brilla-moon {
  0% {
    box-shadow:
      inset -20px 2px 0 0px #c0c3c9,
      0 0 10px 5px rgba(228, 228, 222, .4);
  }
  50% {
    box-shadow:
      inset -20px 2px 0 0px #c0c3c9,
      0 0 15px 8px rgba(228, 228, 222, .4);
  }
}

.shooting-star {
  z-index: 2;
  width: 1px;
  height: 50px;
  border-bottom-left-radius: 50%;
  border-bottom-right-radius: 50%;
  position: absolute;
  top: 0;
  left: -70px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0), white);
  animation: animShootingStar 6s linear infinite;
  -webkit-transition: all 2000ms linear;
  transition: all 2000ms linear;
}

@keyframes animShootingStar {
  from {
    transform: translateY(0px) translateX(0px) rotate(-45deg);
    opacity: 1;
    height: 5px;
  }
  to {
    transform: translateY(1280px) translateX(1280px) rotate(-45deg);
    opacity: 1;
    height: 800px;
  }
}

.shooting-star-2 {
  z-index: 2;
  width: 1px;
  height: 50px;
  border-bottom-left-radius: 50%;
  border-bottom-right-radius: 50%;
  position: absolute;
  top: 0;
  left: 200px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0), white);
  animation: animShootingStar-2 9s linear infinite;
  -webkit-transition: all 2000ms linear;
  transition: all 2000ms linear;
}

@keyframes animShootingStar-2 {
  from {
    transform: translateY(0px) translateX(0px) rotate(-45deg);
    opacity: 1;
    height: 5px;
  }
  to {
    transform: translateY(1920px) translateX(1920px) rotate(-45deg);
    opacity: 1;
    height: 800px;
  }
}

.star {
  z-index: 2;
  position: absolute;
  top: 185px;
  left: 25px;
  background-image: url('https://ivang-design.com//svg-load/air/star.png');
  background-size: 15px 15px;
  width: 15px;
  height: 15px;
  opacity: 0.4;
  animation: starShine 3.5s linear infinite;
  -webkit-transition: all 1200ms linear;
  transition: all 1200ms linear;
}

.star.snd {
  top: 100px;
  left: 310px;
  animation-delay: 1s;
}

.star.trd {
  top: 130px;
  left: 100px;
  animation-delay: 1.4s;
}

.star.fth {
  top: 20px;
  left: 200px;
  animation-delay: 1.8s;
}

.star.fith {
  top: 85px;
  left: 220px;
  animation-delay: 2.2s;
}

@keyframes starShine {
  0% {
    transform: scale(0.3) rotate(0deg);
    opacity: 0.4;
  }
  25% {
    transform: scale(1) rotate(360deg);
    opacity: 1;
  }
  50% {
    transform: scale(0.3) rotate(720deg);
    opacity: 0.4;
  }
  100% {
    transform: scale(0.3) rotate(0deg);
    opacity: 0.4;
  }
}

.tree-1 {
  position: relative;
  top: 150px;
  left: 50px;
  width: 0;
  height: 0;
  z-index: 8;
  display: block;
  border-bottom: 90px solid #0a171d;
  border-left: 30px solid transparent;
  border-right: 30px solid transparent;
}

.tree-1:before {
  position: absolute;
  bottom: -110px;
  left: 50%;
  margin-left: -4px;
  width: 8px;
  display: block;
  height: 30px;
  z-index: 7;
  content: '';
  background-color: #000;
}

.tree-2 {
  position: relative;
  top: 0;
  left: 250px;
  width: 0;
  height: 0;
  z-index: 8;
  display: block;
  border-bottom: 90px solid #0a171d;
  border-left: 30px solid transparent;
  border-right: 30px solid transparent;
}

.tree-2:before {
  position: absolute;
  bottom: -110px;
  left: 50%;
  margin-left: -4px;
  width: 8px;
  display: block;
  height: 30px;
  z-index: 7;
  content: '';
  background-color: #000;
}

.fire {
  position: absolute;
  z-index: 39;
  width: 2px;
  margin-left: -1px;
  left: 50%;
  bottom: 80px;
  -webkit-transition: all 1200ms linear;
  transition: all 1200ms linear;
}

.fire span {
  display: block;
  position: absolute;
  bottom: -15px;
  margin-left: -20px;
  height: 0px;
  width: 0px;
  border: 30px solid #febd08;
  border-radius: 50%;
  border-top-left-radius: 0;
  left: -9px;
  box-shadow:
    0 0 10px 5px rgba(244, 110, 28, 0.8),
    0 0 20px 10px rgba(244, 110, 28, 0.6),
    0 0 30px 15px rgba(244, 110, 28, 0.3);
  transform: scale(0.45, 0.75) rotate(45deg);
  animation: brilla-fire 2.5s alternate infinite;
  z-index: 9;
  -webkit-transition: all 1200ms linear;
  transition: all 1200ms linear;
}

.fire span:after {
  display: block;
  position: absolute;
  bottom: -30px;
  content: '';
  margin-left: -5px;
  height: 30px;
  width: 12px;
  background-color: rgba(244, 110, 28, 0.7);
  border-radius: 80px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  box-shadow:
    0 0 20px 10px rgba(244, 110, 28, 0.7);
  left: -9px;
  opacity: 0.8;
  transform: rotate(-50deg);
}

.fire span:nth-child(2) {
  left: -22px;
  transform: scale(0.3, 0.55) rotate(15deg);
  z-index: 8;
  animation: brilla-fire 1.5s alternate infinite;
}

.fire span:nth-child(3) {
  left: 4px;
  transform: scale(0.3, 0.55) rotate(80deg);
  z-index: 8;
  animation: brilla-fire 2s alternate infinite;
}

@keyframes brilla-fire {
  0%, 100% {
    box-shadow:
      0 0 10px 5px rgba(244, 110, 28, 0.8),
      0 0 20px 10px rgba(244, 110, 28, 0.6),
      0 0 30px 15px rgba(244, 110, 28, 0.3);
  }
  50% {
    box-shadow:
      0 0 14px 7px rgba(244, 110, 28, 0.8),
      0 0 28px 14px rgba(244, 110, 28, 0.6),
      0 0 42px 21px rgba(244, 110, 28, 0.3);
  }
}

.smoke {
  position: absolute;
  z-index: 40;
  width: 2px;
  margin-left: -1px;
  left: 50%;
  bottom: 106px;
  opacity: 0;
  -webkit-transition: all 800ms linear;
  transition: all 800ms linear;
}

.smoke span {
  display: block;
  position: absolute;
  bottom: -35px;
  left: 50%;
  margin-left: -20px;
  height: 0px;
  width: 0px;
  border: 30px solid rgba(0, 0, 0, .6);
  border-radius: 22px;
  border-bottom-left-radius: 0;
  border-top-right-radius: 0;
  left: -9px;
  opacity: 0;
  transform: scale(0.2, 0.2) rotate(-45deg);
}

@keyframes smokeLeft {
  0% { transform: scale(0.2, 0.2) translate(0, 0) rotate(-45deg) }
  10% { opacity: 1; transform: scale(0.2, 0.3) translate(0, -5px) rotate(-45deg) }
  60% { opacity: 0.6; transform: scale(0.3, 0.5) translate(-10px, -80px) rotate(-45deg) }
  100% { opacity: 0; transform: scale(0.4, 0.8) translate(-20px, -120px) rotate(-45deg) }
}

@keyframes smokeRight {
  0% { transform: scale(0.2, 0.2) translate(0, 0) rotate(-45deg) }
  10% { opacity: 1; transform: scale(0.2, 0.3) translate(0, -5px) rotate(-45deg) }
  60% { opacity: 0.6; transform: scale(0.3, 0.5) translate(10px, -80px) rotate(-45deg) }
  100% { opacity: 0; transform: scale(0.4, 0.8) translate(20px, -120px) rotate(-45deg) }
}

.smoke .s-0 {
  animation: smokeLeft 7s 0s infinite
}

.smoke .s-1 {
  animation: smokeRight 7s 0.7s infinite
}

.smoke .s-2 {
  animation: smokeLeft 7s 1.4s infinite
}

.smoke .s-3 {
  animation: smokeRight 7s 2.1s infinite
}

.smoke .s-4 {
  animation: smokeLeft 7s 2.8s infinite
}

.smoke .s-5 {
  animation: smokeRight 7s 3.5s infinite
}

.smoke .s-6 {
  animation: smokeLeft 7s 4.2s infinite
}

.smoke .s-7 {
  animation: smokeRight 7s 4.9s infinite
}

.smoke .s-8 {
  animation: smokeLeft 7s 5.6s infinite
}

.smoke .s-9 {
  animation: smokeRight 7s 6.3s infinite
}

/* #Switched
================================================== */

body.fire-off .fire-on {
  opacity: 0;
}

.section-center {
  -webkit-transition: all 500ms linear;
  transition: all 500ms linear;
}

body.fire-off .section-center {
  box-shadow: 0 0 50px 5px rgba(200, 200, 200, .2);
}

body.fire-off .smoke {
  opacity: 1;
  transition-delay: 0.8s;
}

body.fire-off .fire span {
  bottom: -35px;
  left: -9px;
  transform: scale(0.15, 0.15) rotate(45deg);
}
</style>
