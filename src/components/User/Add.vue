<template>
  <div>
    <v-dialog
      v-model="showModal"
      persistent
      transition="dialog-top-transition"
      :width="width"
    >
      <template>
        <v-card>
          <v-toolbar color="primary">Create User</v-toolbar>
          <v-container>
            <v-alert v-if="alert.show" cols="12" :type="alert.type">
              <span v-html="alert.message"></span>
            </v-alert>
            <v-form @submit.prevent="submit">
              <v-select
                v-model="form.user_type_id"
                label="User Type"
                :items="userTypes"
                item-text="name"
                item-value="id"
                outlined
                dense
                multiple
                @input="$v.form.user_type_id.$touch()"
                @blur="$v.form.user_type_id.$touch()"
                :error-messages="userTypeErrors"
                required
              ></v-select>
              <v-select
                v-model="form.company_id"
                label="Company"
                :items="companies"
                item-text="name"
                item-value="id"
                outlined
                dense
                multiple
                @input="$v.form.company_id.$touch()"
                @blur="$v.form.company_id.$touch()"
                :error-messages="companyErrors"
                required
              ></v-select>
              <v-text-field
                v-model="form.username"
                label="Username/E-Mail"
                :counter="120"
                dense
                outlined
                @input="$v.form.username.$touch()"
                @blur="$v.form.username.$touch()"
                :error-messages="usernameErrors"
                required
              ></v-text-field>
              <v-text-field
                v-model="form.fullname"
                :counter="120"
                label="Full Name"
                dense
                outlined
                @input="$v.form.fullname.$touch()"
                @blur="$v.form.fullname.$touch()"
                :error-messages="fullnameErrors"
                required
              ></v-text-field>
              <v-text-field
                v-model="form.password"
                :append-icon="showInputPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showInputPassword ? 'text' : 'password'"
                label="Password"
                hint="At least 6 characters"
                :counter="60"
                dense
                outlined
                @input="$v.form.password.$touch()"
                @blur="$v.form.password.$touch()"
                @click:append="showInputPassword = !showInputPassword"
                :error-messages="passwordErrors"
                required
              ></v-text-field>
              <v-text-field
                cols="12"
                v-model="form.confirm_password"
                :append-icon="showInputPasswordConfirm ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showInputPasswordConfirm ? 'text' : 'password'"
                label="Confirm Password"
                :counter="60"
                dense
                outlined
                @input="$v.form.confirm_password.$touch()"
                @blur="$v.form.confirm_password.$touch()"
                @click:append="showInputPasswordConfirm = !showInputPasswordConfirm"
                required
                :error-messages="confirmPasswordErrors"
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
    </v-dialog>
  </div>
</template>
<script>
import { validationMixin } from "vuelidate";
import {
  required,
  minLength,
  maxLength,
  email,
  sameAs,
  requiredIf,
} from "vuelidate/lib/validators";
export default {
  name: "user-add",
  mixins: [validationMixin],
  props: {
    show: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  validations: {
    form: {
      user_type_id: {
        required,
      },
      company_id: {
        required,
      },
      fullname: {
        required,
        minLength: minLength(4),
        maxLength: maxLength(120),
      },
      username: {
        required,
        email,
        minLength: minLength(4),
        maxLength: maxLength(120),
      },
      password: {
        required,
        minLength: minLength(6),
        maxLength: maxLength(60),
      },
      confirm_password: {
        required,
        sameAsPassword: sameAs("password"),
      },
    },
  },
  data: () => ({
    showModal: false,
    showInputPassword: false,
    showInputPasswordConfirm: false,
    isLoading: false,
    userTypes: [],
    companies: [],
    alert: {
      show: false,
      message: "",
      type: "error",
    },
    form: {
      company_id: [],
      user_type_id: [],
      fullname: "",
      username: "",
      password: "",
      confirm_password: "",
    },
  }),
  methods: {
    getDropdowns() {
      this.$http.get(this.$api + "/admin/users/dropdowns").then((response) => {
        this.userTypes = response.data.response.userTypes;
        this.companies = response.data.response.companies;
      });
    },
    submit() {
      let url = this.$api + "/admin/users";
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
              user_type_id: "",
              company_id: "",
              fullname: "",
              username: "",
              password: "",
              confirm_password: "",
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
    userTypeErrors() {
      const errors = [];
      if (!this.$v.form.user_type_id.$dirty) return errors;
      !this.$v.form.user_type_id.required && errors.push("User Type is required");
      return errors;
    },
    companyErrors() {
      const errors = [];
      if (!this.$v.form.company_id.$dirty) return errors;
      !this.$v.form.company_id.required && errors.push("Company is required");
      return errors;
    },
    fullnameErrors() {
      const errors = [];
      if (!this.$v.form.fullname.$dirty) return errors;
      !this.$v.form.fullname.required && errors.push("Full Name is required");
      !this.$v.form.fullname.minLength && errors.push("Full Name minimum length is 4");
      !this.$v.form.fullname.maxLength && errors.push("Full Name max length is 120");
      return errors;
    },
    usernameErrors() {
      const errors = [];
      if (!this.$v.form.username.$dirty) return errors;
      !this.$v.form.username.required && errors.push("Username is required");
      !this.$v.form.username.email && errors.push("E-Mail is invalid");
      !this.$v.form.username.minLength && errors.push("Username minimum length is 4");
      !this.$v.form.username.maxLength && errors.push("Username max length is 120");
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.form.password.$dirty) return errors;
      !this.$v.form.password.required && errors.push("Password is required");
      !this.$v.form.password.minLength && errors.push("Password minimum length is 6");
      !this.$v.form.password.maxLength && errors.push("Password minimum length is 60");
      return errors;
    },
    confirmPasswordErrors() {
      const errors = [];
      if (!this.$v.form.confirm_password.$dirty) return errors;
      !this.$v.form.confirm_password.required &&
        errors.push("Confirm Password is required");
      !this.$v.form.confirm_password.sameAsPassword &&
        errors.push("Confirm Password must same as Password");
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
      if (!this.show) {
        this.$v.$reset();
        this.alert.show = false;
        this.form = {
          company_id: "",
          user_type_id: "",
          fullname: "",
          username: "",
          password: "",
          confirm_password: "",
        };
      } else {
        this.getDropdowns();
      }
    },
  },
};
</script>
