<script>
import UserDataService from "../../../services/admin/UserDataService";
console.log(UserDataService)
export default {
  name: "users-list",
  data() {
    return {
      users: [],
      role:[],
      currentUser: null,
      currentIndex: -1,
      username: ""
    };
  },
  methods: {
    retrieveUsers() {
      UserDataService.getAll()
        .then(response => {
          this.users = response.data;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },

    refreshList() {
      this.retrieveUsers();
      this.currentUser = null;
      this.currentIndex = -1;
    },

    setActiveUsername(user, index) {
      this.currentUser = user;
      this.currentIndex = user ? index : -1;
    },

    searchUsername() {
      UserDataService.findByUsername(this.username)
        .then(response => {
          console.log(response.data);
          this.users = response.data;
          this.setActiveUsername(null);
        })
        .catch(e => {
          console.log(e);
        });
    }
  },
  mounted() {
    this.retrieveUsers();
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
              <h5 class="fw-bold mb-2 text-uppercase">Liste des Utilisateurs</h5>
              <div class="list row">
                <div class=" row d-flex justify-content-center">
                  <div class="input-group m-4">
                    <input type="text" class="form-control" placeholder="Search by username" v-model="username" />
                    <div class="input-group-append">
                      <button class="btn btn-outline-secondary" type="button" @click="searchUsername">
                        Search
                      </button>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <h4>User List</h4>
                  <ul class="list-group">
                    <li class="list-group-item" :class="{ active: index == currentIndex }"
                      v-for="(user, index) in users" :key="index" @click="setActiveUsername(user, index)">
                      {{ user.username }}
                    </li>
                  </ul>
                </div>
                <div class="col-md-6 ">
                  <div v-if="currentUser">
                    <h4>User</h4>
                    <div>
                      <label><strong>User:</strong></label> {{ currentUser.username }}
                    </div>
                    <label><strong>Roles:</strong></label> <span v-for="(role,index) in currentUser.roles" :key="index"> [ {{ role.name }} ] </span>

                    <div>
                      <label><strong>Email:</strong></label> {{ currentUser.email }}
                    </div>
                    <div>
                      <label><strong>Status:</strong></label> {{ currentUser.statut ? "Active" : "Non Active" }}
                    </div>

                    <router-link :to="'/admin/users/' + currentUser.id" class=" btn-edit">Edit</router-link>
                  </div>
                  <div v-else>
                    <br />
                    <p>Selectionner un utilisateur...</p>
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
.list-group-item.active{
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

</style>