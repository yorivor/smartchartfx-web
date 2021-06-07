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
            <span v-html="'Company Addresses for ' + item.name"></span>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="showModal = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-container>
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
            <v-spacer></v-spacer>
            <v-col class="text-right" cols="6">
              <div class="my-3">
                <v-btn @click="showAdd = true" depressed large color="primary"
                  >Add Address</v-btn
                >
              </div>
            </v-col>
          </v-row>
          <data-table
            ref="addresses"
            :hasEdit="true"
            @edit="edit"
            :hasDelete="true"
            @delete="deactivate"
            :hasStatus="true"
            @changeStatus="changeStatus"
            :path="'/admin/companies/' + item.id + '/addresses'"
          />
          <address-add
            :show="showAdd"
            :company-id="item.id"
            @close="showAdd = false"
            @generate-table="generateTable"
          />
          <address-edit
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
import AddressAdd from "./Add.vue";
import AddressEdit from "./Edit.vue";

export default {
  name: "company-address",
  components: { DataTable, ConfirmBox, AlertBox, AddressAdd, AddressEdit },
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
        code: "",
        name: "",
      }),
    },
  },
  data: () => ({
    showModal: false,
    showAdd: false,
    showEdit: false,
    showDeactivate: false,
    deactivateMessage: "",
    params: { search: "" },
    alert: {
      show: false,
      title: "Notification",
      message: "Sample alert",
    },
    form: { id: "", company_id: "", code: "", name: "" },
  }),
  methods: {
    edit(item) {
      this.form = item;
      this.showEdit = true;
    },
    deactivate(item) {
      this.usedKey = item.id;
      this.deactivateMessage = "Are you sure you want to delete ";
      this.deactivateMessage += item.name;
      this.deactivateMessage += "?";
      this.showDeactivate = true;
    },
    changeStatus(item) {
      let url =
        this.$api +
        "/admin/companies/" +
        this.item.id +
        "/addresses/" +
        item.id +
        "/toggle-status";
      this.$http
        .put(url)
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
    submit() {
      this.isLoading = true;
      let url =
        this.$api + "/admin/companies/" + this.item.id + "/addresses/" + this.usedKey;
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
          this.$refs.addresses.setParameters(this.params);
          this.$refs.addresses.generate();
        });
      }
    },
  },
  watch: {
    show: function () {
      if (this.show) {
        this.params.search = "";
        this.showModal = this.show;
        this.generateTable();
      }
    },
    showModal: function () {
      if (!this.showModal) {
        this.$emit("close");
      }
    },
  },
};
</script>
