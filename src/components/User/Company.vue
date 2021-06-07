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
            <span v-html="'User Companies for ' + item.fullname"></span>
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
                <v-btn @click="showAdd = true" depressed large color="primary">
                  Add Company
                </v-btn>
              </div>
            </v-col>
          </v-row>
          <data-table
            ref="userCompanies"
            :hasDelete="true"
            :hasStatus="true"
            @delete="deactivate"
            @changeStatus="changeStatus"
            :path="'/admin/users/' + item.id + '/companies'"
          />
          <v-dialog v-model="showAdd" transition="dialog-top-transition" :width="width">
            <template>
              <v-card>
                <v-toolbar color="primary">
                  <v-toolbar-title>
                    <span v-html="'Add Companies for ' + item.fullname"></span>
                  </v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn icon @click="showAdd = false">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-toolbar>
                <v-container>
                  <v-row>
                    <v-col class="text-left my-3" xs="12" sm="12" md="6" lg="6" xl="6">
                      <v-text-field
                        v-model="addparams.search"
                        label="Search"
                        dense
                        outlined
                        hide-details
                        @change="generateAddTable"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <data-table
                    ref="addUserCompanies"
                    :hasAdd="true"
                    @add="add"
                    :path="'/admin/users/' + item.id + '/companies'"
                /></v-container>
              </v-card>
            </template>
          </v-dialog>
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
import DataTable from "../DataTable.vue";
import ConfirmBox from "../ConfirmBox.vue";
import AlertBox from "../AlertBox.vue";

export default {
  name: "user-company",
  components: { DataTable, ConfirmBox, AlertBox },
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
    usedKey: "",
    showModal: false,
    showAdd: false,
    showEdit: false,
    showDeactivate: false,
    deactivateMessage: "",
    params: { search: "" },
    addparams: { list: 0, search: "" },
    alert: {
      show: false,
      title: "Notification",
      message: "Sample alert",
    },
    form: { id: "", company_id: "", code: "", name: "" },
  }),
  methods: {
    add(item) {
      this.isLoading = true;
      let url = this.$api + "/admin/users/" + this.item.id + "/companies/" + item.id;
      this.$http
        .post(url)
        .then((response) => {
          this.generateAddTable();
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
        "/admin/users/" +
        this.item.id +
        "/companies/" +
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
      let url = this.$api + "/admin/users/" + this.item.id + "/companies/" + this.usedKey;
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
          this.$refs.userCompanies.setParameters(this.params);
          this.$refs.userCompanies.generate();
        });
      }
    },
    generateAddTable() {
      if (this.show) {
        this.$nextTick(() => {
          this.$refs.addUserCompanies.setParameters(this.addparams);
          this.$refs.addUserCompanies.generate();
        });
      }
    },
  },
  computed: {
    width() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return "95%";
        case "sm":
          return "85%";
        default:
          return "650";
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
    showAdd: function () {
      this.generateAddTable();
    },
  },
};
</script>
