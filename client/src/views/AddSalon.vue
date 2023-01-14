<script>
import SalonDataService from "../services/SalonDataService";

export default {
    name: "salon-add",
    data() {
        return {
            salon: {
                id: null,
                name: "",
                size: "",
                
            },
            submitted: false
        };
    },
    computed: {
        currentUser() {
            return this.$store.state.auth.user;
        },
    },
    methods: {
        saveSalon() {
            var data = {
                name: this.salon.name,
                size: this.salon.size,
                statut: true,
                createdBy : this.currentUser.id
            };

            SalonDataService.create(data)
                .then(response => {
                    this.salon.id = response.data.id;
                    console.log(response.data);
                    this.submitted = true;
                    this.$router.push("/admin/salon");
                })
                .catch(e => {
                    console.log(e);
                });
        },

        newSalon() {
            this.submitted = false;
            this.salon = {};
        }
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
                            <h5 class="fw-bold mb-2 text-uppercase">Création d'un salon </h5>
                            <div class=" row d-flex justify-content-center">
                                <div class="form-outline form-white mt-4">
                                    <div class="form-group">
                                        <label for="username">Name</label>
                                        <input type="text" class="form-control" id="name" required name="name"
                                            v-model="salon.name" />
                                    </div>
                                </div>
                                <div class="form-outline form-white mt-4">
                                    <div class="form-group">
                                        <label for="email">Size</label>
                                        <input type="number" class="form-control" id="size" v-model="salon.size" />
                                    </div>
                                </div>
                                <button type="submit" class="btn-add badge badge-success" @click="saveSalon">
                                    Add
                                </button>
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