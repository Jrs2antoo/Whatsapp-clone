<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc,setDoc } from "firebase/firestore"
import { auth,db } from "../firebase"

const router = useRouter()
const email = ref("")
const password = ref("")
const register = async () => {
  try {
    const result =
    await createUserWithEmailAndPassword(auth, email.value, password.value)
    await setDoc(
        doc(db, "users", result.user.uid),
        {
          uid: result.user.uid,
          email: result.user.email,
          name: "",
          status: "",
          avatar: ""
        }
    )
    await router.push("/setup");

  } catch (error) {
    console.log(error)
  }
}

</script>

<template>

  <div class="container">

    <form
        class="registerBox"
        @submit.prevent="register"
    >
      <h1>Registro</h1>

      <input
          v-model="email"
          type="email"
          placeholder="Email"
      />

      <input
          v-model="password"
          type="password"
          placeholder="Contraseña"
      />

      <button
          class="registerBtn"
          type="submit"
      >
        Registrarse
      </button>

      <p
          class="loginText"
          @click="router.push('/login')"
      >
        Ya tengo cuenta
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

.registerBox {

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

.registerBtn {

  background-color: #00a884;

  color: white;
}

.loginText {

  color: #8696a0;

  text-align: center;

  cursor: pointer;

  font-size: 14px;

  transition: 0.2s;
}

.loginText:hover {

  color: white;
}
</style>