import { createRouter,createWebHashHistory} from "vue-router";

const home = () => import("../components/rankList")
const sign = () => import("../components/addUser")

const routes = [
  { path: "/", redirect: "/home" },
  {
    path: "/home",
    name: "home",
    component: home
  },
  {
    path: "/sign",
    name: "sign",
    component: sign
  }
]


export const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
  })