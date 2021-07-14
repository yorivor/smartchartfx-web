<template>
  <v-container>
    <v-list-item-title class="headline mb-1">Vendor Management</v-list-item-title>
    <v-row>
      <v-col class="text-left" xs="6" sm="6" md="3" lg="3" xl="3">
        <v-text-field
          v-model="params.search"
          label="Search"
          dense
          outlined
          hide-details
          @change="generateTable"
        ></v-text-field>
      </v-col>
      <v-col class="text-left" xs="6" sm="6" md="3" lg="3" xl="3">
        <v-menu
          v-model="fromDateMenu"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="290px"
          required
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="params.dateFrom"
              label="Date From"
              v-bind="attrs"
              v-on="on"
              readonly
              outlined
              dense
              required
            ></v-text-field>
          </template>
          <v-date-picker v-model="params.dateFrom" @input="fromDateMenu = false" @change="generateTable"></v-date-picker>
        </v-menu>
      </v-col>
      <v-col class="text-left" xs="6" sm="6" md="3" lg="3" xl="3">
        <v-menu
          v-model="toDateMenu"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="290px"
          required
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="params.dateTo"
              label="Date To"
              v-bind="attrs"
              v-on="on"
              readonly
              outlined
              dense
              required
            ></v-text-field>
          </template>
          <v-date-picker v-model="params.dateTo" @input="toDateMenu = false" @change="generateTable"></v-date-picker>
        </v-menu>
      </v-col>
      <v-col class="text-left" xs="2" sm="2" md="1" lg="1" xl="1">
        <v-btn @click="clear" depressed color="primary">
          Clear
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-spacer></v-spacer>
      <v-col class="text-right" cols="6">
        <div class="my-3">
          <v-btn @click="showAdd = true" depressed large color="primary">
            Create Vendor
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <data-table
      ref="vendors"
      :hasEdit="true"
      @edit="edit"
      :hasDelete="true"
      @delete="deactivate"
      :hasStatus="true"
      @changeStatus="changeStatus"
      :path="'/admin/vendors'"
    />
    <v-row>
      <v-col class="text-left" xs="4" sm="4" md="2" lg="2" xl="2">
        <download-excel
          :fileName="'vendor-report'"
          :path='"/admin/vendors/excel?search=" + 
          this.params.search + "&dateFrom=" + this.params.dateFrom + "&dateTo=" + this.params.dateTo'
        >Download</download-excel>
      </v-col>
    </v-row>
    <vendor-add :show="showAdd" @close="showAdd = false" @generate-table="generateTable" />
    <vendor-edit
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
import VendorAdd from "../../components/Vendor/Add.vue";
import VendorEdit from "../../components/Vendor/Edit.vue";
import ConfirmBox from "../../components/ConfirmBox.vue";
import AlertBox from "../../components/AlertBox.vue";
import DownloadExcel from "../../components/DownloadExcel.vue";
export default {
  name: "vendors",
  components: {
    DataTable,
    VendorAdd,
    VendorEdit,
    ConfirmBox,
    AlertBox,
    DownloadExcel
  },
  data: () => ({
    usedKey: "",
    showAdd: false,
    showEdit: false,
    showDeactivate: false,
    fromDateMenu: false,
    toDateMenu: false,
    deactivateMessage: "",
    params: { search: "", dateFrom: "", dateTo: "" },
    alert: {
      show: false,
      title: "Notification",
      message: "Sample alert",
    },
    form: {},
  }),
  methods: {
    clear() {
      this.params = { 
        search: "", 
        dateFrom: "", 
        dateTo: "",
      };
      this.generateTable();
    },
    generateTable() {
      this.$refs.vendors.setParameters(this.params);
      this.$refs.vendors.generate();
    },
    edit(item) {
      this.form = item;
      this.showEdit = true;
    },
    deactivate(item) {
      this.usedKey = item.id;
      this.deactivateMessage = "Are you sure you want to deactivate ";
      this.deactivateMessage += item.name;
      this.deactivateMessage += "?";
      this.showDeactivate = true;
    },
    changeStatus(item) {
      let url = this.$api + "/admin/vendors/" + item.id + "/toggle-status";
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
      let url = this.$api + "/admin/vendors/" + this.usedKey;
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
    nameErrors() {
      const errors = [];
      if (!this.$v.form.name.$dirty) return errors;
      !this.$v.form.name.required && errors.push("Name is required");
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
      !this.$v.form.email.required && errors.push("E-mail is required");
      !this.$v.form.email.email && errors.push("E-Mail is invalid");
      return errors;
    },
    contactPersonErrors() {
      const errors = [];
      if (!this.$v.form.contact_person.$dirty) return errors;
      !this.$v.form.contact_person.required && errors.push("Contact Person is required");
      !this.$v.form.contact_person.maxLength && errors.push("Contact Person max length is 120");
      return errors;
    },
    contactNumberErrors() {
      const errors = [];
      if (!this.$v.form.contact_number.$dirty) return errors;
      !this.$v.form.contact_number.required && errors.push("Contact Person is required");
      return errors;
    },
  },
};
</script>
