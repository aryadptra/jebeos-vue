<template>
  <router-view />
</template>

<script>
import { useThemeSettingsStore } from "@/store/themeSettings";
import axiosClient from "./plugins/axios";
import router from "./router/index.js";

export default {
  data() {
    return {
      //state loggedIn with localStorage
      loggedIn: localStorage.getItem("activeUser"),
      //state token
      token: localStorage.getItem("userToken"),
      //state user logged In
      user: [],
    };
  },
  mounted() {
    const activeUser = localStorage.getItem("activeUser");
    if (activeUser) {
      router.push("/home");
    }

    this.$store.themeSettingsStore = useThemeSettingsStore();
  },
  created() {
    this.fetchUserData();
  },
  methods: {
    async fetchUserData() {
      try {
        const response = await axiosClient.get("user", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("userToken"),
          },
        });
        if (response) {
          this.user = response.data;
        }
      } catch (error) {
        if (error.response.status === 401) {
          router.push("/login");
        }
      }
    },
  },
};
</script>

<style></style>
