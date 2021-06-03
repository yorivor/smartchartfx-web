<template>
  <div>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  mounted() {
    if (this.$route.path == "/admin" || this.$route.path == "/admin/") {
      this.$router.push({ name: "home" });
    }
  },
};
</script>
