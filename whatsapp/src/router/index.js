import { createRouter, createWebHistory } from "vue-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase.js";
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

  if (
    user &&
    (
      to.path === "/login" ||
      to.path === "/register"
    )
  ) {

    next("/chat");
    return;
  }

  if (to.meta?.requiresAuth && !user) {

    next("/login");
    return;
  }

  next();
});

export default router;