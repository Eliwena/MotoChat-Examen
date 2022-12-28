<script setup>

import NavBar from './components/NavBar.vue'
// import { onMounted ,ref , computed} from 'vue';
// import AboutViews from './views/About.vue'
// const API_URL = "http://localhost:8000";

// const users = ref([]);

// onMounted(() => {
//   fetch(API_URL + '/users', {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//       "Access-Control-Allow-Origin": "*"
//     },
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(data)
//       users.value = data;
//     });
// });


// // function addUser vers serveur 
// function addUser() {
//   fetch(API_URL + '/users', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       "Access-Control-Allow-Origin": "*"
//     },
//     body: JSON.stringify({
//       name: "bla",
//       email: "bla@mail.com",
//       password: "123456"
//     })
//   })
//     .then((response) => response.json())
//     .then(() => {
//       // this.users.push(data);
//       //reload page
//       window.location.reload();
//     });


// }


// const routes = {
//   '/about': AboutViews
// }

// const currentPath = ref(window.location.hash)

// window.addEventListener('hashchange', () => {
//   currentPath.value = window.location.hash
// })

// const currentView = computed(() => {
//   return routes[currentPath.value.slice(1) || '/'] || 'NotFound'
// })

</script>

<template>
  <div id="app">
    <!-- <div class="list-unstyled" v-for="user in users" :key="user._id">
      <p>{{ user.name }}</p>
    </div> -->
    <NavBar></NavBar>
    <!-- <component :is="currentView" /> -->
    <div class="container mt-3">
      <router-view />
    </div>
    <!-- <button @click="addUser">Ajouter</button> -->
  </div>
</template>



<style >
#app {
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

body {
  background: #272727;
  font-family: "Montserrat", sans-serif;
}
</style>
