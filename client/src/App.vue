<script>
import HelloWorld from './components/HelloWorld.vue'
const API_URL = "http://localhost:8000/messages";

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  data: () => ({
    error: "Une erreur  s'est produite",
    messages: []
  }),

  mounted() {
    fetch(API_URL)
      .then(response => response.json())
      .then(result => {
        this.messages = result;
      });
  },
  methods: {}
}
</script>

<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <div class="list-unstyled" v-for="message in messages" :key="message._id">
      <li class="media">
        <div class="media-body">
          <h4 class="mt-0 mb-1">{{message.titre}}</h4>
          {{message.content}}
          <br />
        </div>
      </li>
      <hr>
    </div>
  <HelloWorld msg="Welcome to Your Vue.js App"/>
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
</style>
