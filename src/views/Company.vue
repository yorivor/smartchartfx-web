<template>
  <v-container>
    <v-list-item-title class="headline mb-1">Company Management</v-list-item-title>
    <v-row>
      <v-col class="text-right" cols="12" xl="2" lg="12" md="6" sm="12">
        <div class="my-2">
          <v-btn @click="showAdd = true" depressed large color="primary">
            Create Company
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <data-table
      ref="companies"
      :hasEdit="true"
      :hasDelete="true"
      :hasAddress="true"
      @edit="edit"
      @delete="deactivate"
      @viewAddress="viewAddress"
      :path="'/companies'"
    />
    <company-add
      :show="showAdd"
      @close="showAdd = false"
      @generate-table="generateTable"
    />
    <company-edit
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
import DataTable from "../components/DataTable.vue";
import CompanyAdd from "../components/Company/Add.vue";
import CompanyEdit from "../components/Company/Edit.vue";
import ConfirmBox from "../components/ConfirmBox.vue";
import AlertBox from "../components/AlertBox.vue";
export default {
  name: "companies",
  components: {
    DataTable,
    CompanyAdd,
    CompanyEdit,
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
      this.$refs.companies.generate();
    },
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
    viewAddress(item) {
      /** @TODO Create View for Addresses per Company */
      alert("View Address");
    },
    submit() {
      this.isLoading = true;
      let url = this.$api + "/companies/" + this.usedKey;
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
    fullnameErrors() {
      const errors = [];
      if (!this.$v.form.name.$dirty) return errors;
      !this.$v.form.name.required && errors.push("Full Name is required");
      !this.$v.form.name.minLength && errors.push("Full Name minimum length is 4");
      !this.$v.form.name.maxLength && errors.push("Full Name max length is 50");
      return errors;
    },
    usernameErrors() {
      const errors = [];
      if (!this.$v.form.username.$dirty) return errors;
      !this.$v.form.username.required && errors.push("Username is required");
      !this.$v.form.username.email && errors.push("E-Mail is invalid");
      !this.$v.form.username.minLength && errors.push("Username minimum length is 4");
      !this.$v.form.username.maxLength && errors.push("Username max length is 50");
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.form.password.$dirty) return errors;
      !this.$v.form.password.required && errors.push("Password is required");
      !this.$v.form.password.minLength && errors.push("Password minimum length is 6");
      !this.$v.form.password.maxLength && errors.push("Password minimum length is 60");
      !this.$v.form.confirm_password.sameAsPassword &&
        errors.push("Password must same as Confirm Password");
      return errors;
    },
    confirmPasswordErrors() {
      const errors = [];
      if (!this.$v.form.confirm_password.$dirty) return errors;
      !this.$v.form.confirm_password.required &&
        errors.push("Confirm Password is required");
      !this.$v.form.confirm_password.sameAsPassword &&
        errors.push("Confirm Password must same as Password");
      return errors;
    },
  },
};
</script>
