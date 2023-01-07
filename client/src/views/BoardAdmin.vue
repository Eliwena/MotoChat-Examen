<script>
import UserService from '../services/User.service';
export default {

  name: 'User',
  data() {
    return {
      content: ''
    };
  },
  mounted() {
    UserService.getAdminBoard().then(
      response => {
        this.content = response.data;
      },
      error => {
        this.content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();
      }
    );
  }
};
</script>

<template>
  <div class="container">
    <header class="jumbotron">
      <h3>{{ content }}</h3>
      <!-- <UserList></UserList> -->
    </header>
  </div>
</template>
  

  