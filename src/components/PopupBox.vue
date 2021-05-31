<template>
  <div v-if="popup">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ title }}</h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
                @click="popup = false"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <span v-html="message"></span>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-dismiss="modal"
                @click="popup = false"
              >Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "popup-box",
  data() {
    return {
      popup: false,
      title: "",
      message: ""
    };
  },
  methods: {
    setTitle(title) {
      this.title = title;
    },
    setMessage(messagevalue) {
      this.message = messagevalue;
    },
    show() {
      this.popup = true;
    },
    hide() {
      this.popup = false;
    },
    toggleModal() {
      this.popup = this.popup ? false : true;
    }
  }
};
</script>