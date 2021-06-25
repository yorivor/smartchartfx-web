<template>
  <v-container>
    <v-list-item-title class="headline mb-1">Purchase Order</v-list-item-title>
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
    </v-row>
    <data-table
      ref="purchaseOrders"
      :hasView="true"
      :hasPoStatus="true"
      @view="view"
      :path="'/purchase-orders'"
    />
    <purchase-order-view
      :show="showView"
      @close="showView = false"
      :item="form"
      @generateTable="generateTable"
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
import DataTable from "@/components/DataTable.vue";
import PurchaseOrderView from "@/components/PurchaseOrder/View.vue";
import AlertBox from "@/components/AlertBox.vue";
export default {
  name: "purchase-order-reviewer",
  components: {
    DataTable,
    PurchaseOrderView,
    AlertBox,
  },
  data: () => ({
    showView: false,
    params: { search: "" },
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
      vendor: {
        name: "",
        vat_rate: {
          rate: "",
        },
      },
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
  },
  mounted() {
    this.generateTable();
  },
};
</script>
