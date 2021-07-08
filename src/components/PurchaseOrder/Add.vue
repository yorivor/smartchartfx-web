<template>
  <v-dialog 
    v-model="showModal" 
    fullscreen
    hide-overlay 
    transition="dialog-top-transition"
  >
    <template>
      <v-card>
        <v-toolbar color="primary">Create Pruchase Order</v-toolbar>
        <v-container>
          <v-alert v-if="alert.show" cols="12" :type="alert.type">
            <span v-html="alert.message"></span>
          </v-alert>
          <v-form @submit.prevent="submit">
            <v-row>
              <v-col 
                cols="6"
                md="6"
              >
                <v-select
                  v-model="form.vendor"
                  label="Vendors"
                  :items="vendors"
                  item-text="name"
                  item-value="id"
                  outlined
                  dense
                  @input="$v.form.vendor.$touch()"
                  @blur="$v.form.vendor.$touch()"
                  :error-messages="vendorErrors"
                  required
                  @change="getVendorInformation"
                ></v-select>
                <div v-if="showVendorDetails">
                  <b>Address:</b> {{ this.vendor.address }}
                  <br />
                  <b>Contact Number:</b> {{ this.vendor.contact_number }}
                  <br />
                  <b>Email:</b> {{ this.vendor.email }}
                </div>
              </v-col>
              <v-col 
                cols="6"
                md="6"
              >
                <v-select
                  v-model="form.company"
                  label="Company"
                  :items="companies"
                  item-text="name"
                  item-value="id"
                  outlined
                  dense
                  @input="$v.form.company.$touch()"
                  @blur="$v.form.company.$touch()"
                  :error-messages="companyErrors"
                  required
                  @change="getCompanyAddress"
                ></v-select>
                <div v-if="showCompanyDetails">
                  <v-select
                    v-model="form.company_address"
                    label="Company Address"
                    :items="addresses"
                    item-text="name"
                    item-value="id"
                    outlined
                    dense
                    @input="$v.form.company_address.$touch()"
                    @blur="$v.form.company_address.$touch()"
                    :error-messages="companyAddressErrors"
                    required
                     @change="getCompanyContact"
                  ></v-select>
                  <br />
                  <v-select
                    v-model="form.company_contact"
                    label="Company Contact"
                    :items="contacts"
                    item-text="email"
                    item-value="id"
                    outlined
                    dense
                    @input="$v.form.company_contact.$touch()"
                    @blur="$v.form.company_contact.$touch()"
                    :error-messages="companyContactErrors"
                    required
                  ></v-select>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                cols="4"
                md="4"
              >
                <v-text-field
                    class="text-field"
                    v-model="form.requisitioner"
                    label="Requisitioner"
                    @input="$v.form.requisitioner.$touch()"
                    @blur="$v.form.requisitioner.$touch()"
                    @keyup.enter="submit"
                    required
                    outlined
                    :error-messages="requisitionerErrors"
                    disabled
                  ></v-text-field>
              </v-col>
              <v-col
                cols="4"
                md="4"
              >
                <v-text-field
                    class="text-field"
                    v-model="form.payment_terms"
                    label="Payment Terms"
                    @input="$v.form.payment_terms.$touch()"
                    @blur="$v.form.payment_terms.$touch()"
                    @keyup.enter="submit"
                    required
                    outlined
                    :error-messages="paymentTermsErrors"
                  ></v-text-field>
              </v-col>
              <v-col
                cols="4"
                md="4"
              >
                <v-text-field
                    class="text-field"
                    v-model="form.shipping_terms"
                    label="Shipping Terms"
                    @input="$v.form.shipping_terms.$touch()"
                    @blur="$v.form.shipping_terms.$touch()"
                    @keyup.enter="submit"
                    required
                    outlined
                    :error-messages="shippingTermsErrors"
                  ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                cols="4"
                md="4"
              >
                <v-text-field
                  class="text-field"
                  v-model="vendor.vat_rate"
                  label="Vat Rate"
                  required
                  outlined
                  disabled
                ></v-text-field>
              </v-col>
              <v-col
                cols="4"
                md="4"
              >
                <v-text-field
                    class="text-field"
                    v-model="form.s_and_h"
                    label="Shipping and Handling Fee"
                    outlined
                  ></v-text-field>
              </v-col>
              <v-col
                cols="4"
                md="4"
              >
                <v-text-field
                    class="text-field"
                    v-model="form.others"
                    label="Other fees"
                    outlined
                  ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col 
                cols="8"
                md="8"
              >
                <v-textarea
                  class="text-field"
                  v-model="form.comment"
                  @input="$v.form.comment.$touch()"
                  @blur="$v.form.comment.$touch()"
                  @keyup.enter="submit"
                  counter="320"
                  label="Other Comments or Special Instructions"
                  outlined
                  :error-messages="commentErrors"
                ></v-textarea>
              </v-col>
            </v-row>
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
</template>
<script>
import { validationMixin } from "vuelidate";
import {
  required,
  decimal,
  maxLength
} from "vuelidate/lib/validators";
export default {
  name: "purchase-order-add",
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
      vendor: {
        required,
      },
      company: {
       required,
      },
      company_address: {
        required,
      },
      company_contact: {
        required,
      },
      requisitioner: {
        required,
      },
      payment_terms: {
        required,
      },
      shipping_terms: {
        required,
      },
      comment: {
        maxLength: maxLength(320)
      }
    },
  },
  data: () => ({
    showModal: false,
    showVendorDetails: false,
    showCompanyDetails: false,
    vendors: [],
    companies: [],
    addresses: [],
    contacts: [],
    alert: {
      show: false,
      message: "",
      type: "error",
    },
    form: {
      vendor: "",
      company: "",
      company_address: "",
      company_contact: "",
      requisitioner: "",
      payment_terms: "",
      shipping_terms: "",
      s_and_h: "",
      others: "",
      comment: "",
    },
    vendor: "",
  }),
  methods: {
    getVendors() {
      this.$http.get(this.$api + "/preparer/vendors/list").then((response) => {
        this.vendors = response.data.response.vendors;
        this.form.requisitioner = this.displayname;
      });
    },
    getVendorInformation() {
      this.$http.get(this.$api + "/preparer/vendors/" + this.form.vendor).then((response) => {
        this.showVendorDetails = true;
        this.vendor = response.data.response;
        this.vendor.vat_rate = response.data.response.vat_rate.rate + "%";
        this.form.payment_terms = response.data.response.terms;
      });
    },
    getCompanies() {
      this.$http.get(this.$api + "/preparer/companies/list").then((response) => {
        this.companies = response.data.response.companies;
      });
    },
    getCompanyAddress() {
      this.$http.get(this.$api + "/preparer/companies/" + this.form.company + "/address").then((response) => {
        this.showCompanyDetails = true;
        this.addresses = response.data.response.addresses;
      });
    },
    getCompanyContact() {
      this.$http.get(this.$api + "/preparer/companies/" + this.form.company + "/contact").then((response) => {
        this.showCompanyDetails = true;
        this.contacts = response.data.response.contacts;
      });
    },
    submit() {
      let url = this.$api + "/preparer/purchase-orders";
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
              vendor: "",
              company: "",
              company_address: "",
              company_contact: "",
              requisitioner: "",
              payment_terms: "",
              shipping_terms: "",
              s_and_h: "",
              others: "",
              comment: "",
            };
            this.vendor.address = "";
            this.vendor.email = "";
            this.vendor.contact_number = "";
            this.vendor.vat_rate = "";
            this.showVendorDetails = false;
            this.showCompanyDetails = false;
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
    vendorErrors() {
      const errors = [];
      if (!this.$v.form.vendor.$dirty) return errors;
      !this.$v.form.vendor.required && errors.push("Please select a Vendor");
      return errors;
    },
    companyErrors() {
      const errors = [];
      if (!this.$v.form.company.$dirty) return errors;
      !this.$v.form.company.required && errors.push("Please select a Company");
      return errors;
    },
    companyAddressErrors() {
      const errors = [];
      if (!this.$v.form.company_address.$dirty) return errors;
      !this.$v.form.company_address.required && errors.push("Please select a Company Address");
      return errors;
    },
    companyContactErrors() {
      const errors = [];
      if (!this.$v.form.company_contact.$dirty) return errors;
      !this.$v.form.company_contact.required && errors.push("Please select a Company Contact");
      return errors;
    },
    requisitionerErrors() {
      const errors = [];
      if (!this.$v.form.requisitioner.$dirty) return errors;
      !this.$v.form.requisitioner.required && errors.push("Requisitioner is Required");
      return errors;
    },
    paymentTermsErrors() {
      const errors = [];
      if (!this.$v.form.payment_terms.$dirty) return errors;
      !this.$v.form.payment_terms.required && errors.push("Payment Terms is Required");
      return errors;
    },
    shippingTermsErrors() {
      const errors = [];
      if (!this.$v.form.shipping_terms.$dirty) return errors;
      !this.$v.form.shipping_terms.required && errors.push("Shipping Terms is Required");
      return errors;
    },
    commentErrors() {
      const errors = [];
      if (!this.$v.form.comment.$dirty) return errors;
      !this.$v.form.comment.maxLength && errors.push("Name max length is 320");
      return errors;
    },
    displayname: function () {
      return this.$store.getters.displayname;
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
          vendor: "",
          company: "",
          company_address: "",
          company_contact: "",
          requisitioner: "",
          payment_terms: "",
          shipping_terms: "",
          s_and_h: "",
          others: "",
          comment: "",
        };
        this.vendor.address = "";
        this.vendor.email = "";
        this.vendor.contact_number = "";
        this.vendor.vat_rate = "";
        this.showVendorDetails = false;
      } else {
        this.getVendors();
        this.getCompanies();
      }
    },
  },
};
</script>
