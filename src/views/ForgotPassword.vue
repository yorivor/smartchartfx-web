<template>
  <v-container>
    <v-row>
      <v-col
        offset-sm="2"
        offset-md="3"
        offset-lg="4"
        offset-xl="4"
        xs="12"
        sm="8"
        md="6"
        lg="4"
        xl="4"
        class="mt-10"
      >
        <v-card class="mx-auto" outlined>
          <v-list-item three-line>
            <v-list-item-content>
              <form>
                <v-list-item-title class="headline mb-1">Forgot Password</v-list-item-title>
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
                      @input="$v.form.email.$touch()"
                      @blur="$v.form.email.$touch()"
                      :error-messages="emailErrors"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
              </form>
            </v-list-item-content>
          </v-list-item>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-btn color="primary" :loading="isLoading" @click="submit">Send</v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12 mt-6 mb-2" align="center">
                <v-divider></v-divider>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-btn color="secondary" :loading="isLoading" :to="{ name: 'home' }">Login</v-btn>
              </v-col>
              <v-col cols="6" align="right">
                <v-btn color="secondary" :loading="isLoading" :to="{ name: 'register' }">Register</v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" align="center">
                <v-btn
                  color="success"
                  class="mr-4"
                  :loading="isLoading"
                  :to="{ name: 'health-declaration-form' }"
                >
                  Fill Up Form as Guest
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <loading ref="loading" />
  </v-container>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, email } from "vuelidate/lib/validators";
import Loading from "../components/Loading";
export default {
  name: "home",
  mixins: [validationMixin],
  components: { Loading },
  validations: {
    form: {
      email: { required, email },
    },
  },
  data: () => ({
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
      this.$refs.loading.open();
      this.$v.form.$touch();
      if (this.$v.form.$invalid) {
        this.alert = {
          show: true,
          message: "Please complete the form, see errors below.",
          type: "error",
        };
        this.$refs.loading.close();
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
            this.$refs.loading.close();
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
            this.$refs.loading.close();
            this.isLoading = false;
          });
      }
    },
  },
  mounted() {
      
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
