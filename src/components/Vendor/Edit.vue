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
          <v-toolbar color="primary">Edit Vendor</v-toolbar>
          <v-container>
            <v-alert v-if="alert.show" cols="12" :type="alert.type">
              <span v-html="alert.message"></span>
            </v-alert>
            <v-form @submit.prevent="submit">
              <v-text-field
                v-model="form.name"
                label="Name"
                :counter="120"
                dense
                outlined
                @input="$v.form.name.$touch()"
                @blur="$v.form.name.$touch()"
                :error-messages="nameErrors"
                required
              ></v-text-field>
              <v-text-field
                v-model="form.address"
                label="Address"
                dense
                outlined
                @input="$v.form.address.$touch()"
                @blur="$v.form.address.$touch()"
                :error-messages="addressErrors"
                required
              ></v-text-field>
              <v-text-field
                v-model="form.email"
                label="Email Address"
                dense
                outlined
                @input="$v.form.email.$touch()"
                @blur="$v.form.email.$touch()"
                :error-messages="emailErrors"
                required
              ></v-text-field>
              <v-text-field
                v-model="form.contact_person"
                label="Contact Person"
                :counter="120"
                dense
                outlined
                @input="$v.form.contact_person.$touch()"
                @blur="$v.form.contact_person.$touch()"
                :error-messages="contactPersonErrors"
                required
              ></v-text-field>
              <v-text-field
                v-model="form.contact_number"
                label="Phone/Mobile Number"
                dense
                outlined
                @input="$v.form.contact_number.$touch()"
                @blur="$v.form.contact_number.$touch()"
                :error-messages="contactNumberErrors"
                required
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
import { required, minLength, maxLength, email } from "vuelidate/lib/validators";
export default {
  name: "vendor-edit",
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
        name: "",
        address: "",
        email: "",
        contact_person: "",
        contact_number: "",
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
      address: {
        required,
      },
      email: {
        required,
        email,
      },
      contact_person: {
        required,
        minLength: minLength(4),
        maxLength: maxLength(120),
      },
      contact_number: {
        required,
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
      address: "",
      email: "",
      contact_person: "",
      contact_number: "",
    },
  }),
  methods: {
    submit() {
      let url = this.$api + "/admin/vendors/" + this.form.id;
      let data = {
        name: this.form.name,
        address: this.form.address,
        email: this.form.email,
        contact_person: this.form.contact_person,
        contact_number: this.form.contact_number,
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
    addressErrors() {
      const errors = [];
      if (!this.$v.form.address.$dirty) return errors;
      !this.$v.form.address.required && errors.push("Address is required");
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.form.email.$dirty) return errors;
      !this.$v.form.email.required && errors.push("Email is required");
      !this.$v.form.email.email && errors.push("E-Mail is invalid");
      return errors;
    },
    contactPersonErrors() {
      const errors = [];
      if (!this.$v.form.contact_person.$dirty) return errors;
      !this.$v.form.contact_person.required && errors.push("Contact Person is required");
      !this.$v.form.contact_person.minLength &&
        errors.push("Contact Person minimum length is 4");
      !this.$v.form.contact_person.maxLength &&
        errors.push("Contact Person max length is 120");
      return errors;
    },
    contactNumberErrors() {
      const errors = [];
      if (!this.$v.form.contact_number.$dirty) return errors;
      !this.$v.form.contact_number.required && errors.push("Contact Person is required");
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
        this.form.name = this.item.name;
        this.form.address = this.item.address;
        this.form.email = this.item.email;
        this.form.contact_person = this.item.contact_person;
        this.form.contact_number = this.item.contact_number;
      }
    },
  },
};
</script>
