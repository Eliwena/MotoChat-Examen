<script>
import SalonDataService from "../../services/SalonDataService";

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
            SalonDataService.getAllActive()
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

    },
    mounted() {
        this.retrieveSalons();
    }
};



</script>


<template>
    <div class="container py-5">
        <div class="row d-flex justify-content-center align-items-center">
            <div class="col-4 ">
                <div class="card bg-dark text-white" style="border-radius: 1rem;">
                    <div class="card-body p-4 text-center">
                        <div class="mb-md-4 mt-md-4 pb-3">
                            <h5 class="fw-bold mb-2 text-uppercase">Liste des Salons</h5>
                            <div class="row  d-flex justify-content-center">
                                <div v-for="(salon, index) in salons" :key="index" @click="setActiveName(salon, index)"
                                    :class="{ active: index == currentIndex }"
                                    class="list-group-item card py-3 m-3 col-12 pb-3 bg-light text-dark">
                                    {{ salon.name }}
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div class="col-8 ">
                <div class="card bg-dark text-white" style="border-radius: 1rem;">
                    <div class="card-body p-4 text-center">
                        <div class="mb-md-4 mt-md-4 pb-3">
                            <div v-if="currentSalon" class="card py-3 m-3 pb-3 bg-light text-dark">
                                <div class="text-end me-4">
                                    <span>Nombre de participant : {{ currentSalon.size }}</span>
                                </div>
                                <hr>
                                <div class="d-flex mt-5">
                                    <div class=" ms-2 form-outline form-white  col-10">
                                        <div class="form-group">
                                            <input type="text" class="form-control" id="email" />
                                        </div>
                                    </div>
                                    <div class=" col-2">
                                        <button type="button" class="btn btn-success">Envoyer</button>
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
.list-group-item {
    border-radius: 0.375rem !important;
}

.list-group-item.active {
    background-color: #00C49A !important;
    border-color: #00C49A !important;

}
</style>