import { createRouter, createWebHistory } from "vue-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase.js";
import { doc, getDoc } from "firebase/firestore";
import LoginVista from "../views/LoginVista.vue";
import RegisterVista from "../views/RegistroVista.vue";
import SetUpVista from "../views/SetUpVista.vue";
import ChatVista from "../views/ChatVista.vue";

const routes = [

  {
    path: "/",
    redirect: "/login"
  },
  {
    path: "/login",
    component: LoginVista
  },
  {
    path: "/register",
    component: RegisterVista
  },
  {
    path: "/setup",
    component: SetUpVista,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/chat",
    component: ChatVista,
    meta: {
      requiresAuth: true
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {

    const removeListener = onAuthStateChanged(
      auth,
      (user) => {
        removeListener();
        resolve(user);
      },
      reject
    );
  });
};

router.beforeEach(async (to, from, next) => {

  const user = await getCurrentUser();

  if (user) {

    const userRef = doc(db, "users", user.uid);

    const userSnap = await getDoc(userRef);

    const hasProfile = userSnap.exists();

    if (
      !hasProfile &&
      to.path !== "/setup"
    ) {

      next("/setup");

      return;
    }

    if (
      hasProfile &&
      (
        to.path === "/login" ||
        to.path === "/register"
      )
    ) {

      next("/chat");

      return;
    }
  }

  if (to.meta?.requiresAuth && !user) {

    next("/login");

    return;
  }

  next();
});

export default router;