<script>
import UserService from '../services/User.service';
export default {

  name: 'User',
  data() {
    return {
      content: '',
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  methods: {

    sendMessageCom(event) {
      const eventSource=  new EventSource("http://localhost:8000/"+event)

      eventSource.addEventListener('open', () => console.log('connected'));
      eventSource.onerror = () => {
        if (eventSource.readyState === EventSource.CLOSED) {
          console.log('closed')
          /* Traitement en cas de perte de connexion définitif avec le serveur */
        }
        if (eventSource.readyState === EventSource.CONNECTING) {
          console.log('connecting')
          /* En cas de perte de connexion temporaire avec le serveur */
        }
        
      };
    }
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
  <div class="container py-5">
    <div class="row d-flex justify-content-center align-items-center">
      <div class="col-12  ">
        <div class="card bg-dark text-white" style="border-radius: 1rem;">
          <div class="card-body p-5 text-center">
            <div class="mb-md-5 mt-md-4 pb-5">
              <div class="submit-form">
                <h5 class="fw-bold mb-2 text-uppercase">Administrateur : {{ currentUser.username }} </h5>
                <div class=" row d-flex justify-content-center">
                  <div class="form-outline form-white mt-4">
                  </div>
                  <h4> Envoyer une notification a tous le monde : </h4>
                  <button type="submit" id="reduction_jour" class="btn-add badge badge-success" @click="sendMessageCom('reduction_jour')"> Reduction de 50 % sur les produits de la journée</button>
                  <button type="submit" id="nous_contacter" class="btn-add badge badge-success" @click="sendMessageCom('nous_contacter')"> Nous contacter</button>
                  <button type="submit" id="maintenance" class="btn-add badge badge-success" @click="sendMessageCom('maintenance')"> Maintenance du site</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.submit-form {
  max-width: 50%;
  margin: auto;
}

.btn-add:hover {
  color: #212529;
}

.btn-add {
text-decoration: none;
padding: 10px;
font-family: arial;
font-size: 1em;
color: #FFFFFF;
background-color: #44dd44;
box-shadow: 1px 1px 4px #444444;
-webkit-box-shadow: 1px 1px 4px #444444;
-moz-box-shadow: 1px 1px 4px #444444;
margin: 10px;
width: 75%;

}


.btn-add:hover {
padding: 10px;
color: #FFFFFF;
box-shadow: rgb(68, 221, 68) 0 5px 5px -5px;
/* box-shadow: 1px 1px 4px #777777; */
/* -webkit-box-shadow: 1px 1px 4px #777777; */
/* -moz-box-shadow: 1px 1px 4px #777777; */
}
</style>

