import { createRouter, createWebHistory } from 'vue-router'
import { createApp } from 'vue'
import App from './App.vue'
import store from './store';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { VeeValidate } from 'vee-validate';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faHome,
  faUser,
  faUserPlus,
  faSignInAlt,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import Home from './views/Home.vue';
import Login from './views/Login.vue';
import Register from './views/Register.vue';

library.add(faHome, faUser, faUserPlus, faSignInAlt, faSignOutAlt);

// Vue.config.productionTip = false;


const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
        path: "/users",
        alias: "/users",
        name: "users",
        component: () => import("./components/UsersList")
      },
      {
        path: '/',
        name: 'home',
        component: Home
      },
      {
        path: '/home',
        component: Home
      },
      {
        path: '/login',
        component: Login
      },
      {
        path: '/register',
        component: Register
      },
      {
        path: '/admin',
        name: 'admin',
        // lazy-loaded
        component: () => import('./views/BoardAdmin.vue')
      },
  ],
})

const app = createApp(App)

app.use(router)
app.use(store)
app.use(VeeValidate)
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')