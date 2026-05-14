<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase.js";
import socket from "../../socket.js";

const router = useRouter();
const showMenu = ref(false);
const userData = ref(null);
const loadUser = async () => {

  try {
    const user = auth.currentUser;
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      userData.value = userSnap.data();
    }
  } catch (error) {
    console.log(error);
  }
};

const logout = async () => {
  try {
    socket.disconnect();
    await signOut(auth);
    router.push("/login");

  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  loadUser();
});

</script>

<template>

  <header class="header">
    <h1>WhatsApp Clone</h1>

    <div v-if="userData" class="profile" @click="showMenu = !showMenu">
      <img :src="userData.avatar" class="avatar" />

      <span>{{ userData.name }}</span>

      <div v-if="showMenu" class="dropdown">

        <p @click="router.push('/setup')">
          Editar perfil
        </p>

        <p @click="logout">
          Cerrar sesión
        </p>

      </div>

    </div>

  </header>

</template>

<style scoped>
</style>

<style scoped>

.header {

  width: 100%;
  height: 70px;

  padding: 0 30px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  background-color: #202c33;

  border-bottom: 1px solid #2a3942;

  color: white;
}

.profile {

  position: relative;

  display: flex;
  align-items: center;

  gap: 10px;

  cursor: pointer;
}

.avatar {

  width: 45px;
  height: 45px;

  border-radius: 50%;

  object-fit: cover;
}

.dropdown {

  position: absolute;

  top: 60px;
  right: 0;

  width: 180px;

  padding: 10px;

  border-radius: 8px;

  background-color: #2a3942;

  box-shadow: 0 0 10px rgba(0,0,0,0.3);
}

.dropdown p {

  cursor: pointer;

  transition: 0.2s;
}

.dropdown p:hover {

  color: #00a884;
}

</style>