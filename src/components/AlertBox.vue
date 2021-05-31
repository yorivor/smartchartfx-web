<template>
  <modal v-if="show" @close="show=false">
    <template v-slot:header>{{ title }}</template>
    <template v-slot:body>
      <span v-html="message"></span>
    </template>
    <template v-slot:footer>
      <button type="button" class="btn btn-primary" @click="show=false">{{ button_close }}</button>
    </template>
  </modal>
</template>
<script>
import Modal from "./Modal.vue";
export default {
  components: { Modal },
  name: "alert-box",
  props: {
    button_close: {
      type: String,
      required: false,
      default: "Close"
    }
  },
  data: function() {
    return {
      show: false,
      title: "Alert",
      message: "Something went wrong! Please contact the Administrator."
    };
  },
  methods: {
    open(title = "", message = "") {
      this.show = true;
      this.title = title;
      this.message = message;
    },
    close() {
      this.show = false;
    }
  }
};
</script>