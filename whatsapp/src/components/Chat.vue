<script setup>
import { ref, onMounted, nextTick } from "vue";
import socket from "../socket.js";
import { auth, db } from "../firebase.js";
import { doc, getDoc } from "firebase/firestore";

const message = ref("");
const messages = ref([]);
const messagesContainer = ref(null);
const userData = ref(null);
const typingUser = ref("");
const onlineUsers = ref([]);

const emit = defineEmits([
  "updateUsers"
]);

const loadUser = async () => {
  const user = auth.currentUser;
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    userData.value = userSnap.data();
    socket.connect();

    socket.emit("joinChat", {
        uid: user.uid,
        name: userData.value.name,
        avatar: userData.value.avatar,
        status: userData.value.status
    });
  }
};

const scrollToBottom = async () => {

  await nextTick();

  messagesContainer.value.scrollTop =
    messagesContainer.value.scrollHeight;
};

const sendMessage = () => {

  if (!message.value.trim()) return;

  socket.emit("sendMessage", {
    text: message.value,
    user: userData.value.name,
    avatar: userData.value.avatar,
    uid: auth.currentUser.uid,
    time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    })
  });

  socket.emit("stopTyping");

  message.value = "";
};

const handleTyping = () => {
  socket.emit("typing", userData.value.name);

  clearTimeout(window.typingTimeout);

  window.typingTimeout = setTimeout(() => {

    socket.emit("stopTyping");

  }, 1000);
};

onMounted(() => {

  loadUser();

  socket.on("receiveMessage", async (message) => {
    messages.value.push(message);
    scrollToBottom();
  });

  socket.on("systemMessage", async (message) => {
    messages.value.push({
      system: true,
      text: message.text
    });
    scrollToBottom();
  });

  socket.on("userTyping", (userName) => {
    typingUser.value = `${userName} está escribiendo...`;
  });

  socket.on("userStoppedTyping", () => {
    typingUser.value = "";
  });

  socket.on("onlineUsers", (users) => {
    onlineUsers.value = users;

    emit("updateUsers", users);
  });
});

</script>

<template>

  <div class="chatContainer">
    <div class="chatHeader">
        <div>
            <h2>
            Sala General
            </h2>

            <p>
            {{ onlineUsers.length }} usuarios conectados
            </p>
        </div>
    </div>

    <div class="onlineUsers">

      Usuarios conectados: {{ onlineUsers.length }}

    </div>

    <div class="messages" ref="messagesContainer">
        <div v-for="(msg, index) in messages" :key="index">
            <div v-if="msg.system" class="systemMessage">
                {{ msg.text }}
            </div>

            <div v-else class="messageWrapper"
            :class="{
                ownWrapper:
                msg.uid === auth.currentUser.uid
            }"
            >

            <div class="message"
                :class="{
                    ownMessage:
                    msg.uid === auth.currentUser.uid
                    }"
                >
                <img :src="msg.avatar" class="messageAvatar" />

                <div>
                    <strong>
                        {{ msg.user }}
                    </strong>

                    <p>
                        {{ msg.text }}
                    </p>

                    <span class="messageTime">
                        {{ msg.time }}
                    </span>
                </div>
            </div>
        </div>
    </div>

    </div>

    <p v-if="typingUser" class="typingText">
      {{ typingUser }}
    </p>

    <form class="inputContainer" @submit.prevent="sendMessage">

      <input v-model="message" type="text" placeholder="Escribe un mensaje..." @input="handleTyping"/>

      <button type="submit">
        Enviar
      </button>

    </form>

  </div>

  

</template>

<style scoped>

.chatHeader {

  padding: 20px;

  border-bottom: 1px solid #2a3942;

  background-color: #202c33;

  color: white;
}

.chatHeader p {

  color: #8696a0;

  font-size: 14px;

  margin-top: 5px;
}

.messageWrapper {

  display: flex;

  margin-bottom: 15px;
}

.ownWrapper {

  justify-content: flex-end;
}

.message {

  max-width: 70%;

  display: flex;

  align-items: flex-start;

  gap: 10px;

  padding: 10px;

  border-radius: 10px;

  background-color: #202c33;

  color: white;
}

.ownMessage {

  background-color: #005c4b;
}

.messageTime {

  display: block;

  margin-top: 5px;

  font-size: 12px;

  color: #cfcfcf;

  text-align: right;
}

.chatContainer {

  flex: 1;

  height: 100%;

  display: flex;
  flex-direction: column;
}

.onlineUsers {

  padding: 10px 20px;

  background-color: #202c33;

  color: white;
}

.messages {

  flex: 1;

  padding: 20px;

  overflow-y: auto;
}

.message {

  display: flex;

  align-items: flex-start;

  gap: 10px;

  margin-bottom: 15px;

  padding: 10px;

  border-radius: 10px;

  background-color: #202c33;

  color: white;
}

.ownMessage {

  background-color: #005c4b;
}

.messageAvatar {

  width: 40px;
  height: 40px;

  border-radius: 50%;

  object-fit: cover;
}

.systemMessage {

  text-align: center;

  margin: 10px 0;

  color: #8696a0;

  font-size: 14px;
}

.typingText {

  padding-left: 20px;

  color: #8696a0;

  font-size: 14px;
}

.inputContainer {

  display: flex;

  padding: 20px;

  gap: 10px;

  background-color: #202c33;
}

input {

  flex: 1;

  padding: 12px;

  border: none;
  border-radius: 5px;

  background-color: #2a3942;

  color: white;

  outline: none;
}

button {

  padding: 12px 20px;

  border: none;
  border-radius: 5px;

  cursor: pointer;

  background-color: #00a884;

  color: white;
}

</style>