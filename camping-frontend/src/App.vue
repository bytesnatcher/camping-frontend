<script setup>
  import HomePage from './components/HomePage.vue';
  import LoginForm from './components/LoginForm.vue';
  import BookCampsite from './components/BookCampsite.vue';
  import Navbar from './components/Navbar.vue';


</script>


<template>
  <div id="app">
    <Navbar></Navbar>
    <router-view></router-view> <!-- This is where the routed components will be rendered -->
    
  </div>
</template>


<style>

</style>

