import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/components/HomePage.vue';
import LoginForm from '@/components/LoginForm.vue';
import RegistrationForm from '@/components/RegistrationForm.vue';
import UserPage from '@/components/UserPage.vue';
import CampsiteDetails from '@/components/CampsiteDetails.vue';
import UserSettings from '@/components/UserSettings.vue';
import UserBookings from '@/components/UserBookings.vue';
import BookCampsite from '@/components/BookCampsite.vue'; // Import the BookCampsite component
import BookingReview from '@/components/BookingReview.vue';
import AdminPanel from '@/components/AdminPanel.vue';
import AdminOverview from '@/components/AdminOverview.vue';
const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/login',
    name: 'LoginForm',
    component: LoginForm
  },
  {
    path:'/register',
    name:'RegistrationForm',
    component: RegistrationForm
  },
  {
    path:'/user',
    name:'UserPage',
    component:UserPage

  },
  {
    path:'/campsite/:id',
    name:'CampsiteDetails',
    component:CampsiteDetails
  },
  {
   path:'/settings',
   name:'UserSettings',
   component:UserSettings
  },
  {
    path:'/bookings',
    name:'UserBookings',
    component:UserBookings
    
  },
  {
    path:'/book/campsite/:id',
    name:'BookCampsite',
    component:BookCampsite
  },
  {
    path:'/bookings/:id/review',
    name:'BookingReview',
    component:BookingReview
  },
  {
    path:'/admin/settings',
    name:'AdminPanel',
    component:AdminPanel
  },
  {
    path:'/admin/overview',
    name:'AdminOverview',
    component:AdminOverview
  }
  
  
];


const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
