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
          <v-toolbar color="primary">Reset Password</v-toolbar>
          <v-container>
            <v-alert v-if="alert.show" cols="12" :type="alert.type">
              <span v-html="alert.message"></span>
            </v-alert>
            <v-form @submit.prevent="submit">
              <v-text-field
                v-model="form.username"
                label="Username/E-Mail"
                :counter="120"
                dense
                outlined
                disabled
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
                @keyup.enter="submit"
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
                @keyup.enter="submit"
                @click:append="showInputPasswordConfirm = !showInputPasswordConfirm"
                required
                :error-messages="confirmPasswordErrors"
              ></v-text-field>
              <v-row class="text-right">
                <v-col cols="12">
                  <v-btn class="my-3 mx-3" type="submit" color="primary">
                    Submit
                  </v-btn>
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
import { required, minLength, maxLength, email, sameAs } from "vuelidate/lib/validators";
export default {
  name: "user-reset-password",
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
        username: "",
      }),
    },
  },
  validations: {
    form: {
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
    alert: {
      show: false,
      message: "",
      type: "error",
    },
    form: {
      id: "",
      username: "",
      password: "",
      confirm_password: "",
    },
  }),
  methods: {
    submit() {
      let url = this.$api + "/admin/users/" + this.form.id;
      let data = {
        update_type: "password",
        password: this.form.password,
        confirm_password: this.form.confirm_password,
        _method: "PUT",
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
            this.form.password = "";
            this.form.confirm_password = "";
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
      } else {
        this.form.id = this.item.id;
        this.form.username = this.item.username;
        this.form.password = "";
        this.form.confirm_password = "";
      }
    },
  },
};
</script>
