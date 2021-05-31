<template>
  <div>
    <button :class="button_class" style="width: 100%" @click.prevent="open">{{ button_name }}</button>
    <popup ref="popup" @upload="upload"/>
  </div>
</template>
<script>
import Popup from "./Popup.vue";
export default {
  name: "upload-button",
  components: { Popup },
  props: {
    button_name: {
      type: String,
      required: false,
      default: "Upload"
    },
    button_class: {
      type: String,
      required: false,
      default: "btn btn-primary"
    },
  },
  data: function() {
    return {
      show: false,
      file: ""
    };
  },
  methods: {
    displayAlert(msg, cl = 'danger') {
      this.$refs.popup.displayAlert(msg, cl);
    },
    upload(file) {
      this.$emit("upload", file);
    },
    close() {
      this.$refs.popup.close;
    },
    open() {
      this.$refs.popup.open();
    }
  }
};
</script>
