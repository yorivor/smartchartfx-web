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
          <v-card-title> {{ appName }} Reset Password </v-card-title>
          <v-list-item three-line>
            <v-list-item-content>
              <form>
                <v-alert v-if="alert.show" :type="alert.type">
                  {{ alert.message }}
                </v-alert>
                <v-text-field
                  label="New Password"
                  v-model="form.new_password"
                  :append-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showNewPassword ? 'text' : 'password'"
                  @click:append="showNewPassword = !showNewPassword"
                  @input="$v.form.new_password.$touch()"
                  @blur="$v.form.new_password.$touch()"
                  @keyup.enter="submit"
                  :error-messages="newPasswordErrors"
                  :disabled="isLoading"
                  outlined
                  required
                ></v-text-field>
                <v-text-field
                  label="Confirm Password"
                  v-model="form.confirm_password"
                  :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  @click:append="showConfirmPassword = !showConfirmPassword"
                  @input="$v.form.confirm_password.$touch()"
                  @blur="$v.form.confirm_password.$touch()"
                  @keyup.enter="submit"
                  :error-messages="confirmPasswordErrors"
                  :disabled="isLoading"
                  outlined
                  required
                ></v-text-field>

                <v-btn color="primary py-6 mt-3" block :loading="isLoading" @click="submit">
                  Reset Password
                </v-btn>
                <v-divider class="mx-4" color="primary"></v-divider>
                <v-row>
                  <v-col class="mt-6" cols="12" align="center">
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
              </form>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>
    <loading :is-loading="isLoading" />
  </v-container>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, sameAs, minLength, maxLength } from "vuelidate/lib/validators";
import Loading from "../components/Loading";
export default {
  name: "reset-password",
  mixins: [validationMixin],
  components: { Loading },
  validations: {
    form: {
      new_password: {
        required,
        sameAsPassword: sameAs("confirm_password"),
        minLength: minLength(8),
        maxLength: maxLength(60),
      },
      confirm_password: {
        required,
        sameAsPassword: sameAs("new_password"),
      },
    },
  },
  data: () => ({
    appName: process.env.VUE_APP_TITLE || "",
    isLoading: false,
    showNewPassword: false,
    showConfirmPassword: false,
    form: {
      new_password: "",
      confirm_password: "",
      token: "",
    },
    alert: {
      show: false,
      message: "",
      type: "error",
    },
  }),
  methods: {
    submit() {
      this.alert.show = false;
      this.isLoading = true;
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
          .put(this.$api + "/reset-password", this.form)
          .then((response) => {
            this.form.new_password = "";
            this.form.confirm_password = "";
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
            if (err.response != undefined) {
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
    checkSession() {
      this.$http
        .get(this.$api + "/reset-password/" + this.$route.params.token)
        .then(() => {
          this.form.token = this.$route.params.token;
        })
        .catch(() => {
          this.$router.push({ name: "home" });
        });
    },
  },
  mounted() {
    this.checkSession();
  },
  computed: {
    newPasswordErrors() {
      const errors = [];
      if (!this.$v.form.new_password.$dirty) return errors;
      !this.$v.form.new_password.required && errors.push("New Password is required");
      !this.$v.form.new_password.minLength && errors.push("Password minimum length is 8");
      !this.$v.form.new_password.maxLength &&
        errors.push("Password minimum length is 60");
      !this.$v.form.confirm_password.sameAsPassword &&
        errors.push("New Password must same as Confirm Password");
      return errors;
    },
    confirmPasswordErrors() {
      const errors = [];
      if (!this.$v.form.confirm_password.$dirty) return errors;
      !this.$v.form.confirm_password.required &&
        errors.push("Confirm Password is required");
      !this.$v.form.confirm_password.sameAsPassword &&
        errors.push("Confirm Password must same as New Password");
      return errors;
    },
  },
};
</script>
