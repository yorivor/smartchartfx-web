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
            <span v-html="item.po_number + ': ' + item.vendor.name"></span>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="showModal = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-container>
          <v-list three-line subheader>
            <v-subheader><h1>Purchase Order Details</h1></v-subheader>
            <v-list-item>
              <v-list-item-content>
                <v-row>
                  <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6">
                    <v-list-item-subtitle> Date </v-list-item-subtitle>
                    <v-list-item-title>
                      {{ new Date(item.created_at).toJSON().slice(0, 10) }}
                    </v-list-item-title>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6">
                    <v-list-item-subtitle> Purchase Order Number </v-list-item-subtitle>
                    <v-list-item-title>{{ item.po_number }}</v-list-item-title>
                  </v-col>
                </v-row>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-list three-line subheader>
            <v-list-item>
              <v-list-item-content>
                <v-row>
                  <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6">
                    <v-list-item-title class="mb-2"><h3>Vendor</h3></v-list-item-title>
                    <v-list-item-subtitle class="mb-1">
                      <b>Name: </b> {{ item.vendor.name }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle class="mb-1">
                      <b>Address: </b> {{ item.vendor.address }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle class="mb-1">
                      <b>E-Mail: </b> {{ item.vendor.email }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle class="mb-1">
                      <b>Contact Person: </b> {{ item.vendor.contact_person }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle class="mb-1">
                      <b>Contact Number: </b> {{ item.vendor.contact_number }}
                    </v-list-item-subtitle>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6">
                    <v-list-item-title class="mb-2"><h3>Company</h3></v-list-item-title>
                    <v-list-item-subtitle class="mb-1">
                      <b>Name: </b> {{ item.company.name }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle class="mb-1">
                      <b>Address: </b> {{ item.company_address.name }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle class="mb-1">
                      <b>E-Mail: </b> {{ item.company_contact.email }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle class="mb-1">
                      <b>Contact Name: </b> {{ item.company_contact.name }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle class="mb-1">
                      <b>Mobile: </b> {{ item.company_contact.mobile_number }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle
                      v-if="item.company_contact.phone_number != ''"
                      class="mb-1"
                    >
                      <b>Phone: </b> {{ item.company_contact.phone_number }}
                    </v-list-item-subtitle>
                  </v-col>
                </v-row>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <v-list three-line subheader>
            <v-list-item>
              <v-list-item-content>
                <v-row>
                  <v-col cols="12" xs="12" sm="12" md="4" lg="4" xl="4">
                    <v-list-item-subtitle> Requisitioner </v-list-item-subtitle>
                    <v-list-item-title>{{ item.requisitioner }}</v-list-item-title>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="4" lg="4" xl="4">
                    <v-list-item-subtitle> Payment Terms </v-list-item-subtitle>
                    <v-list-item-title>{{ item.payment_terms }}</v-list-item-title>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="4" lg="4" xl="4">
                    <v-list-item-subtitle> Shipping Terms </v-list-item-subtitle>
                    <v-list-item-title>{{ item.shipping_terms }}</v-list-item-title>
                  </v-col>
                </v-row>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <v-list three-line subheader>
            <v-list-item>
              <v-list-item-content>
                <v-simple-table>
                  <thead>
                    <tr>
                      <th>Item #</th>
                      <th>Logo</th>
                      <th>Description</th>
                      <th>Qty</th>
                      <th>Unit</th>
                      <th>Unit Price</th>
                      <th>TOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, index) in items" :key="index">
                      <td v-html="row.item_no"></td>
                      <td><img class="img-size" :src="row.image" /></td>
                      <td v-html="row.description"></td>
                      <td v-html="row.quantity"></td>
                      <td v-html="row.unit || 'pcs'"></td>
                      <td class="text-right" v-html="row.unit_price"></td>
                      <td class="text-right" v-html="row.unit_price"></td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <v-list three-line subheader>
            <v-list-item>
              <v-list-item-content>
                <v-row>
                  <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6">
                    <v-list-item-subtitle>
                      Other Comments or Special Instructions
                    </v-list-item-subtitle>
                    <v-list-item-title>
                      {{ item.comments }}
                    </v-list-item-title>
                  </v-col>
                  <v-col
                    cols="12"
                    xs="12"
                    sm="12"
                    md="4"
                    lg="4"
                    xl="4"
                    offset-md="2"
                    offset-lg="2"
                    offset-xl="2"
                  >
                    <v-simple-table>
                      <thead></thead>
                      <tbody>
                        <tr>
                          <td>Subtotal</td>
                          <td class="text-right">P {{ item.subtotal || "" }}</td>
                        </tr>
                        <tr>
                          <td>Tax Rate</td>
                          <td class="text-right">P {{ item.tax_rate || "" }}</td>
                        </tr>
                        <tr>
                          <td>VAT</td>
                          <td class="text-right">P {{ item.vat_rate }}</td>
                        </tr>
                        <tr>
                          <td>S & H</td>
                          <td class="text-right">P {{ item.s_and_h }}</td>
                        </tr>
                        <tr>
                          <td>OTHER</td>
                          <td class="text-right">P {{ item.others }}</td>
                        </tr>
                        <tr>
                          <td>TOTAL</td>
                          <td class="text-right">P {{ item.total || "" }}</td>
                        </tr>
                      </tbody>
                    </v-simple-table>
                  </v-col>
                </v-row>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-divider v-if="uploads.length > 0"></v-divider>
          <v-list v-if="uploads.length > 0" three-line subheader>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Documents</v-list-item-title>
                <v-row>
                  <template v-for="(upload, uploadKey) in uploads">
                    <v-col :key="uploadKey" cols="3">
                      <a
                        :style="{color: isDarkTheme ? '#ffe800 ' : '#000'}"
                        :href="$api + uploadPath + upload.file"
                        :download="upload.file"
                        target="_blank"
                        v-html="upload.file"
                      >
                      </a>
                    </v-col>
                  </template>
                </v-row>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <v-list v-if="this.userType != 'preparer'" three-line subheader>
            <v-list-item>
              <v-list-item-content>
                <v-row>
                  <v-col cols="12" xs="12" sm="6" md="6" lg="4" xl="4">
                    <v-textarea
                      v-model="remark.content"
                      rows="6"
                      counter="350"
                      label="Remarks"
                      @input="$v.remark.content.$touch()"
                      @blur="$v.remark.content.$touch()"
                      :error-messages="remarksErrors"
                      outlined
                      dense
                      auto-grow
                    >
                    </v-textarea>
                  </v-col>
                  <v-col cols="12" xs="12" sm="6" md="4" lg="3" xl="3">
                    <v-btn class="mb-3" @click="addRemark" color="secondary" dense block>
                      Add Remark &nbsp; <v-icon> mdi-plus </v-icon>
                    </v-btn>
                    <v-btn
                      v-if="showButtons"
                      class="mb-3"
                      @click="showConfirm('approve')"
                      color="primary"
                      dense
                      block
                    >
                      Approve &nbsp; <v-icon> mdi-check </v-icon>
                    </v-btn>
                    <v-btn
                      v-if="showButtons"
                      class="mb-3"
                      @click="showConfirm('reject')"
                      color="error"
                      dense
                      block
                    >
                      Reject &nbsp; <v-icon> mdi-close </v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
                <template v-for="(remark, remarkKey) in remarks">
                  <v-list-item :key="remarkKey">
                    <v-list-item-content>
                      <v-list-item-title
                        v-text="remark.user.fullname"
                      ></v-list-item-title>
                      <v-list-item-subtitle
                        class="text--primary"
                        v-html="' &mdash; ' + remark.content"
                      ></v-list-item-subtitle>
                      <v-list-item-subtitle>
                        Date: {{ new Date(remark.created_at) }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider
                    :key="remark.id + '_divider'"
                    v-if="remarkKey < remarks.length - 1"
                  >
                  </v-divider>
                </template>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-container>
      </v-card>
    </template>
    <confirm-box
      :show="confirm.show"
      :message="confirm.message"
      @yes="submit"
      @no="confirm.show = false"
    />
    <alert-box
      :show="alert.show"
      :title="alert.title"
      :message="alert.message"
      @close="alert.show = false"
    />
    <loading :is-loading="isLoading" />
  </v-dialog>
</template>

<script>
import DataTable from "../DataTable.vue";
import ConfirmBox from "../ConfirmBox.vue";
import AlertBox from "../AlertBox.vue";
import Loading from "../Loading.vue";
import { validationMixin } from "vuelidate";
import { required, minLength, maxLength } from "vuelidate/lib/validators";
export default {
  name: "purchase-order-view",
  components: { DataTable, ConfirmBox, AlertBox, Loading },
  mixins: [validationMixin],
  props: {
    show: {
      type: Boolean,
      required: true,
      default: false,
    },
    item: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
  validations: {
    remark: {
      content: {
        required,
        minLength: minLength(2),
        maxLength: maxLength(550),
      },
    },
  },
  data: () => ({
    isLoading: false,
    showModal: false,
    showButtons: false,
    deactivateMessage: "",
    params: { search: "" },
    actionTaken: "",
    alert: {
      show: false,
      title: "Notification",
      message: "Sample alert",
    },
    form: { id: "", company_id: "", code: "", name: "" },
    remark: { content: "" },
    items: [],
    uploads: [],
    remarks: [],
    confirm: {
      message: "",
      show: false,
    },
    uploadPath: process.env.VUE_APP_API_UPLOAD_PATH,
  }),
  methods: {
    showConfirm(action) {
      this.actionTaken = action;
      this.confirm.message = "Are you sure you want to ";
      this.confirm.message += action + " this Purchase Order ";
      this.confirm.message += this.item.po_number;
      this.confirm.message += "?";
      this.confirm.show = true;
    },
    hotReloadRemarks() {
      this.isLoading = true;
      let url =
        this.$api + "/" + this.userType + "/purchase-orders/" + this.item.id + "/remarks";
      this.$http
        .get(url)
        .then((response) => {
          this.remarks = response.data.response;
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
    addRemark() {
      this.isLoading = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.isLoading = false;
      } else {
        let url =
          this.$api +
          "/" +
          this.userType +
          "/purchase-orders/" +
          this.item.id +
          "/remarks";
        this.$http
          .post(url, this.remark)
          .then((response) => {
            this.$emit("generateTable");
            this.hotReloadRemarks();
            this.$v.$reset();
            this.remark.content = "";
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
          })
          .finally(() => {
            this.isLoading = false;
          });
      }
    },
    submit() {
      this.isLoading = true;
      let url = this.$api + "/" + this.userType + "/purchase-orders/" + this.item.id;
      let data = {
        action: this.actionTaken,
        remark: this.remark.content,
      };
      this.$http
        .put(url, data)
        .then((response) => {
          this.isLoading = false;
          this.alert.show = true;
          this.alert.message = response.data.message;
          this.showButtons = false;
          this.remark.content = "";
          this.$emit("generateTable");
          this.hotReloadRemarks();
          this.$v.$reset();
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
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
  watch: {
    show: function () {
      if (this.show) {
        this.params.search = "";
        this.showModal = this.show;
        this.items = this.item.items;
        this.remarks = this.item.remarks;
        this.uploads = this.item.uploads;
        if (
          (this.item.status == 1 && this.isReviewer) ||
          (this.item.status == 2 && this.isApprover)
        ) {
          this.showButtons = true;
        } else {
          this.showButtons = false;
        }
      }
    },
    showModal: function () {
      if (!this.showModal) {
        this.items = [];
        this.remarks = [];
        this.uploads = [];
        this.$emit("close");
        this.$emit("generateTable");
      }
    },
  },
  computed: {
    remarksErrors() {
      const errors = [];
      if (!this.$v.remark.content.$dirty) return errors;
      !this.$v.remark.content.required && errors.push("Remarks is required");
      !this.$v.remark.content.minLength && errors.push("Remarks minimum length is 2");
      !this.$v.remark.content.maxLength && errors.push("Remarks max length is 350");
      return errors;
    },
    isPrepearer: function () {
      return this.$store.getters.isPrepearer;
    },
    isReviewer: function () {
      return this.$store.getters.isReviewer;
    },
    isApprover: function () {
      return this.$store.getters.isApprover;
    },
    userType: function () {
      return this.$store.getters.userType;
    },
    isDarkTheme: function () {
      return this.$store.getters.isDarkTheme;
    },
  },
};
</script>
<style scoped>
.v-list-item__title {
  white-space: normal;
}
.img-size {
  width:10%;
}
</style>
