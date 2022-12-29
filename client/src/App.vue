<script>

import NavBar from './components/NavBar.vue'

export default {
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  components: {
    NavBar
  }
}

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
      <section class="vh-100 gradient-custom">
      <router-view />
    </section>
    <!-- <button @click="addUser">Ajouter</button> -->
  </div>
</template>



<style >
#app {
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}

body {
  background: #272727 !important;
  font-family: "Montserrat", sans-serif;
}

.gradient-custom {
/* fallback for old browsers */
background: #6a11cb;

/* Chrome 10-25, Safari 5.1-6 */
background: -webkit-linear-gradient(to right, rgba(106, 17, 203, 1), rgba(37, 117, 252, 1));

/* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
background: linear-gradient(to right, rgba(106, 17, 203, 1), rgba(37, 117, 252, 1))
}
</style>
