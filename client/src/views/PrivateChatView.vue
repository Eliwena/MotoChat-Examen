<script>
import io from "socket.io-client";
import PrivateChatService from "../services/PrivateChat.service";
import UserListDataService from "../services/UserListDataService";

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
      users: [],
      newMessage: "",
      username: "",
      currentIndex: -1,
      currentChat: null,
      chats: [],
    };
  },
  mounted() {
    this.socket.on("connect", () => {});
    this.socket.on("new message", (message) => {
      this.messages.push(message);
    });
    this.socket.on("MESSAGE", (data) => {
      this.messages.push(data);
      this.userTyping = "";
    });
    this.retrieveUsers();
    console.log(this.users);
  },
  methods: {
    retrieveUsers() {
      UserListDataService.getAll()
        .then((response) => {
          this.users = response.data;
          //console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    searchUsername() {
      UserListDataService.findByUsername(this.username)
        .then((response) => {
          this.users = response.data;
          this.setActiveUsername(null);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    setActiveUsername(chat, index) {
      if (this.currentChat) {
        this.chats.forEach((element) => {
          if (element.name == this.currentChat.name) {
            console.log(element);
            element.count = element.count - 1;
          }
        });
        this.socket.emit("LEAVE", {
          chat: this.currentChat.name,
          user: this.currentUser,
        });
        this.messages = [];
        this.messagesInit = [];
      }
      this.currentChat = chat;
      this.currentIndex = chat ? index : -1;
      this.socket.emit("JOIN", {
        chat: this.currentChat,
        user: this.currentUser,
      });
      this.socket.emit("COUNT_USER_INIT");
    },

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
  watch: {
    messagesInit: {
      handler() {
        this.$nextTick(() => {
          document.getElementById("messages").scrollTop =
            document.getElementById("messages").scrollHeight;
        });
      },
      deep: true,
    },
    messages: {
      handler() {
        this.$nextTick(() => {
          document.getElementById("messages").scrollTop =
            document.getElementById("messages").scrollHeight;
        });
      },
      deep: true,
    },
  },
  unmounted() {
    this.socket.emit("DISCONNECT_USER", {
      user: this.currentUser,
      message: "a quitté le chat",
    });
  },
};
</script>

<template>
  <div class="container py-5">
    <div class="row d-flex justify-content-center align-items-center">
      <div class="col-4">
        <div class="card bg-dark text-white" style="border-radius: 1rem">
          <div class="card-body p-4 text-center">
            <div class="mb-md-4 mt-md-4 pb-3">
              <h5 class="fw-bold mb-2 text-uppercase">
                Liste des Utilisateurs
              </h5>
              <div
                v-for="user in this.users"
                :key="user.id"
                :class="{
                  active: index == currentIndex,
                }"
                class="list-group-item card py-3 m-3 col-12 pb-3 bg-light text-dark"
              >
                <p>{{ user.username }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-8">
        <div class="card bg-dark text-white" style="border-radius: 1rem">
          <div class="card-body p-4 text-center">
            <div class="mb-md-4 mt-md-4 pb-3">
              <div>
                <ul v-for="message in this.messages" :key="message">
                  {{
                    message
                  }}
                  <li>{{ message.username }} : {{ message.content }}</li>
                </ul>
                <form>
                  <input
                    type="text"
                    v-model="newMessage"
                    placeholder="Entrez votre message ici"
                  />
                  <button @click="sendMessage">Envoyer</button>
                </form>
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
  background-color: #00c49a !important;
  border-color: #00c49a !important;
}

.disabled {
  background-color: #c40052 !important;
  border-color: #c40052 !important;
}
.writting-box {
  display: flex;
  width: 100%;
  position: relative;
}
.messageCurrentUser {
  background-color: #00c49a;
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
}
.login {
  background: #b29ee6;
  font-weight: bold;
}

.logout {
  background: #ffc0cb;
  font-weight: bold;
}
</style>
