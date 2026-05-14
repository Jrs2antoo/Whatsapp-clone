<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import {signInWithEmailAndPassword, signInWithPopup} from "firebase/auth";
import { auth, db, googleProvider, githubProvider } from "../firebase.js";
import { doc, getDoc } from "firebase/firestore";

const router = useRouter();
const email = ref("");
const password = ref("");
const errorMessage = ref("");

const checkUserProfile = async (uid) => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await router.push("/setup");
    return;
  }

  const userData = userSnap.data();

  if (!userData.name || !userData.status || !userData.avatar) {
    await router.push("/setup");
  } else {
    await router.push("/chat");
  }
};

const login = async () => {

  try {
    const result = await signInWithEmailAndPassword(
        auth,
        email.value,
        password.value
    );
    await checkUserProfile(result.user.uid);

  } catch (error) {
    errorMessage.value = "Correo o contraseña incorrectos";
  }
};

const loginGoogle = async () => {
  try {
    const result = await signInWithPopup(
        auth,
        googleProvider
    );
    await checkUserProfile(result.user.uid);

  } catch (error) {
    console.log(error);
  }
};

const loginGithub = async () => {
  try {
    const result = await signInWithPopup(auth,githubProvider);
    await checkUserProfile(result.user.uid);

  } catch (error) {

    console.log(error);
  }
};

</script>

<template>

  <div class="container">

    <form
        class="loginBox"
        @submit.prevent="login"
    >

      <h1>Login</h1>

      <input v-model="email" type="email" placeholder="Email"/>

      <input v-model="password" type="password" placeholder="Contraseña"/>

      <p v-if="errorMessage" class="errorText">
        {{ errorMessage }}
      </p>

      <button class="loginBtn" type="submit">
        Iniciar sesión
      </button>

      <div class="socialButtons">

        <button class="googleBtn" type="button" @click="loginGoogle">
          Google
        </button>

        <button class="githubBtn" type="button" @click="loginGithub">
          GitHub
        </button>

      </div>

      <p class="registerText" @click="router.push('/register')">
        ¿No tienes cuenta? Crear cuenta
      </p>

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

.errorText {

  color: #ff6b6b;

  font-size: 14px;

  text-align: center;
}
.loginBox {

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

button {

  padding: 12px;

  border: none;
  border-radius: 5px;

  cursor: pointer;

  font-weight: bold;
}

.loginBtn {

  background-color: #00a884;

  color: white;
}

.googleBtn {

  background-color: white;
}

.githubBtn {

  background-color: #24292e;

  color: white;
}

.socialButtons {

  display: flex;

  gap: 10px;
}

.socialButtons button {

  flex: 1;
}
.registerText {

  color: #8696a0;

  text-align: center;

  cursor: pointer;

  font-size: 14px;

  transition: 0.2s;
}

.registerText:hover {

  color: white;
}

</style>