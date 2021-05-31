<template>
  <div v-if="show">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="storyModal">{{ title_name }}</h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
                @click="show = false"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <!-- Error Message Goes Here -->
              <div class="row">
                <div class="col-sm-12">
                  <div v-if="alert.show" :class="'alert alert-' + alert.class" role="alert">
                    <button
                      type="button"
                      class="close"
                      data-dismiss="alert"
                      aria-label="Close"
                      @click="alert.show = false"
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                    <span v-html="alert.message"></span>
                  </div>
                </div>
              </div>
              <!-- Form Upload -->
              <div class="row">
                <div class="col-sm-6 offset-3">
                  <div class="form-group">
                    <label for="fileupload">{{ label_name }}</label>
                    <input id="fileupload" type="file" ref="file" :class="input_class" @change="onFileChange" />
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                :class="button_class"
                data-dismiss="modal"
                @click="uploadFile"
              >{{ button_name }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "popup",
  props: {
    title_name: {
      type: String,
      required: false,
      default: "Upload File"
    },
    label_name: {
      type: String,
      required: false,
      default: "Upload"
    },
    input_class: {
      type: String,
      required: false,
      default: "form-control-file"
    },
    button_class: {
      type: String,
      required: false,
      default: "btn btn-primary"
    },
    button_name: {
      type: String,
      required: false,
      default: "Upload"
    }
  },
  data: function() {
    return {
      show: false,
      alert: {
        class: "danger",
        message: "",
        show: false,
      },
      file: "",
    };
  },
  methods: {
    open() {
      this.alert.show = false;
      this.alert.message = "";
      this.show = true;
    },
    onFileChange() {
      this.file = this.$refs.file.files[0]
    },
    displayAlert(msg, cl = 'danger') {
      this.alert.show = true;
      this.alert.message = msg;
      this.alert.class = cl;
    },
    uploadFile() {
      this.$emit("upload", this.file);
    }
  }
};
</script>