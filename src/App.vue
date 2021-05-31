<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :expand-on-hover="true"
      :mini-variant="true"
      :right="false"
      app
    >
      <v-list dense nav class="py-0">
        <!-- Fill Up Form -->
        <v-list-item two-line :class="true && 'px-0'">
          <v-list-item-avatar v-if="drawer">
            <img src="/favicon.ico" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>Health Declaration Form</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <!-- View My Account -->
        <v-list-item v-if="isLoggedIn" :to="{ name: 'my-account' }" link>
          <v-list-item-icon>
            <v-icon>mdi-account-box</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ displayname }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- Fill Up Form -->
        <v-list-item :to="{ name: 'health-declaration-form' }" link>
          <v-list-item-icon>
            <v-icon>mdi-format-list-numbered</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Fill Up Form</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-if="isLoggedIn && isAdmin"
          :to="{ name: 'health-declarations' }"
          link
        >
          <v-list-item-icon>
            <v-icon>mdi-table-large</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>List</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>
        <v-list-item v-if="!isLoggedIn" :to="{ name: 'home' }" link exact>
          <v-list-item-icon>
            <v-icon>mdi-account-box</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Login</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- Register -->
        <v-list-item v-if="!isLoggedIn" :to="{ name: 'register' }" link>
          <v-list-item-icon>
            <v-icon>mdi-account-plus</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Register</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- Logout -->
        <v-list-item v-if="isLoggedIn" @click="logout" link>
          <v-list-item-icon>
            <v-icon>mdi-logout-variant</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
        <!-- Login -->
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data: () => ({
    drawer: true,
  }),
  methods: {
    logout() {
      this.$store.dispatch("logout").then(() => {
        this.$router.push("/");
      });
    },
    goTo(routeName) {
      this.$router.push({ name: routeName });
    },
  },
  computed: {
    isLoggedIn: function () {
      return this.$store.getters.isLoggedIn;
    },
    displayname: function () {
      return this.$store.getters.displayname;
    },
    isAdmin: function () {
      return this.$store.getters.isAdmin;
    },
  },
};
</script>
<style lang="scss">
.theme--dark.v-btn.v-btn--icon {
  color: #000 !important;
}
</style>
