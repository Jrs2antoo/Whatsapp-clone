<script setup>
import { ref } from "vue";
import Header from "../components/layout/Header.vue";
import Footer from "../components/layout/Footer.vue";
import Chat from "../components/Chat.vue";
import Sidebar from "../components/Sidebar.vue";

const onlineUsers = ref([]);
</script>

<template>

  <div class="page">

    <Header />

    <main class="content">

      <Sidebar :onlineUsers="onlineUsers" />

      <Chat :onlineUsers="onlineUsers" @updateUsers="onlineUsers = $event"/>

    </main>

    <Footer />

  </div>

</template>

<style scoped>

.page {

  width: 100%;
  height: 100vh;

  display: flex;
  flex-direction: column;
}

.content {

  flex: 1;

  display: flex;

  overflow: hidden;

  background-color: #111b21;
}

</style>