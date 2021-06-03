<template>
  <v-dialog v-model="showModal" transition="dialog-top-transition" :width="width">
    <template>
      <v-card>
        <v-toolbar color="primary">Edit Address</v-toolbar>
        <v-container>
          <v-alert v-if="alert.show" cols="12" :type="alert.type">
            <span v-html="alert.message"></span>
          </v-alert>
          <v-form>
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
            <v-text-field
              v-model="form.email"
              label="E-Mail"
              :counter="120"
              dense
              outlined
              @input="$v.form.email.$touch()"
              @blur="$v.form.email.$touch()"
              :error-messages="emailErrors"
              required
            ></v-text-field>
            <v-text-field
              v-model="form.mobile_number"
              label="Mobile Number"
              :counter="11"
              dense
              outlined
              @input="$v.form.mobile_number.$touch()"
              @blur="$v.form.mobile_number.$touch()"
              :error-messages="mobileNumberErrors"
              required
            ></v-text-field>
            <v-text-field
              v-model="form.phone_number"
              label="Phone Number"
              dense
              outlined
            ></v-text-field>
          </v-form>
        </v-container>
        <v-card-actions class="justify-end">
          <v-btn color="primary" @click="submit"> Submit </v-btn>
          <v-btn color="error" @click="showModal = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
<script>
import { validationMixin } from "vuelidate";
import { required, minLength, maxLength, email, numeric } from "vuelidate/lib/validators";
export default {
  name: "contact-edit",
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
        company_id: "",
        code: "",
        name: "",
      }),
    },
  },
  validations: {
    form: {
      name: {
        required,
        minLength: minLength(4),
        maxLength: maxLength(120),
      },
      email: {
        required,
        email,
        minLength: minLength(4),
        maxLength: maxLength(120),
      },
      mobile_number: {
        required,
        numeric,
        minLength: minLength(11),
        maxLength: maxLength(11),
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
      id: "",
      company_id: "",
      name: "",
      mobile_number: "",
      phone_number: "",
    },
  }),
  methods: {
    submit() {
      let url =
        this.$api + "/companies/" + this.item.company_id + "/contacts/" + this.item.id;
      let data = {
        name: this.form.name,
        email: this.form.email,
        mobile_number: this.form.mobile_number,
        phone_number: this.form.phone_number,
      };
      this.isLoading = true;
      this.alert.show = false;
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.isLoading = false;
      } else {
        this.$http
          .put(url, data)
          .then((response) => {
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
    nameErrors() {
      const errors = [];
      if (!this.$v.form.name.$dirty) return errors;
      !this.$v.form.name.required && errors.push("Name is required");
      !this.$v.form.name.minLength && errors.push("Name minimum length is 4");
      !this.$v.form.name.maxLength && errors.push("Name max length is 120");
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.form.email.$dirty) return errors;
      !this.$v.form.email.required && errors.push("E-Mail is required");
      !this.$v.form.email.email && errors.push("E-Mail is invalid");
      !this.$v.form.email.minLength && errors.push("E-Mail minimum length is 4");
      !this.$v.form.email.maxLength && errors.push("E-Mail max length is 120");
      return errors;
    },
    mobileNumberErrors() {
      const errors = [];
      if (!this.$v.form.mobile_number.$dirty) return errors;
      !this.$v.form.mobile_number.required && errors.push("Mobile Number is required");
      !this.$v.form.mobile_number.numeric && errors.push("Mobile Number must be numeric");
      !this.$v.form.mobile_number.minLength &&
        errors.push("Mobile Number minimum length is 4");
      !this.$v.form.mobile_number.maxLength &&
        errors.push("Mobile Number max length is 120");
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
          id: this.item.id,
          company_id: this.item.company_id,
          name: this.item.name,
          email: this.item.email,
          mobile_number: this.item.mobile_number,
          phone_number: this.item.phone_number,
        };
      }
    },
    showModal: function () {
      if (!this.showModal) {
        this.$v.$reset();
        this.form = {
          id: "",
          company_id: "",
          name: "",
          mobile_number: "",
          phone_number: "",
        };
        this.$emit("close");
      }
    },
  },
};
</script>
