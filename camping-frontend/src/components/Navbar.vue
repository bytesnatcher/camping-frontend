<template>
    <div class="card">
        <Menubar v-if="isAdmin" :model="admin_items"/>
        <Menubar v-else-if="isLoggedIn" :model="logout_items" />
        <Menubar v-else :model="items" />
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import Menubar from 'primevue/menubar';
import { useRouter } from 'vue-router';
import {jwtDecode} from 'jwt-decode';

const router = useRouter();
const items = ref([
    {
        label: 'Home',
        icon: 'pi pi-home',
        command: () => {
            router.push('/');
        }
    },
    {
        label: 'Log-in',
        icon: 'pi pi-key',
        command: () => {
            router.push('/login')
        }
    },
]);

const logout_items = ref([
    {
        label: 'Home',
        icon: 'pi pi-home',
        command: () => {
            router.push('/');
        }
    },
    {
        label: 'Log-out',
        icon: 'pi pi-key',
        command: () => {
            sessionStorage.clear();
            router.push('/').then(() => {
            // Refresh the home page
            window.location.reload();
          });
        }
    },
    {
        label: 'User',
        icon: 'pi pi-user',
        items: [
            {
                label: 'User settings',
                icon: 'pi pi-user-edit',
                command: () => {
                    router.push('/settings');
                }
            },
            {
                label: 'View bookings',
                icon: 'pi pi-book',
                command: () => {
                    router.push('/bookings');
                }
            },
        ]
    }
]);

const admin_items = ref([
    {
        label: 'Home',
        icon: 'pi pi-home',
        command: () => {
            router.push('/');
        }
    },
    {
        label: 'Log-out',
        icon: 'pi pi-key',
        command: () => {
            sessionStorage.clear();
            router.push('/').then(() => {
            window.location.reload();
          });
        }
    },
    {
        label: 'Admin',
        icon: 'pi pi-user',
        items: [
            {
                label: 'Create spot',
                icon: 'pi pi-user-edit',
                command: () => {
                    router.push('/admin/settings');
                }
            },
            {
                label: 'Camping spot overview',
                icon: 'pi pi-book',
                command: () => {
                    router.push('/admin/overview');
                }
            },
        ]
    }
]);

const getSessionToken = () => {
    return sessionStorage.getItem('jwtToken');
};

const isAdmin = computed(() => {
    const token = getSessionToken();
    if (token) {
        const decodedToken = jwtDecode(token);
        // Ensure the returned value is interpreted as a boolean
        return decodedToken.IsAdmin === 'True' || decodedToken.IsAdmin === true;
    }
    return false;
});

const isLoggedIn = computed(() => {
    return !!getSessionToken();
});
</script>
