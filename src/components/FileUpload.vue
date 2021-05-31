<template>
  <div v-if="show">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="storyModal" v-html="title"></h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
                @click="close()"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div v-if="alert.show" :class="'alert alert-' + alert.class" role="alert">
                {{ alert.message }}
                <button
                  type="button"
                  class="close"
                  data-dismiss="alert"
                  aria-label="Close"
                  @click="alert.show = false"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <input type="file" ref="file" class="form-control-file" @change="onFileChange" />
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-dismiss="modal"
                @click="close()"
                v-html="btnCloseText"
              ></button>
              <button
                type="button"
                class="btn btn-primary"
                data-dismiss="modal"
                @click="submit()"
                v-html="btnUploadText"
              ></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "file-upload",
  components: {},
  props: {
    title: {
      type: String,
      required: false,
      default: "Upload"
    },
    btnCloseText: {
      type: String,
      required: false,
      default: "Close"
    },
    btnUploadText: {
      type: String,
      required: false,
      default: "Upload"
    }
  },
  data: function() {
    return {
      id: "",
      show: false,
      alert: {
        show: false,
        message: "",
        class: "success"
      }
    };
  },
  methods: {
    onFileChange() {
      this.$emit("file-change", this.$refs.file.files[0]);
    },
    submit() {
      this.$emit("submit");
    },
    close() {
      this.show = false;
    },
    open() {
      this.show = true;
    }
  }
};
</script>
