<template>
  <v-dialog v-model="showModal" transition="dialog-top-transition" :width="width">
    <template>
      <v-card>
        <v-toolbar color="primary">Edit Item</v-toolbar>
        <v-container>
          <v-alert v-if="alert.show" cols="12" :type="alert.type">
            <span v-html="alert.message"></span>
          </v-alert>
          <v-form @submit.prevent="submit">
            <v-text-field
              v-model="form.item_number"
              label="Item Number"
              :counter="120"
              dense
              outlined
              @input="$v.form.item_number.$touch()"
              @blur="$v.form.item_number.$touch()"
              :error-messages="itemNumberErrors"
              required
            ></v-text-field>
            <v-text-field
              v-model="form.unit"
              label="Unit"
              dense
              outlined
              @input="$v.form.unit.$touch()"
              @blur="$v.form.unit.$touch()"
              :error-messages="unitErrors"
              required
            ></v-text-field>
            <v-text-field
              v-model="form.description"
              :counter="250"
              label="Description"
              dense
              outlined
              @input="$v.form.description.$touch()"
              @blur="$v.form.description.$touch()"
              :error-messages="descriptionErrors"
              required
            ></v-text-field>
            <v-text-field
              v-model="form.quantity"
              label="Quantity"
              dense
              outlined
              @input="$v.form.quantity.$touch()"
              @blur="$v.form.quantity.$touch()"
              :error-messages="quantityErrors"
              required
            ></v-text-field>
            <v-text-field
              v-model="form.unit_price"
              label="Unit Price"
              dense
              outlined
              @input="$v.form.unit_price.$touch()"
              @blur="$v.form.unit_price.$touch()"
              :error-messages="unitPriceErrors"
              required
            ></v-text-field>
            <v-row class="text-right">
              <v-col cols="12">
                <v-btn class="my-3 mx-3" type="submit" color="primary"> Submit </v-btn>
                <v-btn class="my-3 mx-3" color="error" @click="showModal = false">
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
  maxLength,
  decimal, } from "vuelidate/lib/validators";
export default {
  name: "item-edit",
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
        purchase_order_id: "", 
        item_number: "",
        unit: "",
        description: "",
        quantity: "",
        unit_price: "",
      }),
    },
  },
  validations: {
    form: {
      item_number: {
        required,
        maxLength: maxLength(120),
      },
      unit: {
        required,
      },
      description: {
        required,
        maxLength: maxLength(230),
      },
      quantity: {
        required,
        decimal
      },
      unit_price: {
        required,
        decimal
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
      item_number: "",
      unit: "",
      description: "",
      quantity: "",
      unit_price: "",
    },
  }),
  methods: {
    submit() {
        let url = this.$api + "/preparer/purchase-orders/" + this.item.purchase_order_id + '/items/' + this.item.id;
      let data = {
        item_number: this.form.item_number,
        unit: this.form.unit,
        description: this.form.description,
        quantity: this.form.quantity,
        unit_price: this.form.unit_price,
        
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
    itemNumberErrors() {
      const errors = [];
      if (!this.$v.form.item_number.$dirty) return errors;
      !this.$v.form.item_number.required && errors.push("Item Number is required");
      !this.$v.form.item_number.maxLength && errors.push("Item Number max length is 120");
      return errors;
    },
    unitErrors() {
      const errors = [];
      if (!this.$v.form.unit.$dirty) return errors;
      !this.$v.form.unit.required && errors.push("Unit is required");
      return errors;
    },
    descriptionErrors() {
      const errors = [];
      if (!this.$v.form.description.$dirty) return errors;
      !this.$v.form.description.required && errors.push("Description is required");
      !this.$v.form.description.maxLength && errors.push("Description max length is 230");
      return errors;
    },
    quantityErrors() {
      const errors = [];
      if (!this.$v.form.quantity.$dirty) return errors;
      !this.$v.form.quantity.required && errors.push("Quantity is required");
      !this.$v.form.quantity.decimal && errors.push("Quantity must be Numeric or Decimal");
      return errors;
    },
    unitPriceErrors() {
      const errors = [];
      if (!this.$v.form.unit_price.$dirty) return errors;
      !this.$v.form.unit_price.required && errors.push("Unit Price is required");
      !this.$v.form.unit_price.decimal && errors.push("Unit Price must be Numeric or Decimal");
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
          item_number: this.item.item_no,
          unit: this.item.unit,
          description: this.item.description,
          quantity: this.item.quantity,
          unit_price: this.item.unit_price,
        };
      }
    },
    showModal: function () {
      if (!this.showModal) {
        this.alert.show = false;
        this.$v.$reset();
        this.form = {
          id: "",
          item_number: "",
          unit: "",
          description: "",
          quantity: "",
          unit_price: "",
        };
        this.$emit("close");
      }
    },
  },
};
</script>
