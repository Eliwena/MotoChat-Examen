<script>
import UserDataService from "../services/UserDataService";
console.log(UserDataService)
export default {
  name: "users-list",
  data() {
    return {
      users: [],
      currentUser: null,
      currentIndex: -1,
      title: ""
    };
  },

  methods: {
    retrieveUsers() {
      UserDataService.getAll()
        .then(response => {
          this.users = response.data;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },
},
    mounted() {
    this.retrieveUsers();
  }
};
</script>

<template>
    <h1>UserList</h1>
    <div class="list-unstyled" v-for="user in users" :key="user._id">
        <p>{{ user.pseudo }}</p>
    </div>
</template>