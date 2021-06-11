<template>
  <v-dialog v-model="showModal" transition="dialog-top-transition" :width="width">
    <template>
      <v-card>
        <v-toolbar color="primary">Add Item</v-toolbar>
        <v-container>
          <v-alert v-if="alert.show" cols="12" :type="alert.type">
            <span v-html="alert.message"></span>
          </v-alert>
          <v-form @submit.prevent="submit">
            <v-text-field
              v-model="form.name"
              label="Name"
              :counter="150"
              dense
              outlined
              @input="$v.form.name.$touch()"
              @blur="$v.form.name.$touch()"
              :error-messages="nameErrors"
              required
            ></v-text-field>
            <v-file-input
              label="Upload Documents"
              hint="Upload your supporting documents"
              v-model="form.file"
              persistent-hint
              @change="FileChange"
              required
              dense
              outlined
            ></v-file-input>
            <v-row class="text-right">
              <v-col cols="12">
                <v-btn class="my-3 mx-3" type="submit" color="primary"> Submit </v-btn>
                <v-btn class="my-3 mx-3" color="error" @click="showModal = false">
                  Close
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card>
    </template>
  </v-dialog>
</template>
<script>
import { validationMixin } from "vuelidate";
import { 
  required, 
  maxLength,
  decimal,
 } from "vuelidate/lib/validators";
export default {
  name: "purchase-order-upload-add",
  mixins: [validationMixin],
  props: {
    show: {
      type: Boolean,
      required: true,
      default: false,
    },
    purchaseOrdersId: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  validations: {
    form: {
      name: {
        required,
        maxLength: maxLength(150),
      },
    },
  },
  data: () => ({
    showModal: false,
    alert: {
      show: false,
      message: "",
      type: "error",
    },
    form: {
      name: "",
    },
  }),
  methods: {
    FileChange(file) {
      this.form.file = file;
    },
    submit() {
      let url = this.$api + "/preparer/purchase-orders/" + this.purchaseOrdersId + '/uploads';
      let headers = {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      };
      
      this.isLoading = true;
      this.alert.show = false;
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.isLoading = false;
      } else {
        let postForm = new FormData();
        postForm.append("name", this.form.name);
        postForm.append("file", this.form.file);
        this.$http
          .post(url, postForm, headers)
          .then((response) => {
            this.$v.$reset();
            this.form = {
              name: "",
              file: ""
            };
            this.alert = {
              show: true,
              type: "success",
              message: response.data.message,
            };
            this.isLoading = false;
            this.$emit("generate-table");
          })
          .catch((error) => {
            let msg = "";
            if (error.response.data.message) {
              msg = error.response.data.message;
            } else {
              msg = "Something went wrong. Please contact the administrator";
            }
            this.alert = {
              show: true,
              type: "error",
              message: msg,
            };
            this.isLoading = false;
          });
      }
    },
  },
  computed: {
    nameErrors() {
      const errors = [];
      if (!this.$v.form.name.$dirty) return errors;
      !this.$v.form.name.required && errors.push("Name is required");
      !this.$v.form.name.maxLength && errors.push("Name max length is 150");
      return errors;
    },
    width() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return "95%";
        case "sm":
          return "85%";
        default:
          return "500";
      }
    },
  },
  watch: {
    show: function () {
      this.showModal = this.show;
    },
    showModal: function () {
      if (!this.showModal) {
        this.$v.$reset();
        this.form = {
          name: "",
        };
        this.$emit("close");
      }
    },
  },
};
</script>
