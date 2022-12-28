<template>
  <div class="col-md-12">
    <div class="card card-container">
      <img id="profile-img" src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" class="profile-img-card" />
        <div class="form-group">
          <label for="username">Username</label>
          <input v-model="user.username" type="text" class="form-control" name="username" />
          <!-- <div
              v-if="errors.has('username')"
              class="alert alert-danger"
              role="alert"
            >Username is required!</div> -->
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input v-model="user.password" type="password" class="form-control" name="password" />
          <!-- <div
              v-if="errors.has('password')"
              class="alert alert-danger"
              role="alert"
            >Password is required!</div>-->
        </div>
        <div class="form-group">
          <button @click="saveUser" class="btn btn-success">
            <span>Login</span>
          </button>
        </div>
      </div>
      <!-- <div class="form-group">
            <div v-if="message" class="alert alert-danger" role="alert">{{message}}</div>
          </div> -->
    </div>
</template>
  
<script>
import AuthService from '../services/Auth.service';

export default {
  name: 'Login',
  data() {
    return {
      user: {
        id: null,
        username: '',
        password: '',
      },
      submitted: false,
    };
  },

  methods: {
    saveUser() {
      var data = {
        username: this.user.username,
        password: this.user.password,
      };
      AuthService.login(data)
        .then(response => {
          console.log(response.data);
          this.submitted = true;
          this.$store.dispatch('auth/login', this.user).then(
            () => {
          this.$router.push('/home');
        },
        error => {
          this.errors = error.response.data.errors;
        })
        })
        .catch(e => {
          console.log(e);
        });
    }
  },
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
  