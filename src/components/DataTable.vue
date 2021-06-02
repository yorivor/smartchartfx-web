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
          hasDelete ||
          hasPrint ||
          hasView ||
          hasChangePassword ||
          hasTask ||
          hasAdd ||
          hasTaskMangement ||
          hasOrder ||
          hasModule ||
          hasField ||
          hasAddress
        "
        v-slot:[`item.actions`]="{ item }"
      >
        <!-- v-slot:item.actions="{ item }" -->
        
        <!-- hasAddress (Stop) -->
        <v-icon
          v-if="hasAddress"
          medium
          @click="$emit('viewAddress', item)"
          class="mr-2" 
        >
          mdi-map-marker
        </v-icon>
        <!-- hasField -->
        <v-icon v-if="hasField" medium @click="$emit('field', item)">
          mdi-focus-field-vertical &nbsp;
        </v-icon>
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
            <v-icon medium @click="$emit('orderup', item)">
              mdi-arrow-up-box &nbsp;
            </v-icon>
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
            <v-icon medium @click="$emit('orderdown', item)">
              mdi-arrow-down-box &nbsp;
            </v-icon>
          </span>
          <span v-else class="ml-7"></span>
        </span>
        <!-- hasModuleManagement -->
        <v-icon v-if="hasModule" medium @click="$emit('module', item)">
          mdi-account-settings &nbsp;
        </v-icon>
        <!-- hasView -->
        <v-icon
          v-if="hasView"
          medium
          class="mr-2 float-center"
          @click="$emit('view', item)"
        >
          mdi-file-eye &nbsp;
        </v-icon>
        <!-- hasPrint -->
        <v-icon v-if="hasPrint" medium class="mr-2" @click="$emit('print', item)">
          mdi-printer &nbsp;
        </v-icon>
        <!-- hasEdit -->
        <v-icon v-if="hasEdit" medium class="mr-2" @click="$emit('edit', item)">
          mdi-pencil &nbsp;
        </v-icon>
        <!-- hasUser -->
        <v-icon v-if="hasUser" medium class="mr-2" @click="$emit('user', item)">
          mdi-account-child &nbsp;
        </v-icon>
        <!-- hasTask -->
        <v-icon v-if="hasTask" medium class="mr-2" @click="$emit('task', item)">
          mdi-account-clock &nbsp;
        </v-icon>
        <!-- hasChangePassword -->
        <v-icon
          v-if="hasChangePassword"
          medium
          class="mr-2"
          @click="$emit('changePassword', item)"
        >
          mdi-lock-alert &nbsp;
        </v-icon>
        <!-- hasDelete -->
        <v-icon v-if="hasDelete" medium @click="$emit('delete', item)">
          mdi-delete &nbsp;
        </v-icon>
        <!-- hasAdd -->
        <v-icon v-if="hasAdd" medium @click="$emit('add', item)">
          mdi-playlist-plus &nbsp;
        </v-icon>
        <!-- hasTaskMangement (Pause) -->
        <v-icon
          v-if="hasTaskMangement && item.status == 2"
          medium
          @click="$emit('taskPause', item)"
        >
          mdi-pause &nbsp;
        </v-icon>
        <!-- hasTaskMangement (Start)-->
        <v-icon
          v-if="hasTaskMangement && (item.status == 0 || item.status == 3)"
          medium
          @click="$emit('taskStart', item)"
        >
          mdi-play &nbsp;
        </v-icon>
        <!-- hasTaskMangement (Stop) -->
        <v-icon
          v-if="hasTaskMangement && item.status == 2"
          medium
          @click="$emit('taskStop', item)"
        >
          mdi-stop &nbsp;
        </v-icon>
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
  </div>
</template>

<script>
import downloadexcel from "vue-json-excel";
export default {
  name: "data-table",
  components: { downloadexcel },
  props: {
    path: {
      type: String,
      required: true,
      default: "",
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
    hasTask: {
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
    hasModule: {
      type: Boolean,
      required: false,
      default: false,
    },
    hasTaskMangement: {
      type: Boolean,
      required: false,
      default: false,
    },
    hasDownloadExcel: {
      type: Boolean,
      required: false,
      default: false,
    },
    hasField: {
      type: Boolean,
      required: false,
      default: false,
    },
    hasAddress: {
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
          alert("Loading Error Data.");
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
