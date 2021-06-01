<template>
  <v-container>
    <v-row>
      <v-col
        offset-sm="2"
        offset-md="3"
        offset-lg="4"
        offset-xl="5"
        xs="12"
        sm="8"
        md="6"
        lg="5"
        xl="4"
        class="mt-10"
      >
        <v-card class="mx-auto" outlined>
          <v-card-title> {{ appName }} Forgot Password </v-card-title>
          <v-list-item three-line>
            <v-list-item-content>
              <form @submit.prevent="submit">
                <v-row v-if="alert.show">
                  <v-col clos="12" sm="12">
                    <v-alert :type="alert.type">{{ alert.message }}</v-alert>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="12">
                    <v-text-field
                      v-model="form.email"
                      label="E-Mail Address"
                      type="mail"
                      outlined
                      @input="$v.form.email.$touch()"
                      @blur="$v.form.email.$touch()"
                      :error-messages="emailErrors"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
              </form>
              <v-btn color="primary py-6" block :loading="isLoading" @click="submit">
                Send
              </v-btn>
              <v-divider></v-divider>
              <v-row>
                <v-col class="mt-3" cols="12" align="center">
                  <v-btn
                    color="secondary"
                    plain
                    block
                    :loading="isLoading"
                    :to="{ name: 'home' }"
                  >
                    Back to Login
                  </v-btn>
                </v-col>
              </v-row>
            </v-list-item-content>
          </v-list-item>
          <v-card-actions>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <loading :is-loading="isLoading" />
  </v-container>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, email } from "vuelidate/lib/validators";
import Loading from "../components/Loading";
export default {
  name: "forgot-password",
  mixins: [validationMixin],
  components: { Loading },
  validations: {
    form: {
      email: { required, email },
    },
  },
  data: () => ({
    appName: process.env.VUE_APP_TITLE || "",
    isLoading: false,
    showPassword: false,
    form: {
      email: "",
    },
    alert: {
      show: false,
      message: "",
      type: "error",
    },
  }),
  methods: {
    submit() {
      this.isLoading = true;
      this.alert.show = false;
      this.$v.form.$touch();
      if (this.$v.form.$invalid) {
        this.alert = {
          show: true,
          message: "Please complete the form, see errors below.",
          type: "error",
        };
        this.isLoading = false;
      } else {
        this.$http
          .post(this.$api + "/forgot-password", this.form)
          .then((response) => {
            this.form.email = "";
            this.$v.form.$reset();
            this.alert = {
              show: true,
              message: response.data.message,
              type: "success",
            };
            this.isLoading = false;
          })
          .catch((err) => {
            let msg = "";
            if (err.response.data.message) {
              msg = err.response.data.message;
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
    emailErrors() {
      const errors = [];
      if (!this.$v.form.email.$dirty) return errors;
      !this.$v.form.email.email && errors.push("Must be valid e-mail");
      !this.$v.form.email.required && errors.push("E-mail is required");
      return errors;
    },
  },
};
</script>
