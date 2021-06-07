<template>
  <v-container>
    <v-list-item-title class="headline mb-1">User Management</v-list-item-title>
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
        <v-btn class="my-3" @click="showAdd = true" depressed large color="primary">
          Create User
        </v-btn>
      </v-col>
    </v-row>
    <data-table
      ref="users"
      :hasEdit="true"
      @edit="edit"
      :hasChangePassword="true"
      @changePassword="changePassword"
      :hasDelete="true"
      @delete="deactivate"
      :hasStatus="true"
      @changeStatus="changeStatus"
      :path="'/admin/users'"
    />
    <user-add :show="showAdd" @close="showAdd = false" @generate-table="generateTable" />
    <user-edit
      :show="showEdit"
      :item="form"
      @close="showEdit = false"
      @generate-table="generateTable"
    />
    <user-reset-password
      :show="showResetPassword"
      :item="form"
      @close="showResetPassword = false"
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
import UserAdd from "../../components/User/Add.vue";
import UserEdit from "../../components/User/Edit.vue";
import UserResetPassword from "../../components/User/ResetPassword.vue";
import ConfirmBox from "../../components/ConfirmBox.vue";
import AlertBox from "../../components/AlertBox.vue";
export default {
  name: "users",
  components: {
    DataTable,
    UserAdd,
    UserEdit,
    UserResetPassword,
    ConfirmBox,
    AlertBox,
  },
  data: () => ({
    usedKey: "",
    showAdd: false,
    showEdit: false,
    showResetPassword: false,
    showDeactivate: false,
    deactivateMessage: "",
    alert: {
      show: false,
      title: "Notification",
      message: "Sample alert",
    },
    params: { search: "" },
    form: {},
  }),
  methods: {
    generateTable() {
      this.$refs.users.setParameters(this.params);
      this.$refs.users.generate();
    },
    edit(item) {
      this.form = item;
      this.showEdit = true;
    },
    changePassword(item) {
      this.form = item;
      this.showResetPassword = true;
    },
    deactivate(item) {
      this.usedKey = item.id;
      this.deactivateMessage = "Are you sure you want to deactivate ";
      this.deactivateMessage += item.fullname;
      this.deactivateMessage += "?";
      this.showDeactivate = true;
    },
    changeStatus(item) {
      let url = this.$api + "/admin/users/" + item.id + "/toggle-status";
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
      let url = this.$api + "/admin/users/" + this.usedKey;
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
