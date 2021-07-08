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
                v-model="form.trade_name"
                label="Trade Name"
                :counter="120"
                dense
                outlined
                @input="$v.form.trade_name.$touch()"
                @blur="$v.form.trade_name.$touch()"
                :error-messages="tradeNameErrors"
                required
              ></v-text-field>
              <v-text-field
                v-model="form.sole_proprietor_owner"
                label="Sole Proprietor/Owner"
                dense
                outlined
                @input="$v.form.sole_proprietor_owner.$touch()"
                @blur="$v.form.sole_proprietor_owner.$touch()"
                :error-messages="soleProprietorOwnerErrors"
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
                v-model="form.tin_number"
                label="Tin Number"
                dense
                outlined
                @input="$v.form.tin_number.$touch()"
                @blur="$v.form.tin_number.$touch()"
                :error-messages="tinNumberErrors"
                required
              ></v-text-field>
              <v-select
                item-text="name"
                item-value="id"
                :items="taxpayerClassifications"
                label="Taxpayer's Classification"
                dense
                outlined
                v-model="form.taxpayer_classification"
                @input="$v.form.taxpayer_classification.$touch()"
                @blur="$v.form.taxpayer_classification.$touch()"
                @keyup.enter="submit"
                required
                :error-messages="taxpayerClassificationErrors"
              ></v-select>
              <v-select
                item-text="basis"
                item-value="id"
                :items="withholdingTaxes"
                label="Withholding Tax Basis"
                dense
                outlined
                v-model="form.withholding_tax"
                @input="$v.form.withholding_tax.$touch()"
                @blur="$v.form.withholding_tax.$touch()"
                @keyup.enter="submit"
                @change="getWithholdingTax"
                required
                :error-messages="withholdingTaxErrors"
              ></v-select>
              <v-text-field
                v-model="form.withholding_tax_rate"
                label="Withholding Tax Rate"
                dense
                outlined
                disabled
              ></v-text-field>
              <v-text-field
                v-model="form.terms"
                label="terms"
                dense
                outlined
                @input="$v.form.terms.$touch()"
                @blur="$v.form.terms.$touch()"
                :error-messages="termsErrors"
                required
              ></v-text-field>
              <v-text-field
                v-model="form.bank_account"
                label="Bank Account"
                dense
                outlined
                @input="$v.form.bank_account.$touch()"
                @blur="$v.form.bank_account.$touch()"
                :error-messages="bankAccountErrors"
                required
              ></v-text-field>
              <v-text-field
                v-model="form.bank_number"
                label="Bank Number"
                dense
                outlined
                @input="$v.form.bank_number.$touch()"
                @blur="$v.form.bank_number.$touch()"
                :error-messages="bankNumberErrors"
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
import { required, minLength, maxLength, email, numeric } from "vuelidate/lib/validators";
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
        trade_name: "",
        sole_proprietor_owner: "",
        address: "",
        tin_number: "",
        taxpayer_classification: "",
        withholding_tax: "",
        withholding_tax_rate: "",
        terms: "",
        bank_account: "",
        bank_number: "",
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
      trade_name: {
        required,
        minLength: minLength(4),
        maxLength: maxLength(120),
      },
      sole_proprietor_owner: {
        required,
      },
      address: {
        required,
      },
      tin_number: {
        required,
        numeric
      },
      taxpayer_classification: {
        required
      },
      withholding_tax: {
        required
      },
      terms: {
        required
      },
      bank_account: {
        required
      },
      bank_number: {
        required
      },
      email: {
        required,
        email
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
      trade_name: "",
      sole_proprietor_owner: "",
      address: "",
      tin_number: "",
      taxpayer_classification: "",
      withholding_tax: "",
      withholding_tax_rate: "",
      terms: "",
      bank_account: "",
      bank_number: "",
      email: "",
      contact_person: "",
      contact_number: "",
    },
    taxpayerClassifications: [
      { id: 0, name: 'NON-VAT' },
      { id: 1, name: 'VAT' }
    ],
    withholdingTaxes: [],
  }),
  methods: {
    getDropdowns() {
      this.$http.get(this.$api + "/admin/vendors/withholding-tax").then((response) => {
        this.withholdingTaxes = response.data.response.withholdingTax;
      });
    },
    getWithholdingTax() {
      this.$http.get(this.$api + "/admin/vendors/" + this.form.withholding_tax + "/withholding-tax").then((response) => {
        this.form.withholding_tax_rate = response.data.response.rate;
      });
    },
    submit() {
      let url = this.$api + "/admin/vendors/" + this.form.id;
      let data = {
        name: this.form.name,
        trade_name: this.form.trade_name,
        sole_proprietor_owner: this.form.sole_proprietor_owner,
        address: this.form.address,
        tin_number: this.form.tin_number,
        taxpayer_classification: this.form.taxpayer_classification,
        withholding_tax: this.form.withholding_tax,
        withholding_tax_rate: this.form.withholding_tax_rate,
        terms: this.form.terms,
        bank_account: this.form.bank_account,
        bank_number: this.form.bank_number,
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
    tradeNameErrors() {
      const errors = [];
      if (!this.$v.form.trade_name.$dirty) return errors;
      !this.$v.form.trade_name.required && errors.push("Trade Name is required");
      !this.$v.form.trade_name.minLength && errors.push("Trade Name minimum length is 4");
      !this.$v.form.trade_name.maxLength && errors.push("Trade Name max length is 120");
      return errors;
    },
    soleProprietorOwnerErrors() {
      const errors = [];
      if (!this.$v.form.sole_proprietor_owner.$dirty) return errors;
      !this.$v.form.sole_proprietor_owner.required && errors.push("Sole Proprietor/Owner is required");
      return errors;
    },
    addressErrors() {
      const errors = [];
      if (!this.$v.form.address.$dirty) return errors;
      !this.$v.form.address.required && errors.push("Address is required");
      return errors;
    },
    tinNumberErrors() {
      const errors = [];
      if (!this.$v.form.tin_number.$dirty) return errors;
      !this.$v.form.tin_number.required && errors.push("TIN number is required");
      !this.$v.form.tin_number.numeric && errors.push("TIN number must be numeric");
      return errors;
    },
    taxpayerClassificationErrors() {
      const errors = [];
      if (!this.$v.form.taxpayer_classification.$dirty) return errors;
      !this.$v.form.taxpayer_classification.required && errors.push("Select Taxpayer Classification");
      return errors;
    },
    withholdingTaxErrors() {
      const errors = [];
      if (!this.$v.form.withholding_tax.$dirty) return errors;
      !this.$v.form.withholding_tax.required && errors.push("Select Withholding Tax Basic and Rate");
      return errors;
    },
    termsErrors() {
      const errors = [];
      if (!this.$v.form.terms.$dirty) return errors;
      !this.$v.form.terms.required && errors.push("Terms is required");
      return errors;
    },
    bankAccountErrors() {
      const errors = [];
      if (!this.$v.form.bank_account.$dirty) return errors;
      !this.$v.form.bank_account.required && errors.push("Bank Account is required");
      return errors;
    },
    bankNumberErrors() {
      const errors = [];
      if (!this.$v.form.bank_number.$dirty) return errors;
      !this.$v.form.bank_number.required && errors.push("Bank Number is required");
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
      !this.$v.form.contact_person.minLength && errors.push("Contact Person minimum length is 4");
      !this.$v.form.contact_person.maxLength && errors.push("Contact Person max length is 120");
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
        this.form.trade_name = this.item.trade_name;
        this.form.sole_proprietor_owner = this.item.sole_proprietor_owner;
        this.form.address = this.item.address;
        this.form.tin_number = this.item.tin_number;
        this.form.taxpayer_classification = this.item.taxpayer_classification;
        this.form.withholding_tax = this.item.withholding_tax_id;
        this.form.withholding_tax_rate = this.item.withholding_tax_rate;
        this.form.terms = this.item.terms;
        this.form.bank_account = this.item.bank_account;
        this.form.bank_number = this.item.bank_number;
        this.form.email = this.item.email;
        this.form.contact_person = this.item.contact_person;
        this.form.contact_number = this.item.contact_number;
        this.getDropdowns();
        if(this.item.withholding_tax_id != 0) {
          this.getWithholdingTax();
        }
      }
    },
  },
};
</script>
