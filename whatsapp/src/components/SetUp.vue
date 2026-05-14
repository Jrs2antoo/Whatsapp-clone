<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import {auth, db} from "../firebase.js";
import { doc, setDoc, getDoc } from "firebase/firestore";
import supabase from "../supabase.js";

//Avatares
import avatar1 from "../assets/avatars/avatar1.jpeg";
import avatar2 from "../assets/avatars/avatar2.jpeg";
import avatar3 from "../assets/avatars/avatar3.jpeg";
import avatar4 from "../assets/avatars/avatar4.jpeg";
import avatar5 from "../assets/avatars/avatar5.jpeg";

const router = useRouter();
const name = ref("");
const status = ref("");
const selectedAvatar = ref(null);
const selectedFile = ref(null);
const avatars = [

  {
    id: 1,
    image: avatar1
  },

  {
    id: 2,
    image: avatar2
  },

  {
    id: 3,
    image: avatar3
  },
  {
    id: 4,
    image: avatar4
  },
  {
    id: 5,
    image: avatar5
  }
];

const loadProfile = async () => {
  const user = auth.currentUser;
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const data = userSnap.data();

    name.value = data.name;
    status.value = data.status;

    const foundAvatar = avatars.find((avatar) => avatar.image === data.avatar);

    if (foundAvatar) {
      selectedAvatar.value = foundAvatar;
    }
  }
};

const saveProfile = async () => {
  if (!name.value ||!status.value ||(!selectedAvatar.value && !selectedFile.value)) {
    return;
  }
  try {
    const user = auth.currentUser;
    let avatarUrl = selectedAvatar.value?.image || "";
    if (selectedFile.value) {

      const fileName = `${Date.now()}-${selectedFile.value.name}`;

      const { error } = await supabase.storage
        .from("avatares")
        .upload(fileName, selectedFile.value);

      if (!error) {
        avatarUrl =
          `https://xjvxuievdxtalxuljqth.supabase.co/storage/v1/object/public/avatares/${fileName}`;
        }
    }
    await setDoc(doc(
        db, "users", user.uid),
        {
          uid: user.uid,
          email: user.email,
          name: name.value,
          status: status.value,
          avatar: avatarUrl
        },
        { merge: true }
    );
    await router.push("/chat");

  } catch (error) {
    console.log(error);
  }
};
const handleFile = (event) => {
  selectedFile.value = event.target.files[0];
};

onMounted(() => {
  loadProfile();
});
</script>

<template>

  <div class="container">

    <form class="setupBox" @submit.prevent="saveProfile">

      <h1>Completa tu perfil</h1>
      <input v-model="name" type="text" placeholder="Nombre"/>

      <input v-model="status" type="text" placeholder="Estado"/>

      <div class="avatarContainer">

        <img v-for="avatar in avatars" :key="avatar.id" :src="avatar.image" class="avatar"
            :class="{
                        selected:
                        selectedAvatar?.id === avatar.id
                    }"
            @click="selectedAvatar = avatar"/>

      </div>

      <input type="file" accept="image/*" @change="handleFile"/>

      <button class="saveBtn" type="submit">
        Continuar
      </button>

    </form>

  </div>

</template>

<style scoped>

.container {

  width: 100%;
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: #111b21;
}

.setupBox {

  width: 400px;

  padding: 30px;

  border-radius: 10px;

  background-color: #202c33;

  display: flex;
  flex-direction: column;

  gap: 15px;
}

h1 {

  color: white;

  text-align: center;
}

input {

  padding: 12px;

  border: none;
  border-radius: 5px;

  background-color: #2a3942;

  color: white;

  outline: none;
}

.avatarContainer {

  display: flex;

  justify-content: center;

  flex-wrap: wrap;

  gap: 15px;
}

.avatar {

  width: 70px;
  height: 70px;

  border-radius: 50%;

  cursor: pointer;

  border: 3px solid transparent;

  transition: 0.2s;
}

.avatar:hover {

  transform: scale(1.05);
}

.selected {

  border-color: #00a884;
}

.saveBtn {

  padding: 12px;

  border: none;
  border-radius: 5px;

  cursor: pointer;

  background-color: #00a884;

  color: white;

  font-weight: bold;
}
input[type="file"] {

  padding: 10px;

  border-radius: 5px;

  background-color: #2a3942;

  color: #8696a0;

  cursor: pointer;
}

input[type="file"]::file-selector-button {

  padding: 10px 15px;

  margin-right: 10px;

  border: none;
  border-radius: 5px;

  background-color: #00a884;

  color: white;

  cursor: pointer;

  transition: 0.2s;
}

input[type="file"]::file-selector-button:hover {

  opacity: 0.8;
}

</style>

