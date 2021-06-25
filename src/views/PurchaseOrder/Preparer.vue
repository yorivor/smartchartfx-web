<template>
  <v-container>
    <v-list-item-title class="headline mb-1">Purchase Orders</v-list-item-title>
    <v-row>
      <v-col class="text-left my-3" xs="6" sm="6" md="3" lg="3" xl="3">
        <v-text-field
          v-model="params.search"
          label="Search"
          dense
          outlined
          hide-details
          @change="generateTable"
        ></v-text-field>
      </v-col>
      <v-col class="text-left my-3" xs="6" sm="6" md="3" lg="3" xl="3">
        <v-select
          v-model="params.status"
          label="Select Status"
          :items="status"
          item-text="name"
          item-value="id"
          outlined
          dense
          required
          @change="generateTable"
        ></v-select>
      </v-col>
      <v-spacer></v-spacer>
      <v-col class="text-right" cols="6">
        <v-btn class="my-3" @click="showAdd = true" depressed large color="primary">
          Create Purchase Order
        </v-btn>
      </v-col>
    </v-row>
    <data-table
      ref="purchaseOrders"
      :hasPoStatus="true"
      :hasUpload="true"
      @upload="addUpload"
      :hasView="true"
      @view="view"
      :hasEdit="true"
      @edit="edit"
      :hasAdd="true"
      @add="addItem"
      :hasDelete="true"
      @delete="deactivate"
      :path="'/preparer/purchase-orders'"
    />
    <purchase-order-item
      :show="showAddItem"
      @close="showAddItem = false"
      :item="form"
      @generate-table="generateTable"
    />
    <purchase-order-upload
      :show="showAddUpload"
      @close="showAddUpload = false"
      :item="form"
      @generate-table="generateTable"
    />
    <purchase-order-view
      :show="showView"
      @close="showView = false"
      :item="form"
      @generate-table="generateTable"
    />
    <purchase-order-add :show="showAdd" @close="showAdd = false" @generate-table="generateTable" />
    <purchase-order-edit
      :show="showEdit"
      :item="form"
      @close="showEdit = false"
      @generate-table="generateTable"
    />
    <confirm-box
      :show="showDeactivate"
      :message="deactivateMessage"
      @yes="submit"
      @no="showDeactivate = false"
    />
    <alert-box
      :show="alert.show"
      :title="alert.title"
      :message="alert.message"
      @close="alert.show = false"
    />
  </v-container>
</template>
<script>
import DataTable from "../../components/DataTable.vue";
import PurchaseOrderView from "../../components/PurchaseOrder/View.vue";
import PurchaseOrderAdd from "../../components/PurchaseOrder/Add.vue";
import PurchaseOrderEdit from "../../components/PurchaseOrder/Edit.vue";
import PurchaseOrderItem from "../../components/PurchaseOrder/Item/Index.vue";
import PurchaseOrderUpload from "../../components/PurchaseOrder/Upload/Index.vue";
import ConfirmBox from "../../components/ConfirmBox.vue";
import AlertBox from "../../components/AlertBox.vue";
export default {
  name: "users",
  components: {
    DataTable,
    PurchaseOrderItem,
    PurchaseOrderUpload,
    PurchaseOrderView,
    PurchaseOrderAdd,
    PurchaseOrderEdit,
    ConfirmBox,
    AlertBox,
  },
  data: () => ({
    usedKey: "",
    showView: false,
    showAdd: false,
    showEdit: false,
    showAddItem: false,
    showAddUpload: false,
    showDeactivate: false,
    deactivateMessage: "",
    alert: {
      show: false,
      title: "Notification",
      message: "Sample alert",
    },
    params: { search: "", status: "" },
    form: {
      id: "",
      created_at: new Date(),
      po_number: "",
      vendor: { name: "", vat_rate: {
        rate: "",
      } },
      company: { name: "" },
      company_address: { name: "" },
      company_contact: { name: "" },
    },
    status: [
      { id: "", name: 'All' },
      { id: "0", name: 'Created' },
      { id: 1, name: 'For Review' },
      { id: 2, name: 'For Approval' },
      { id: 3, name: 'Approved' },
      { id: 4, name: 'Reject' },
      { id: 5, name: 'Delivered' },
      { id: 6, name: 'Cancelled' },
    ],
  }),
  methods: {
    generateTable() {
      this.$refs.purchaseOrders.setParameters(this.params);
      this.$refs.purchaseOrders.generate();
    },
    view(item) {
      this.form = item;
      this.showView = true;
    },
    addItem(item) {
      this.form = item;
      this.showAddItem = true;
    },
    addUpload(item) {
      this.form = item;
      this.showAddUpload = true;
    },
    edit(item) {
      this.form = item;
      this.showEdit = true;
    },
    deactivate(item) {
      this.usedKey = item.id;
      this.deactivateMessage = "Are you sure you want to deactivate ";
      this.deactivateMessage += item.po_number;
      this.deactivateMessage += "?";
      this.showDeactivate = true;
    },
    submit() {
      this.isLoading = true;
      let url = this.$api + "/preparer/purchase-orders/" + this.usedKey;
      this.$http
        .delete(url)
        .then((response) => {
          this.generateTable();
          this.isLoading = false;
          this.alert.show = true;
          this.alert.message = response.data.message;
        })
        .catch((error) => {
          let msg = "";
          if (error.response !== undefined) {
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
    },
  },
  mounted() {
    this.generateTable();
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
    vatRateErrors() {
      const errors = [];
      if (!this.$v.form.vat_rate.$dirty) return errors;
      !this.$v.form.vat_rate.required && errors.push("Vat Rate is required");
      !this.$v.form.vat_rate.decimal && errors.push("Please input a decimal number");
      return errors;
    },
    commentErrors() {
      const errors = [];
      if (!this.$v.form.comment.$dirty) return errors;
      !this.$v.form.comment.maxLength && errors.push("Name max length is 320");
      return errors;
    },
  },
};
</script>
