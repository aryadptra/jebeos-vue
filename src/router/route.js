import auth from "@/middleware/auth";

const routes = [
  {
    path: "/",
    name: "Layout",
    redirect: "/home",
    component: () => import("@/Layout/index.vue"),
    meta: {
      middleware: [auth],
    },
    children: [
      {
        path: "/home",
        name: "home",
        component: () => import("@/views/index.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/auth/index.vue"),
    meta: {
      hide: true,
    },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/views/auth/index.vue"),
    meta: {
      hide: true,
    },
  },
  {
    path: "/forgot-password",
    name: "Forgot Password",
    component: () => import("@/views/auth/index.vue"),
    meta: {
      hide: true,
    },
  },
  {
    path: "/categories",
    name: "Categories",
    component: () => import("@/Layout/index.vue"),
    children: [
      {
        path: "/categories",
        name: "categories",
        component: () => import("@/views/categories.vue"),
      },
    ],
  },

  {
    path: "/products",
    name: "Products",
    component: () => import("@/Layout/index.vue"),
    children: [
      {
        path: "/products",
        name: "Products",
        component: () => import("@/views/products.vue"),
      },
    ],
  },
];

export default routes;
