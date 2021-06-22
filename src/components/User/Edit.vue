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
          <v-toolbar color="primary">Edit User</v-toolbar>
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
  name: "user-edit",
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
        company_id: [],
        user_type_id: [],
        fullname: "",
        username: "",
      }),
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
    },
  },
  data: () => ({
    showModal: false,
    showInputPassword: false,
    showInputPasswordConfirm: false,
    userTypes: [],
    companies: [],
    alert: {
      show: false,
      message: "",
      type: "error",
    },
    form: {
      id: "",
      company_id: [],
      user_type_id: [],
      fullname: "",
      username: "",
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
      let url = this.$api + "/admin/users/" + this.form.id;
      let data = {
        fullname: this.form.fullname,
        user_type_id: this.form.user_type_id,
        company_id: this.form.company_id,
        update_type: "details",
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
        this.alert.show = false;
        this.$v.$reset();
      } else {
        this.form.id = this.item.id;
        this.form.company_id = this.item.companies.map((x) => x.id);
        this.form.user_type_id = this.item.types.map((x) => x.id);
        this.form.username = this.item.username;
        this.form.fullname = this.item.fullname;
        this.getDropdowns();
      }
    },
  },
};
</script>
