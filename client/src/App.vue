<script>
import NavBar from "./components/NavBar.vue";

export default {
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  components: {
    NavBar,
  },
};
</script>

<template>
  <div id="app">
    <NavBar></NavBar>
    <section class="vh-100 gradient-custom">
      <router-view />
    </section>
  </div>
</template>

<style>
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
  background: -webkit-linear-gradient(
    to right,
    rgba(106, 17, 203, 1),
    rgba(37, 117, 252, 1)
  );

  /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  background: linear-gradient(
    to right,
    rgba(106, 17, 203, 1),
    rgba(37, 117, 252, 1)
  );
}
</style>
