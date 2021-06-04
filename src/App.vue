<template>
  <v-app>
    <v-navigation-drawer
      v-if="isLoggedIn && currentRouteName != 'home'"
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
            <v-list-item-title>{{ appName }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <!-- View My Account -->
        <v-list-item :to="{ name: 'account' }" link>
          <v-list-item-icon>
            <v-icon>mdi-account-box</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ displayname }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <!-- Users -->
        <v-list-item v-if="isAdmin" :to="{ name: 'admin-users' }" link>
          <v-list-item-icon>
            <v-icon>mdi-account-box-multiple</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>User Management</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- Company -->
        <v-list-item v-if="isAdmin" :to="{ name: 'admin-companies' }" link>
          <v-list-item-icon>
            <v-icon>mdi-office-building</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Company Management</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- Admin Purchase Orders -->
        <v-list-item
          v-if="isAdmin"
          :to="{ name: 'admin-purchase-orders' }"
          link
        >
          <v-list-item-icon>
            <v-icon>mdi-table-large</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Purchase Orders</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- Prepearer Purchase Orders -->
        <v-list-item
          v-if="isPrepearer"
          :to="{ name: 'prepearer-purchase-orders' }"
          link
        >
          <v-list-item-icon>
            <v-icon>mdi-table-large</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Purchase Orders</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- Reviewer Purchase Orders -->
        <v-list-item
          v-if="isReviewer"
          :to="{ name: 'reviewer-purchase-orders' }"
          link
        >
          <v-list-item-icon>
            <v-icon>mdi-table-large</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Purchase Orders</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- Approver Purchase Orders -->
        <v-list-item
          v-if="isApprover"
          :to="{ name: 'approver-purchase-orders' }"
          link
        >
          <v-list-item-icon>
            <v-icon>mdi-table-large</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Purchase Orders</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- Verdors -->
        <v-list-item v-if="isAdmin" :to="{ name: 'vendors' }" link>
          <v-list-item-icon>
            <v-icon>mdi-city</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Vendors</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>
        <!-- Logout -->
        <v-list-item v-if="isLoggedIn" @click="logout" link>
          <v-list-item-icon>
            <v-icon>mdi-logout-variant</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item justify-end class="mb-0" @click="toggleTheme">
          <v-list-item-icon>
            <v-icon>mdi-brightness-6</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              <span
                v-html="'Switch to ' + (!isDarkTheme ? 'Dark' : 'Light') + ' Theme'"
              ></span>
            </v-list-item-title>
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
    appName: process.env.VUE_APP_TITLE,
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
    toggleTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      if (this.$vuetify.theme.dark) {
        this.$store.dispatch("setToDarkTheme");
      } else {
        this.$store.dispatch("setToLightTheme");
      }
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
    isData: function () {
      return this.$store.getters.isData;
    },
    isPrepearer: function () {
      return this.$store.getters.isPrepearer;
    },
    isReviewer: function () {
      return this.$store.getters.isReviewer;
    },
    isApprover: function () {
      return this.$store.getters.isApprover;
    },
    isDarkTheme: function () {
      return this.$store.getters.isDarkTheme;
    },
    currentRouteName: function () {
      return this.$route.name;
    },
  },
  mounted() {
    const theme = this.$store.getters.isDarkTheme;
    if (theme) {
      this.$vuetify.theme.dark = true;
    } else {
      this.$vuetify.theme.dark = false;
    }
  },
};
</script>
