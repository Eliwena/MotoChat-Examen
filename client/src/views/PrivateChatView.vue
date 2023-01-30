<script>
import io from "socket.io-client";
import PrivateChatService from "@/services/PrivateChat.service";

export default {
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  data() {
    return {
      socket: io("localhost:8000"),
      messages: [],
      newMessage: "",
    };
  },
  mounted() {
    this.socket.on("connect", () => {});
    this.socket.on("new message", (message) => {
      this.messages.push(message);
    });
  },
  methods: {
    sendMessage(e) {
      console.log("send message");
      e.preventDefault();
      const message = {
        userid: this.currentUser.id,
        username: this.currentUser.username,
        content: this.newMessage,
      };
      PrivateChatService.create(message);
      console.log("message content"), this.socket.emit("send message", message);
      this.newMessage = "";
    },
  },
};
</script>

<template>
  <div>
    <ul v-for="message in messages" :key="message">
      {{
        message
      }}>
      <li>{{ message.username }} : {{ message.content }}</li>
    </ul>
    <form @submit.prevent="sendMessage">
      <input
        type="text"
        v-model="newMessage"
        placeholder="Entrez votre message ici"
      />
      <button @click="sendMessage">Envoyer</button>
    </form>
  </div>
</template>
