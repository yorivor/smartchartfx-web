<template>
  <modal v-if="confirm" @close="confirm=false">
    <template v-slot:header>{{ title }}</template>
    <template v-slot:body>
      <span v-html="message"></span>
    </template>
    <template v-slot:footer>
      <button type="button" class="btn btn-warning" @click="submit(true)">Yes</button>
      <button type="button" class="btn btn-secondary" @click="submit(false)">No</button>
    </template>
  </modal>
</template>
<script>
import Modal from "./Modal.vue";
export default {
  name: "confirm-box",
  components: { Modal },
  props: {
    button_yes: {
      type: String,
      required: false,
      default: "Yes"
    },
    button_no: {
      type: String,
      required: false,
      default: "No"
    },
    title: {
      type: String,
      required: false,
      default: "Please Confirm"
    },
    message: {
      type: String,
      required: false,
      default: "Are you sure you want to continue?"
    }
  },
  data() {
    return {
      confirm: false
    };
  },
  methods: {
    show() {
      this.confirm = true;
    },
    hide() {
      this.confirm = false;
    },
    toggleModal() {
      this.confirm = this.confirm ? false : true;
    },
    submit(status) {
      this.$emit("status", status);
      this.confirm = false;
    }
  }
};
</script>
