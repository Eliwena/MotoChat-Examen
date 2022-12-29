<template>
  <!-- <div class="submit-form">
    <div v-if="!submitted">
      <div class="form-group">
        <label for="username">Username</label>
        <input type="text" class="form-control" id="username" required v-model="user.username" name="username" />
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input class="form-control" id="email" required v-model="user.email" name="email" />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" class="form-control" id="password" required v-model="user.password" name="password" />
      </div>

      <button @click="saveUser" class="btn btn-success">Submit</button>
    </div>

    <div v-else>
      <h4>You submitted successfully!</h4>
      <button class="btn btn-success" @click="newUser">Add</button>
    </div>
  </div> -->

  <div class="container py-5 h-100">
  <div class="row d-flex justify-content-center align-items-center h-100">
    <div class="col-12 col-md-8 col-lg-6 col-xl-5">
      <div class="card bg-dark text-white" style="border-radius: 1rem;">
        <div class="card-body p-5 text-center">

          <div class="mb-md-5 mt-md-4 pb-5">

            <h2 class="fw-bold mb-2 text-uppercase">SignUp</h2>
            <p class="text-white-50 mb-5">Please enter a usenmane,  login and password!</p>

            <div class="form-outline form-white mb-4">
              <div class="form-group">
                <label for="username">Username</label>
                <input v-model="user.username" type="text" class="form-control" name="username" />
              </div>
            </div>
            <div class="form-outline form-white mb-4">

              <div class="form-group">
                <label for="email">Email</label>
                <input class="form-control" id="email" required v-model="user.email" name="email" />
              </div>
            </div>
            <div class="form-outline form-white mb-4">
              <div class="form-group">
                <label for="password">Password</label>
                <input v-model="user.password" type="password" class="form-control" name="password" />
                <!-- <div
                      v-if="errors.has('password')"
                      class="alert alert-danger"
                      role="alert"
                    >Password is required!</div>-->
              </div>
            </div>

            <div class="form-group">
              <button @click="saveUser" class="btn btn-outline-light btn-lg px-5 btn-login ">
                <span>SignUp</span>
              </button>
            </div>
          </div>

         </div>
      </div>
    </div>
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
        id: null,
        username: '',
        password: '',
      },
      submitted: false,
    };
  },

  methods: {
    saveUser() {
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

  newUser() {
    this.submitted = false;
    this.user = {}
  }

}
</script>
  
<style scoped>
.btn-login {
  background: #5E5DF0;
  border-radius: 999px;
  box-shadow: #5E5DF0 0 10px 20px -10px;
  box-sizing: border-box;
  color: #FFFFFF;
  cursor: pointer;
  font-family: Inter, Helvetica, "Apple Color Emoji", "Segoe UI Emoji", NotoColorEmoji, "Noto Color Emoji", "Segoe UI Symbol", "Android Emoji", EmojiSymbols, -apple-system, system-ui, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  opacity: 1;
  outline: 0 solid transparent;
  padding: 8px 18px;
  margin-top: 5%;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  width: fit-content;
  word-break: break-word;
  border: 0;
}
</style>
  