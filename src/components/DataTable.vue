<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="rows"
      :loading="isLoading"
      loading-text="Loading... Please wait."
      class="elevation-1"
      hide-default-footer
      disable-pagination
      :show-expand="hasExpand"
      :singleExpand="false"
      :expanded.sync="expanded"
    >
      <template
        v-if="
          hasEdit ||
          hasUpload ||
          hasDelete ||
          hasPrint ||
          hasView ||
          hasChangePassword ||
          hasAdd ||
          hasAddress
        "
        v-slot:[`item.actions`]="{ item }"
      >
        <div v-if="hasPoStatus">
          <v-icon> </v-icon>
          <!-- hasAdd -->
          <v-icon
            color="secondary"
            v-if="hasAdd && item.status == 0 || item.status == 4"
            medium
            @click="$emit('add', item)"
          >
            mdi-plus
          </v-icon>
          <!-- hasAddress -->
          <v-icon
            color="secondary"
            v-if="hasAddress"
            medium
            @click="$emit('viewAddress', item)"
            class="mr-2"
          >
            mdi-map-marker
          </v-icon>
          <!-- hasCompany -->
          <v-icon
            color="secondary"
            v-if="hasCompany && !['data', 'admin'].includes(item.type.code)"
            medium
            @click="$emit('company', item)"
            class="mr-2"
          >
            mdi-office-building
          </v-icon>
          <v-icon color="grey" v-else-if="hasCompany" medium class="mr-2">
            mdi-office-building
          </v-icon>
          <!-- hasContact -->
          <v-icon
            color="secondary"
            v-if="hasContact"
            medium
            @click="$emit('viewContact', item)"
            class="mr-2"
          >
            mdi-card-account-phone
          </v-icon>
          <!-- hasView -->
          <v-icon
            color="secondary"
            v-if="hasView"
            medium
            class="mr-2 float-center"
            @click="$emit('view', item)"
          >
            mdi-file-eye
          </v-icon>
          <!-- hasPrint -->
          <v-icon
            color="secondary"
            v-if="hasPrint"
            medium
            class="mr-2"
            @click="$emit('print', item)"
          >
            mdi-printer
          </v-icon>
          <!-- hasEdit -->
          <v-icon
            color="secondary"
            v-if="hasEdit && item.status == 0 || item.status == 4"
            medium
            class="mr-2"
            @click="$emit('edit', item)"
          >
            mdi-pencil
          </v-icon>
          <!-- hasUpload -->
          <v-icon
            color="secondary"
            v-if="hasUpload && item.status == 0 || item.status == 4"
            medium
            class="mr-2"
            @click="$emit('upload', item)"
          >
            mdi-file-upload
          </v-icon>
          <!-- hasUser -->
          <v-icon
            color="secondary"
            v-if="hasUser"
            medium
            class="mr-2"
            @click="$emit('user', item)"
          >
            mdi-account-child
          </v-icon>
          <!-- hasChangePassword -->
          <v-icon
            color="secondary"
            v-if="hasChangePassword"
            medium
            class="mr-2"
            @click="$emit('changePassword', item)"
          >
            mdi-lock-alert
          </v-icon>
          <!-- hasDelete -->
          <v-icon
            color="error"
            v-if="hasDelete && item.status == 0 || item.status == 4"
            medium
            @click="$emit('delete', item)"
          >
            mdi-delete
          </v-icon>
        </div>
        <div v-else>
          <v-icon> </v-icon>
          <!-- hasAddress -->
          <v-icon
            color="secondary"
            v-if="hasAddress"
            medium
            @click="$emit('viewAddress', item)"
            class="mr-2"
          >
            mdi-map-marker
          </v-icon>
          <!-- hasCompany -->
          <v-icon
            color="secondary"
            v-if="hasCompany && !['data', 'admin'].includes(item.type.code)"
            medium
            @click="$emit('company', item)"
            class="mr-2"
          >
            mdi-office-building
          </v-icon>
          <v-icon color="grey" v-else-if="hasCompany" medium class="mr-2">
            mdi-office-building
          </v-icon>
          <!-- hasContact -->
          <v-icon
            color="secondary"
            v-if="hasContact"
            medium
            @click="$emit('viewContact', item)"
            class="mr-2"
          >
            mdi-card-account-phone
          </v-icon>
          <!-- hasView -->
          <v-icon
            color="secondary"
            v-if="hasView"
            medium
            class="mr-2 float-center"
            @click="$emit('view', item)"
          >
            mdi-file-eye
          </v-icon>
          <!-- hasPrint -->
          <v-icon
            color="secondary"
            v-if="hasPrint"
            medium
            class="mr-2"
            @click="$emit('print', item)"
          >
            mdi-printer
          </v-icon>
          <!-- hasEdit -->
          <v-icon
            color="secondary"
            v-if="hasEdit"
            medium
            class="mr-2"
            @click="$emit('edit', item)"
          >
            mdi-pencil
          </v-icon>
          <!-- hasUpload -->
          <v-icon
            color="secondary"
            v-if="hasUpload"
            medium
            class="mr-2"
            @click="$emit('upload', item)"
          >
            mdi-file-upload
          </v-icon>
          <!-- hasUser -->
          <v-icon
            color="secondary"
            v-if="hasUser"
            medium
            class="mr-2"
            @click="$emit('user', item)"
          >
            mdi-account-child
          </v-icon>
          <!-- hasChangePassword -->
          <v-icon
            color="secondary"
            v-if="hasChangePassword"
            medium
            class="mr-2"
            @click="$emit('changePassword', item)"
          >
            mdi-lock-alert
          </v-icon>
          <!-- hasDelete -->
          <v-icon color="error" v-if="hasDelete" medium @click="$emit('delete', item)">
            mdi-delete
          </v-icon>
          <!-- hasAdd -->
          <v-icon color="secondary" v-if="hasAdd" medium @click="$emit('add', item)">
            mdi-plus
          </v-icon>
        </div>
      </template>

      <template v-if="hasStatus" v-slot:[`item.is_active`]="{ item }">
        <v-icon> </v-icon>
        <!-- Activate -->
        <v-icon
          color="success"
          v-if="item.is_active == 1"
          medium
          @click="$emit('changeStatus', item)"
        >
          mdi-check-circle
        </v-icon>
        <!-- Deactivate -->
        <v-icon
          color="error"
          v-if="item.is_active == 0"
          medium
          @click="$emit('changeStatus', item)"
        >
          mdi-close-circle
        </v-icon>
      </template>

      <template v-if="hasPoStatus" v-slot:[`item.status`]="{ item }">
        <span v-if="item.status == 0"> Created </span>
        <span v-if="item.status == 1"> For Review </span>
        <span v-else-if="item.status == 2"> For Approval </span>
        <span v-else-if="item.status == 3"> Approved </span>
        <span v-else-if="item.status == 4"> Declined </span>
        <span v-else-if="item.status == 5"> Received </span>
        <span v-else-if="item.status == 6"> Cancelled </span>
      </template>

      <template v-if="hasOrder" v-slot:[`item.order`]="{ item }">
        <!-- hasOrder (UP)-->
        <span v-if="hasOrder">
          <span
            v-if="
              hasOrder &&
              rows
                .map(function (x) {
                  return x.id;
                })
                .indexOf(item.id) != 0
            "
          >
            <v-icon medium @click="$emit('orderup', item)"> mdi-arrow-up-box </v-icon>
          </span>
          <span v-else class="mr-7"></span>
          <!-- hasOrder (DOWN) -->
          <span
            v-if="
              hasOrder &&
              rows
                .map(function (x) {
                  return x.id;
                })
                .indexOf(item.id) !=
                rows.length - 1
            "
          >
            <v-icon medium @click="$emit('orderdown', item)"> mdi-arrow-down-box </v-icon>
          </span>
          <span v-else class="ml-7"></span>
        </span>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">{{ item.remarks }}</td>
      </template>
    </v-data-table>
    <v-row class="justify-center align-center">
      <v-col>
        <v-pagination
          v-model="pagination.current_page"
          :length="pagination.last_page"
          @input="onPageChange"
        ></v-pagination>
      </v-col>
      <v-col sm="2">
        <v-btn
          v-if="hasDownloadExcel"
          :loading="isLoading"
          :disabled="isLoading"
          @click.prevent="downloadExcel"
          color="secondary"
        >
          <v-icon left dark>mdi-cloud-download</v-icon>
          {{ downloadLabel }}
        </v-btn>
        <downloadexcel
          v-if="hasVueJsonExcel"
          class="v-btn v-btn--has-bg theme--light v-size--large primary mt-2"
          style="cursor: pointer"
          pointer
          :fetch="fetchExcelData"
          :loading="isLoading"
          :disabled="isLoading"
          type="csv"
          :name="downloadFileName + '.xls'"
        >
          {{ downloadLabel }}
        </downloadexcel>
      </v-col>
      <v-spacer></v-spacer>
      <v-col sm="3" class="text-right float-center">
        {{ pagination.first_item }}
        to {{ pagination.last_item }} of
        {{ pagination.total }}
      </v-col>
    </v-row>

    <alert-box
      :show="alert.show"
      :title="alert.title"
      :message="alert.message"
      @close="alert.show = false"
    />
  </div>
</template>

<script>
import downloadexcel from "vue-json-excel";
import AlertBox from "./AlertBox.vue";
export default {
  name: "data-table",
  components: { downloadexcel, AlertBox },
  props: {
    path: {
      type: String,
      required: true,
      default: "",
    },
    hasStatus: {
      type: Boolean,
      required: false,
      default: false,
    },
    hasPoStatus: {
      type: Boolean,
      required: false,
      default: false,
    },
    hasExpand: {
      type: Boolean,
      required: false,
      default: false,
    },
    hasExpandText: {
      type: String,
      required: false,
      default: "",
    },
    hasOrder: {
      type: Boolean,
      required: false,
      default: false,
    },
    hasEdit: {
      type: Boolean,
      required: false,
      default: false,
    },
    hasUpload: {
      type: Boolean,
      required: false,
      default: false,
    },
    hasDelete: {
      type: Boolean,
      required: false,
      default: false,
    },
    hasUser: {
      type: Boolean,
      required: false,
      default: false,
    },
    hasChangePassword: {
      type: Boolean,
      required: false,
      default: false,
    },
    hasPrint: {
      type: Boolean,
      required: false,
      default: false,
    },
    hasView: {
      type: Boolean,
      required: false,
      default: false,
    },
    hasAdd: {
      type: Boolean,
      required: false,
      default: false,
    },
    hasDownloadExcel: {
      type: Boolean,
      required: false,
      default: false,
    },
    hasAddress: {
      type: Boolean,
      required: false,
      default: false,
    },
    hasContact: {
      type: Boolean,
      required: false,
      default: false,
    },
    hasCompany: {
      type: Boolean,
      required: false,
      default: false,
    },
    hasDeactivate: {
      type: Boolean,
      required: false,
      default: false,
    },
    downloadPath: {
      type: String,
      required: false,
      default: "",
    },
    downloadLabel: {
      type: String,
      required: false,
      default: "Download",
    },
    downloadFileName: {
      type: String,
      required: false,
      default: "report",
    },
    hasVueJsonExcel: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data: () => ({
    dialog: false,
    pagination: {
      current_page: 1,
      total: 0,
    },
    headers: [],
    rows: [],
    parameters: [],
    expanded: [],
    isLoading: false,
    alert: {
      show: false,
      title: "Notification",
      message: "Error Loading Data",
    },
  }),
  methods: {
    async fetchExcelData() {
      var requestUrl = "";
      if (this.path.includes("?")) {
        requestUrl = this.path + "&isexcel=1" + this.parameters;
      } else {
        requestUrl = this.path + "?isexcel=1" + this.parameters;
      }
      const response = await this.$axios.get(requestUrl);
      return response.data.response.data;
    },
    /** For General Use. */
    setParameters(param) {
      this.pagination.current_page = 1;
      this.parameters = "";
      if (Object.keys(param).length === 0) {
        this.parameters = "";
      } else {
        for (const key of Object.keys(param)) {
          this.parameters += "&" + key + "=" + param[key];
        }
      }
    },
    /** Generate Table Data Functions */
    generate() {
      this.isLoading = true;
      this.rows = [];
      var requestUrl = this.$api;
      if (this.path.includes("?")) {
        requestUrl +=
          this.path + "&page=" + this.pagination.current_page + this.parameters;
      } else {
        requestUrl +=
          this.path + "?page=" + this.pagination.current_page + this.parameters;
      }
      this.$http
        .get(requestUrl)
        .then((response) => {
          this.headers = response.data.response.headers;
          this.rows = response.data.response.data;
          this.pagination = response.data.response.pagination;
          this.isLoading = false;
        })
        .catch(() => {
          this.alert.show = true;
          this.isLoading = false;
        });
    },
    onPageChange() {
      this.generate();
    },
    /** For Download Excel Functions */
    downloadExcel() {
      this.isLoading = true;
      var requestUrl = "";
      if (this.path.includes("?")) {
        requestUrl =
          this.$api +
          this.downloadPath +
          "&filename=" +
          this.downloadFileName +
          this.parameters;
      } else {
        requestUrl =
          this.$api +
          this.downloadPath +
          "?filename=" +
          this.downloadFileName +
          this.parameters;
      }
      this.$axios
        .get(requestUrl)
        .then((response) => {
          let filePath = "/" + response.data.response.url;
          this.hotDownload(filePath);
        })
        .catch(() => {
          alert("Something Went Wrong. Please Contact the Administrator.");
          this.isloading = false;
        });
    },
    hotDownload(url) {
      this.$axios({
        url: url,
        method: "GET",
        responseType: "blob", // important
      })
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("target", "_blank");
          link.setAttribute("download", this.fileName + ".xlsx");
          document.body.appendChild(link);
          this.isLoading = false;
          this.$nextTick(function () {
            link.click();
          });
        })
        .catch(() => {
          alert("Something Went Wrong. Please Contact the Administrator.");
          this.isLoading = false;
        });
    },
  },
};
</script>
<style lang="scss">
.theme--light.v-pagination .v-pagination__item--active {
  color: #00b4ee;
}
.v-pagination {
  justify-content: left !important;
  .v-pagination__item--active {
    color: #00b4ee;
  }
}
</style>
