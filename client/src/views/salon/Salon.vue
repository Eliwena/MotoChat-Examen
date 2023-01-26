<script>
import SalonDataService from "../../services/SalonDataService";
import io from "socket.io-client";
import moment from 'moment';
export default {
    name: "salon-list",
    computed: {
        currentUser() {
            return this.$store.state.auth.user;
        },
    },

    data() {
        return {
            salons: [],
            currentSalon: null,
            currentIndex: -1,
            name: "",
            user: '',
            message: '',
            messages: [],
            messagesInit: [],
            userTyping: '',
            serviceMessages: [],
            socket: io('localhost:8000'),

        };
    },
    methods: {
        date: function (date) {
            return moment(date).format(' h:mm ');
        },
        retrieveSalons() {
            SalonDataService.getAllActive()
                .then(response => {
                    this.salons = response.data;
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
            if (this.currentSalon) {
                this.socket.emit('LEAVE', this.currentSalon.name)
                this.messages = []
                this.messagesInit = []
            }
            this.currentSalon = salon;
            this.currentIndex = salon ? index : -1;
            this.socket.emit('JOIN', {
                salon :this.currentSalon,
                user: this.currentUser,
            })


        },
        sendMessage(e) {
            e.preventDefault();
            this.socket.emit('SEND_MESSAGE', {
                user: this.currentUser,
                message: this.message,
                createdAt: new Date(),
                salon: this.currentSalon,
            });
            this.message = ''
        },

        //on écoute la frappe au clavier
        typing() {
            this.socket.emit('TYPING', {
                user: this.currentUser,
                salon: this.currentSalon,
            });
        },


    },
    watch: {
        messagesInit: {
            handler() {
                this.$nextTick(() => {
                    document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
                });
            },
            deep: true,
        },
        messages: {
            handler() {
                this.$nextTick(() => {
                    document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
                });
            },
            deep: true,
        },
    },
    mounted() {
        this.retrieveSalons();

        this.socket.on('connect', () => {
        
        })
        this.socket.on('INIT_MESSAGES', (data) => {
            if (data.length > 0 && this.messagesInit.length == 0) {
                this.messagesInit.push(...data);
            }

        });
        this.socket.on('MESSAGE', (data) => {
            this.messages.push(data);
            this.userTyping = '';
        });
        this.socket.on('TYPING', (data) => {
            this.userTyping = data.user.username;
        });
        // this.socket.on('SERVICE_MESSAGE', (data) => {
        //     this.serviceMessages = data;
        //     console.log(this.serviceMessages)
        //     });

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
                                <!-- <div>
                                    <span>{{ serviceMessages.text }} </span>
                                </div> -->
                                <div class="text-end me-4">
                                    <span>Nombre de participant : {{ currentSalon.size }}</span>
                                </div>
                                <hr>
                                <div id="messages" class="messages">
                                    <div v-for="(msg, index) in messagesInit" :key="index">
                                        <!-- <span>{{ msg.user }}</span> -->
                                        <div v-if="msg.user.username == currentUser.username">
                                            <p class="messageCurrentUser"><span class="nameUser">{{ msg.user.username }}
                                                    à {{ date(msg.createdAt) }}
                                                </span>{{ msg.content }}</p>
                                        </div>
                                        <div v-else>
                                            <p class="messageOtherUser"><span class="nameUser">{{ msg.user.username }} à
                                                    {{ date(msg.createdAt) }}
                                                </span>{{ msg.content }}</p>
                                        </div>
                                    </div>
                                    <div v-for="(msg, index) in messages" :key="index">
                                        <div v-if="msg.user.username == currentUser.username">
                                            <p class="messageCurrentUser"><span class="nameUser">{{
                                                msg.user.username
                                            }} à {{ date(msg.createdAt) }} </span>{{ msg.message }}</p>
                                        </div>
                                        <div v-else>
                                            <p class="messageOtherUser"><span class="nameUser">{{ msg.user.username }} à
                                                    {{ date(msg.createdAt) }}
                                                </span>{{ msg.message }}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="mt-2">
                                    <div class="writting"><span
                                            v-if="userTyping && userTyping != currentUser.username">{{ userTyping }}
                                            tape un message ...</span></div>
                                    <form class="writting-box " @submit.prevent="sendMessage">
                                        <div class="ms-2 form-outline form-white  col-10">
                                            <div class="form-group">
                                                <input @input="typing" type="text" v-model="message"
                                                    class="form-control" id="email" />
                                            </div>
                                        </div>
                                        <div class=" col-2">
                                            <button type="submit" class="btn btn-success">Envoyer</button>
                                        </div>
                                    </form>
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

.writting-box {
    display: flex;
    width: 100%;
    position: relative;

}

.messageCurrentUser {
    background-color: #00C49A;
    color: white;
    border-radius: 0.375rem !important;
    padding: 0.5rem;
    width: 100%;
    text-align: right;
}

.messageOtherUser {
    background-color: #f2f2f2;
    color: black;
    border-radius: 0.375rem !important;
    padding: 0.5rem;
    width: 100%;
    text-align: left;
}

.nameUser {
    width: 100%;
    display: block;
}

.messages {
    overflow: scroll;
    height: 500px;
    flex-direction: column;
}
</style>