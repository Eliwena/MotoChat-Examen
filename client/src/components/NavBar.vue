<script>

export default {
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    showAdminBoard() {
      console.log(this.currentUser)
      if (this.currentUser && this.currentUser.roles) {
        return this.currentUser.roles.includes('ROLE_ADMIN');
      }
      return false;
    },
  },
  methods: {
    logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    }
  }
};

</script>

<template>
  <div>
    <nav class="navMenu">
      <router-link to="/home" class="nav-link">
        Home
      </router-link>
      <router-link v-if="showAdminBoard" to="/admin" class="nav-link">Admin</router-link>
      <router-link v-if="showAdminBoard" to="/admin/users" class="nav-link">Gestion User</router-link>
      <!-- <router-link v-if="currentUser" to="/user" class="nav-link">User</router-link> -->

      <router-link v-if="currentUser && !showAdminBoard" to="/message" class="nav-link">Message
      </router-link>

      <router-link v-if="currentUser && !showAdminBoard" to="/salon" class="nav-link">Salon
      </router-link>

      <router-link v-if="showAdminBoard" to="/admin/salon" class="nav-link">Gestion Salon
      </router-link>

      <router-link v-if="showAdminBoard" to="/salon" class="nav-link">Salon
      </router-link>

      <router-link v-if="showAdminBoard" to="/admin/message" class="nav-link">Message
      </router-link>

      <router-link v-if="!currentUser" to="/register" class="nav-link">
        Sign Up
      </router-link>


      <router-link v-if="!currentUser" to="/login" class="nav-link">
        Login
      </router-link>
      <a v-if="currentUser" class="nav-link" href @click.prevent="logOut">
        LogOut
      </a>
      <div class="dot"></div>
    </nav>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap");

.navMenu {
  /* position: absolute; */
  margin: auto;
  padding: 1%;
}

.navMenu a {
  color: #f6f4e6;
  text-decoration: none;
  font-size: 1.2em;
  text-transform: uppercase;
  font-weight: 500;
  display: inline-block;
  /* width: 100px; */
  margin-right: 2%;
  -webkit-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
}

.navMenu a:hover {
  color: #fddb3a;
}
</style>