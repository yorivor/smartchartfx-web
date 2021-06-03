<template>
  <v-container>
    <v-list-item-title class="headline mb-1">Vendor Management</v-list-item-title>
    <v-row>
      <v-col class="text-right" cols="12" xl="2" lg="12" md="6" sm="12">
        <div class="my-2">
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
export default {
  name: "vendors",
  components: {
    DataTable,
    VendorAdd,
    VendorEdit,
    ConfirmBox,
    AlertBox,
  },
  data: () => ({
    usedKey: "",
    showAdd: false,
    showEdit: false,
    showDeactivate: false,
    deactivateMessage: "",
    alert: {
      show: false,
      title: "Notification",
      message: "Sample alert",
    },
    form: {},
  }),
  methods: {
    generateTable() {
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
      !this.$v.form.name.required && errors.push("Vendor Name is required");
      !this.$v.form.name.maxLength && errors.push("Vendor Name max length is 120");
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
