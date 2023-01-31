
<script>
import UserService from '../services/User.service';

export default {
    name: 'Home',
    computed: {
        currentUser() {
            return this.$store.state.auth.user;
        },
    },
    data() {
        return {
            content: ''
        };
    },
    mounted() {
        UserService.getPublicContent().then(
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
    <div class="container">
        <header class="jumbotron">
            <h3 v-if="currentUser">Bienvenue {{ currentUser.username }}</h3>
        </header>
    </div>
</template>
  