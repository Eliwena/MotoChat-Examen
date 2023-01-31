<script>
import NavBar from "./components/NavBar.vue";
import { useToast } from "vue-toastification";

export default {
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  components: {
    NavBar,
  },
  data() {
    return {
      
      content: "",
    };
  },
  watch: {
    
  },
  setup() {
    // Get toast interface
    const toast = useToast();
    return { toast }
  },
  mounted() {
    if (this.currentUser) {
   
    const factSource = new EventSource("http://localhost:8000/reduction_jour")
    const contactSource = new EventSource("http://localhost:8000/nous_contacter")
    const maintenanceSource = new EventSource("http://localhost:8000/maintenance")

      factSource.addEventListener("message_reduction", (event) => {
        console.log("Message", event.data);
        this.toast.info(event.data, {
          position: "top-right",
          timeout: 10000,
          closeOnClick: true,
          pauseOnFocusLoss: true,
          pauseOnHover: true,
          draggable: true,
          draggablePercent: 1.08,
          showCloseButtonOnHover: false,
          hideProgressBar: true,
          closeButton: "button",
          icon: true,
          rtl: false
        });
      });
    
      contactSource.addEventListener("message_contact", (event) => {
        console.log("Message", event.data);
        this.toast.success(event.data, {
          position: "top-right",
          timeout: 10000,
          closeOnClick: true,
          pauseOnFocusLoss: true,
          pauseOnHover: true,
          draggable: true,
          draggablePercent: 1.08,
          showCloseButtonOnHover: false,
          hideProgressBar: true,
          closeButton: "button",
          icon: true,
          rtl: false
        });
      });

      maintenanceSource.addEventListener("message_maintenance", (event) => {
        console.log("Message", event.data);
        this.toast.warning(event.data, {
          position: "top-right",
          timeout: 10000,
          closeOnClick: true,
          pauseOnFocusLoss: true,
          pauseOnHover: true,
          draggable: true,
          draggablePercent: 1.08,
          showCloseButtonOnHover: false,
          hideProgressBar: true,
          closeButton: "button",
          icon: true,
          rtl: false
        });
      });
    }
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
  background: -webkit-linear-gradient(to right,
      rgba(106, 17, 203, 1),
      rgba(37, 117, 252, 1));

  /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  background: linear-gradient(to right,
      rgba(106, 17, 203, 1),
      rgba(37, 117, 252, 1));
}
</style>
