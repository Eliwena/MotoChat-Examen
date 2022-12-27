<script>
// import HelloWorld from './components/HelloWorld.vue'
// const API_URL = "http://localhost:8000/messages";
const API_URL = "http://localhost:8000";

export default {
  name: 'App',

  data: () => ({
    error: "Une erreur  s'est produite",
    // messages: [],
    users: []
  }),

  mounted() {
    fetch(API_URL + '/users', {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          "Access-Control-Allow-Origin": "*"
        },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        this.users = data;
      });
  },

  methods: {
    // function addUser vers serveur 
    addUser() {
      fetch(API_URL + '/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({
          name: "bla",
          email: "bla@mail.com",
          password: "123456"
        })
      })
        .then((response) => response.json())
        .then(() => {
          // this.users.push(data);
          //reload page
          window.location.reload();
        });
    },
  }
}
</script>

<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
  <!-- Menu avec connexion  -->
  <div class="menu">
    <div class="menu-item">
      <router-link to="/connexion">Connexion</router-link>
    </div>
    <div class="menu-item">
      <router-link to="/inscription">Inscription</router-link>
    </div>
  </div>
  <!-- <div class="list-unstyled" v-for="message in messages" :key="message._id">
    <li class="media">
      <div class="media-body">
        <h4 class="mt-0 mb-1">{{ message.titre }}</h4>
        {{ message.content }}
        
        <br />
      </div>
     
    </li>
    <hr>
  </div> -->
  <div class="list-unstyled" v-for="user in users" :key="user._id">
    <p>{{ user.name }}</p>
  </div>
  <button @click="addUser">Ajouter</button>
  <!-- <HelloWorld msg="Welcome to Your t Vue.js App" /> -->
</template>



<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

/* menu jolie */
.menu {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 50px;
  background-color: #f1f1f1;
}

</style>
