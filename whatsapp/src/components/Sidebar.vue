<script setup>

defineProps({
  onlineUsers: Array
});

</script>

<template>

  <aside class="sidebar">

    <h2>
      Usuarios
    </h2>

    <div class="usersList">

      <div
        v-for="user in onlineUsers"
        :key="user.uid"
        class="userCard"
      >

        <img :src="user.avatar" class="avatar" />

        <div>

          <strong>
            {{ user.name }}
          </strong>

          <p>
            En línea {{ "(" + user.status + ")" }}
          </p>

        </div>

      </div>

    </div>

  </aside>

</template>

<style scoped>

.sidebar {

  width: 300px;

  height: 100%;

  background-color: #111b21;

  border-right: 1px solid #2a3942;

  display: flex;
  flex-direction: column;
}

h2 {

  padding: 20px;

  color: white;

  border-bottom: 1px solid #2a3942;
}

.usersList {

  flex: 1;

  overflow-y: auto;
}

.userCard {

  display: flex;

  align-items: center;

  gap: 15px;

  padding: 15px 20px;

  cursor: pointer;

  transition: 0.2s;
}

.userCard:hover {

  background-color: #202c33;
}

.avatar {

  width: 50px;
  height: 50px;

  border-radius: 50%;

  object-fit: cover;
}

strong {

  color: white;
}

p {

  color: #8696a0;

  font-size: 14px;
}

</style>