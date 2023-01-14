<script>
import SalonDataService from "../../../services/admin/SalonDataService";
export default {
  name: "salon-list",
  data() {
    return {
      salons: [],
      currentSalon: null,
      currentIndex: -1,
      name: ""
    };
  },
  methods: {
    retrieveSalons() {
      SalonDataService.getAll()
        .then(response => {
          this.salons = response.data;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },

    refreshList() {
      this.retrieveSalons();
      this.currentSalon = null;
      this.currentIndex = -1;
    },

    setActiveName(salon, index) {
      this.currentSalon = salon;
      this.currentIndex = salon ? index : -1;
    },

    deleteSalon() {
      SalonDataService.delete(this.currentSalon.id)
        .then(response => {
          console.log(response.data);
          this.$router.reload()
        })
        .catch(e => {
          console.log(e);
        });
    },

    searchName() {
      SalonDataService.findByName(this.name)
        .then(response => {
          console.log(response.data);
          this.salons = response.data;
          this.setActiveName(null);
        })
        .catch(e => {
          console.log(e);
        });
    }
  },
  mounted() {
    this.retrieveSalons();
  }
};
</script>

<template>
  <div class="container py-5">
    <div class="row d-flex justify-content-center align-items-center">
      <div class="col-12 ">
        <div class="card bg-dark text-white" style="border-radius: 1rem;">
          <div class="card-body p-5 text-center">
            <div class="mb-md-5 mt-md-4 pb-5">
              <h5 class="fw-bold mb-2 text-uppercase">Liste des Salons</h5>
              <div class="d-flex justify-content-end">
                <router-link to="/admin/salon/add" class=" btn-add ">Ajouter un salon</router-link>
              </div>
              <div class="list row">
                <div class=" row d-flex justify-content-center">
                  <div class="input-group m-4">
                    <input type="text" class="form-control" placeholder="Search by name" v-model="name" />
                    <div class="input-group-append">
                      <button class="btn btn-outline-secondary" type="button" @click="searchName">
                        Search
                      </button>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <ul class="list-group">
                    <li class="list-group-item" :class="{ active: index == currentIndex }"
                      v-for="(salon, index) in salons" :key="index" @click="setActiveName(salon, index)">
                      {{ salon.name }}
                    </li>
                  </ul>
                </div>
                <div class="col-md-6 ">
                  <div v-if="currentSalon">
                    <h4>Salon</h4>
                    <div>
                      <label><strong>Name:</strong></label> {{ currentSalon.name }}
                    </div>
                    <label><strong>Size:</strong></label> {{ currentSalon.size }}

                    <div>
                      <label><strong>Created By :</strong></label> {{ currentSalon.UserCreatedSalon.username }}
                    </div>
                    <div>
                      <label><strong>Statut:</strong></label> {{ currentSalon.statut ? "Active" : "Non Active" }}
                    </div>
                    <router-link :to="'/admin/salon/' + currentSalon.id" class=" btn-edit">Edit</router-link>
                  </div>
                  <div v-else>
                    <br />
                    <p>Selectionner un salon...</p>
                  </div>

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
.list-group-item.active {
  background-color: #00C49A !important;
  border-color: #00C49A !important;
}

.list {
  text-align: left;
  max-width: 750px;
  margin: auto;
}

.btn-edit {
  display: flex;
  background: #e79418;
  border-radius: 999px;
  box-shadow: #e79418 0 10px 20px -10px;
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
  margin-top: 3%;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  width: fit-content;
  word-break: break-word;
  border: 0;
}

.btn-edit:hover {
  color: #212529;

}

.btn-add {
  display: flex;
  background: rgb(68, 221, 68);
  border-radius: 999px;
  box-shadow: rgb(68, 221, 68) 0 10px 20px -10px;
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
  margin-top: 3%;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  width: fit-content;
  word-break: break-word;
  border: 0;
}
</style>