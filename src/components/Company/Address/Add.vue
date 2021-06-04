<template>
  <v-dialog v-model="showModal" transition="dialog-top-transition" :width="width">
    <template>
      <v-card>
        <v-toolbar color="primary">Add Address</v-toolbar>
        <v-container>
          <v-alert v-if="alert.show" cols="12" :type="alert.type">
            <span v-html="alert.message"></span>
          </v-alert>
          <v-form @submit.prevent="submit">
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
import { required, minLength, maxLength, email, sameAs } from "vuelidate/lib/validators";
export default {
  name: "address-add",
  mixins: [validationMixin],
  props: {
    show: {
      type: Boolean,
      required: true,
      default: false,
    },
    companyId: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  validations: {
    form: {
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
    alert: {
      show: false,
      message: "",
      type: "error",
    },
    form: {
      code: "",
      name: "",
    },
  }),
  methods: {
    submit() {
      let url = this.$api + "/admin/companies/" + this.companyId + '/addresses';
      this.isLoading = true;
      this.alert.show = false;
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.isLoading = false;
      } else {
        this.$http
          .post(url, this.form)
          .then((response) => {
            this.$v.$reset();
            this.form = {
              code: "",
              name: "",
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
    },
    showModal: function () {
      if (!this.showModal) {
        this.$v.$reset();
        this.form = {
          code: "",
          name: "",
        };
        this.$emit("close");
      }
    },
  },
};
</script>
