<template>
  <div class="container py-5 h-100">
    <div class="row d-flex justify-content-center align-items-center h-100">
      <div class="col-12 col-md-8 col-lg-6 col-xl-5">
        <div class="card bg-dark text-white" style="border-radius: 1rem;">
          <div class="card-body p-5 text-center">

            <div class="mb-md-5 mt-md-4 pb-5">

              <h2 class="fw-bold mb-2 text-uppercase">Login</h2>
              <p class="text-white-50 mb-5">Please enter your login and password!</p>

              <div class="form-outline form-white mb-4">
                <div class="form-group">
                  <label for="username">Username</label>
                  <input v-model="user.username" type="text" class="form-control" name="username" />
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

              <p class="small mb-5 pb-lg-2"><a class="text-white-50" href="#!">Forgot password?</a></p>

              <div class="form-group">
                <button @click="saveUser" class="btn btn-outline-light btn-lg px-5 btn-login ">
                  <span>Login</span>
                </button>
              </div>
            </div>

            <div>
              <p class="mb-0">Don't have an account? <a href="#!" class="text-white-50 fw-bold">Sign Up</a>
              </p>
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
  