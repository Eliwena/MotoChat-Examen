<template>
 <div class="submit-form">
    <div v-if="!submitted">
      <div class="form-group">
        <label for="username">Username</label>
        <input
          type="text"
          class="form-control"
          id="username"
          required
          v-model="user.username"
          name="username"
        />
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input
          class="form-control"
          id="email"
          required
          v-model="user.email"
          name="email"
        />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input
          type="password"
          class="form-control"
          id="password"
          required
          v-model="user.password"
          name="password"
        />
      </div>

      <button @click="saveUser" class="btn btn-success">Submit</button>
    </div>

    <div v-else>
      <h4>You submitted successfully!</h4>
      <button class="btn btn-success" @click="newUser">Add</button>
    </div>
  </div>
  </template>
  
  <script>
  import AuthService from '../services/Auth.service';

export default {
  name: 'Register',
  data() {
    return {
      user: {
        id:null,
        username: '',
        password: '',
      },
      submitted: false,
    };
  },

  methods:{
    saveUser(){
      console.log("aa")
      var data = {
        username: this.user.username,
        password: this.user.password,
        email: this.user.email
      };
      AuthService.register(data)
      .then(response => {
        console.log(response.data);
        this.submitted = true;
        this.$router.push('Home') 
      })
      .catch(e => {
        console.log(e);
      });
    }
  },

  newUser(){
    this.submitted = false;
    this.user = {}
  }

}
  </script>
  
  <style scoped>
  label {
    display: block;
    margin-top: 10px;
  }
  
  .card-container.card {
    max-width: 350px !important;
    padding: 40px 40px;
  }
  
  .card {
    background-color: #f7f7f7;
    padding: 20px 25px 30px;
    margin: 0 auto 25px;
    margin-top: 50px;
    -moz-border-radius: 2px;
    -webkit-border-radius: 2px;
    border-radius: 2px;
    -moz-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
    -webkit-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  }
  
  .profile-img-card {
    width: 96px;
    height: 96px;
    margin: 0 auto 10px;
    display: block;
    -moz-border-radius: 50%;
    -webkit-border-radius: 50%;
    border-radius: 50%;
  }
  </style>
  