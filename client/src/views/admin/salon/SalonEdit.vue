<script>
import AdminSalonDataService from "../../../services/admin/AdminSalonDataService";

export default {
    name: "user",
    data() {
        return {
            currentSalon: null,
            message: ''
        };
    },
    methods: {
        getSalon(id) {
            AdminSalonDataService.get(id)
                .then(response => {
                    this.currentSalon = response.data;
                })
                .catch(e => {
                    console.log(e);
                });
        },

        updateSalon() {
            AdminSalonDataService.update(this.currentSalon.id, this.currentSalon)
                .then(response => {
                    console.log(response.data);
                    // this.message = 'The salon was updated successfully!';
                    this.$router.push( "/admin/salon" );

                })
                .catch(e => {
                    console.log(e);
                });
            
        },

        deleteSalon() {
            AdminSalonDataService.delete(this.currentSalon.id)
                .then(response => {
                    console.log(response.data);
                    this.$router.push( "/admin/salon" );

                })
                .catch(e => {
                    console.log(e);
                });
        }
    },
    mounted() {
        this.message = '';
        this.getSalon(this.$route.params.id);
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
                            <div v-if="currentSalon" class="edit-form">
                                <h5 class="fw-bold mb-2 text-uppercase">Edition de : {{ currentSalon.name }}</h5>
                                <div class=" row d-flex justify-content-center">
                                    <div class="form-outline form-white mt-4">
                                        <div class="form-group">
                                            <label for="username">Name</label>
                                            <input type="text" class="form-control" id="username"
                                                v-model="currentSalon.name" />
                                        </div>
                                    </div>
                                    <div class="form-outline form-white mt-4">
                                        <div class="form-group">
                                            <label for="email">Size</label>
                                            <input type="number" class="form-control" id="email"
                                                v-model="currentSalon.size" />
                                        </div>
                                    </div>

                                    <div class="form-outline form-white mt-4">
                                        <div class="form-group">
                                            <div class="form-group">
                                                <label for="statut">Statut : </label>
                                                {{ currentSalon.statut ? "Active" : "Non Active" }}
                                            </div>

                                            <label class="toggle">
                                                <input class="toggle-checkbox" type="checkbox"
                                                    v-model="currentSalon.statut">
                                                <div class="toggle-switch"></div>
                                            </label>
                                        </div>
                                    </div>




                                    <!-- <button class=" badge badge-primary mr-2" v-if="currentUser.statut"
                                      @click="updateStatut(false)">
                                      Non Active
                                  </button>
                                  <button v-else class="badge badge-primary mr-2" @click="updateStatut(true)">
                                      Active
                                  </button> -->

                                    <button class=" btn-delete badge badge-danger mr-2" @click="deleteSalon">
                                        Delete
                                    </button>

                                    <button type="submit" class="btn-edit badge badge-success" @click="updateSalon">
                                        Update
                                    </button>
                                    <p>{{ message }}</p>
                                </div>
                            </div>
                            <div v-else>
                                <br />
                                <p>Please click on a Salon...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>



<style scoped>
.edit-form {
    max-width: 50%;
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
    margin: 3%;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    width: fit-content;
    word-break: break-word;
    border: 0;
}

.btn-edit:hover,
.btn-delete:hover {
    color: #212529;

}

.btn-delete {
    display: flex;
    background: #A22C29;
    border-radius: 999px;
    box-shadow: #A22C29 0 10px 20px -10px;
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
    margin: 3%;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    width: fit-content;
    word-break: break-word;
    border: 0;
}

.toggle {
    cursor: pointer;
    display: inline-block;
}

.toggle-switch {
    display: inline-block;
    background: #ccc;
    border-radius: 16px;
    width: 58px;
    height: 32px;
    position: relative;
    vertical-align: middle;
    transition: background 0.25s;
}

.toggle-switch:before,
.toggle-switch:after {
    content: "";
}

.toggle-switch:before {
    display: block;
    background: linear-gradient(to bottom, #fff 0%, #eee 100%);
    border-radius: 50%;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.25);
    width: 24px;
    height: 24px;
    position: absolute;
    top: 4px;
    left: 4px;
    transition: left 0.25s;
}

.toggle:hover .toggle-switch:before {
    background: linear-gradient(to bottom, #fff 0%, #fff 100%);
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.5);
}

.toggle-checkbox:checked+.toggle-switch {
    background: #56c080;
}

.toggle-checkbox:checked+.toggle-switch:before {
    left: 30px;
}

.toggle-checkbox {
    position: absolute;
    visibility: hidden;
}

.toggle-label {
    margin-left: 5px;
    position: relative;
    top: 2px;
}
</style>
