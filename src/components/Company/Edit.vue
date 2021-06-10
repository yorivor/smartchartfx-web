<template>
  <v-dialog v-model="showModal" transition="dialog-top-transition" :width="width">
    <template>
      <v-card>
        <v-toolbar color="primary">Edit Company</v-toolbar>
        <v-container>
          <v-alert v-if="alert.show" cols="12" :type="alert.type">
            <span v-html="alert.message"></span>
          </v-alert>
          <v-form @submit.prevent="submit">
            <v-file-input
              prepend-icon="mdi-camera"
              accept="image/*"
              label="Logo"
              v-model="form.logo"
              @input="$v.form.logo.$touch()"
              @blur="$v.form.logo.$touch()"
              :error-messages="logoErrors"
              dense
              outlined
              append-icon="mdi-eye"
              @click:append="showIconModal = true"
            ></v-file-input>
            <v-text-field
              v-model="form.code"
              label="Code"
              :counter="120"
              dense
              outlined
              @input="$v.form.code.$touch()"
              @blur="$v.form.code.$touch()"
              :error-messages="codeErrors"
              required
            ></v-text-field>
            <v-text-field
              v-model="form.name"
              :counter="120"
              label="Name"
              dense
              outlined
              @input="$v.form.name.$touch()"
              @blur="$v.form.name.$touch()"
              :error-messages="nameErrors"
              required
            ></v-text-field>
            <v-row class="text-right">
              <v-col cols="12">
                <v-btn class="my-3 mx-3" type="submit" color="primary"> Submit </v-btn>
                <v-btn class="my-3 mx-3" color="error" @click="$emit('close')">
                  Close
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card>
    </template>
    <v-dialog v-model="showIconModal" transition="dialog-top-transition" :width="width">
      <template>
        <v-card>
          <v-toolbar color="primary">Edit Company</v-toolbar>
          <v-container>
            <img :src="$api + form.logoHolder" width="100%" />
            <v-row class="text-right">
              <v-col cols="12">
                <v-btn class="my-3" color="error" @click="showIconModal = false">
                  Close
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </template>
    </v-dialog>
  </v-dialog>
</template>
<script>
const fileSizeValidation = (value, vm) => {
  if (!value) {
    return true;
  }
  let file = value;
  return file.size < 10 * 1024 * 1024;
};
const fileType = (value, vm) => {
  if (!value) {
    return true;
  }
  let file = value;
  return !["png", "jpg", "jpeg", "gif"].includes(file.type);
};
import { validationMixin } from "vuelidate";
import { required, minLength, maxLength, email, sameAs } from "vuelidate/lib/validators";
export default {
  name: "company-edit",
  mixins: [validationMixin],
  props: {
    show: {
      type: Boolean,
      required: true,
      default: false,
    },
    item: {
      type: Object,
      required: true,
      default: () => ({
        id: "",
        code: "",
        name: "",
        logo: "",
      }),
    },
  },
  validations: {
    form: {
      logo: {
        fileType,
        fileSizeValidation,
      },
      code: {
        required,
        minLength: minLength(1),
        maxLength: maxLength(120),
      },
      name: {
        required,
        minLength: minLength(4),
        maxLength: maxLength(120),
      },
    },
  },
  data: () => ({
    showModal: false,
    showIconModal: false,
    costCenters: [],
    userTypes: [],
    alert: {
      show: false,
      message: "",
      type: "error",
    },
    form: {
      id: "",
      code: "",
      name: "",
      logo: "",
      logoHolder: "",
    },
  }),
  methods: {
    submit() {
      let headers = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      let url = this.$api + "/admin/companies/" + this.item.id;
      this.isLoading = true;
      this.alert.show = false;
      let formData = new FormData();
      formData.append("_method", "PUT");
      formData.append("name", this.form.name);
      formData.append("code", this.form.code);
      if (this.form.logo !== null) {
        formData.append("logo", this.form.logo);
      }
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.isLoading = false;
      } else {
        this.$http
          .post(url, formData, headers)
          .then((response) => {
            this.form.logoHolder = response.data.response.logo;
            this.$v.$reset();
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
    logoErrors() {
      const errors = [];
      if (!this.$v.form.logo.$dirty) return errors;
      !this.$v.form.logo.fileType && errors.push("Logo file type must be png, jpg, jpeg");
      !this.$v.form.logo.fileSizeValidation && errors.push("Logo max size is 10MB");
      return errors;
    },
    codeErrors() {
      const errors = [];
      if (!this.$v.form.code.$dirty) return errors;
      !this.$v.form.code.required && errors.push("Code is required");
      !this.$v.form.code.minLength && errors.push("Code minimum length is 1");
      !this.$v.form.code.maxLength && errors.push("Code max length is 120");
      return errors;
    },
    nameErrors() {
      const errors = [];
      if (!this.$v.form.name.$dirty) return errors;
      !this.$v.form.name.required && errors.push("Name is required");
      !this.$v.form.name.minLength && errors.push("Name minimum length is 4");
      !this.$v.form.name.maxLength && errors.push("Name max length is 120");
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
      if (this.show) {
        this.form = {
          id: this.item.show,
          code: this.item.code,
          name: this.item.name,
          logo: null,
          logoHolder: this.item.logo,
        };
      }
    },
    showModal: function () {
      if (!this.showModal) {
        this.$v.$reset();
        this.alert.show = false;
        this.form = {
          id: "",
          code: "",
          name: "",
          logo: null,
          logoHolder: "",
        };
        this.$emit("close");
      }
    },
  },
};
</script>
