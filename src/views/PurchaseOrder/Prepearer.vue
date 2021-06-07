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
    </v-row>
    <data-table
      ref="purchaseOrders"
      :hasView="true"
      @view="view"
      :path="'/reviewer/purchase-orders'"
    />
    <company-add
      :show="showView"
      @close="showView = false"
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
import CompanyAdd from "../../components/Company/Add.vue";
import ConfirmBox from "../../components/ConfirmBox.vue";
import AlertBox from "../../components/AlertBox.vue";
export default {
  name: "purchase-order-reviewer",
  components: {
    DataTable,
    CompanyAdd,
    ConfirmBox,
    AlertBox,
  },
  data: () => ({
    showAdd: false,
    showView: false,
    showDeactivate: false,
    showAddress: false,
    showContact: false,
    deactivateMessage: "",
    params: { search: "" },
    alert: {
      show: false,
      title: "Notification",
      message: "Sample alert",
    },
    form: {},
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
    viewAddress(item) {
      this.form = item;
      this.showAddress = true;
    },
    viewContact(item) {
      this.form = item;
      this.showContact = true;
    },
  },
  mounted() {
    this.generateTable();
  },
};
</script>
