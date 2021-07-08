<template>
  <v-dialog
    v-model="showModal"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <template>
      <v-card>
        <v-toolbar color="primary">
          <v-toolbar-title>
            <span v-html="'Items for ' + item.company.name"></span>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="showModal = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-container>
          <v-row>
            <v-col class="text-right" cols="12">
              <div class="my-3">
                <v-btn @click="showAdd = true" depressed large color="primary"
                  >Add Items</v-btn
                >
              </div>
            </v-col>
          </v-row>
          <data-table
            ref="items"
            :hasEdit="true"
            @edit="edit"
            :hasDelete="true"
            @delete="deactivate"
            :path="'/preparer/purchase-orders/' + item.id + '/items'"
          />
          <purchase-order-item-add
            :show="showAdd"
            :purchaseOrdersId="item.id"
            @close="showAdd = false"
            @generate-table="generateTable"
          />
          <purchase-order-item-edit
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
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
import DataTable from "../../DataTable.vue";
import ConfirmBox from "../../ConfirmBox.vue";
import AlertBox from "../../AlertBox.vue";
import PurchaseOrderItemAdd from "./Add.vue";
import PurchaseOrderItemEdit from "./Edit.vue";
export default {
  name: "purchase-oder-item",
  components: { DataTable, ConfirmBox, AlertBox, PurchaseOrderItemAdd, PurchaseOrderItemEdit},
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
        item_number: "",
        unit: "",
        quantity: "",
        unit_price: "",
        total: "",
      }),
    },
  },
  data: () => ({
    showModal: false,
    showAdd: false,
    showEdit: false,
    showDeactivate: false,
    deactivateMessage: "",
    alert: {
      show: false,
      title: "Notification",
      message: "Sample alert",
    },
    form: { 
      id: "", 
      purchaseOrdersId: "", 
      item_number: "",
      unit: "",
      quantity: "",
      unit_price: "",
      total: "",
    },
  }),
  methods: {
    edit(item) {
      this.form = item;
      this.showEdit = true;
    },
    deactivate(item) {
      this.usedKey = item.id;
      this.deactivateMessage = "Are you sure you want to delete ";
      this.deactivateMessage += item.item_no;
      this.deactivateMessage += "?";
      this.showDeactivate = true;
    },
    submit() {
      this.isLoading = true;
      let url =
        this.$api + "/preparer/purchase-orders/" + this.item.id + "/items/" + this.usedKey;
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
    generateTable() {
      if (this.show) {
        this.$nextTick(() => {
          this.$refs.items.generate();
        });
      }
    },
  },
  watch: {
    show: function () {
      if (this.show) {
        this.showModal = this.show;
        this.generateTable();
      }
    },
    showModal: function () {
      if (!this.showModal) {
        this.$emit("close");
        this.$emit("generate-table");
      }
    },
  },
};
</script>
