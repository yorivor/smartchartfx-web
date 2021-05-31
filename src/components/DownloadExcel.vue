<template>
  <div>
    <a v-if="!loading" :class="className" href="#" @click.prevent="downloadExcel" v-html="label"></a>
    <span v-else>
      <img src="/bars.svg" style="height: 10px" /> Please Wait.
    </span>
  </div>
</template>
<script>
export default {
  name: "download-excel",
  props: {
    path: {
      type: String,
      required: true,
      default: ""
    },
    label: {
      type: String,
      required: false,
      default: "Download to Excel"
    },
    className: {
      type: String,
      required: false,
      default: ""
    },
    fileName: {
      type: String,
      required: false,
      default: "report"
    }
  },
  data: function() {
    return {
      loading: false,
      filters: {}
    };
  },
  methods: {
    setParameters(parameters) {
      this.filters = parameters;
    },
    downloadExcel() {
      this.loading = true;
      let parameters = "";
      let param = this.filters;
      if (Object.keys(param).length == 0) {
        if(this.path.includes("?")){
          parameters = "&filename=" + this.fileName;
        } else {
          parameters = "?filename=" + this.fileName;
        }
      } else {
        for (const key of Object.keys(param)) {
          if (parameters.includes("?")) {
            parameters += "&" + key + "=" + param[key];
          } else {
            parameters += "?" + key + "=" + param[key];
          }
        }
        if (parameters.includes("?")) {
          parameters += "&filename=" + this.fileName;
        } else {
          parameters += "?filename=" + this.fileName;
        }
      }
      this.$http
        .get(process.env.VUE_APP_API_BASE_URL + this.path + parameters)
        .then(response => {
          let downloadPath = process.env.VUE_APP_API_BASE_URL + "/" + response.data.response.url;
          this.hotDownload(downloadPath);
        })
        .catch(() => {
          alert("Something Went Wrong. Please Contact the Administrator.");
          this.loading = false;
        });
    },
    hotDownload(url) {
      this.$http({
        url: url,
        method: "GET",
        responseType: "blob" // important
      })
        .then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("target", "_blank");
          link.setAttribute("download", this.fileName + ".xlsx");
          document.body.appendChild(link);
          this.loading = false;
          this.$nextTick(function() {
            link.click();
          });
        })
        .catch(() => {
          alert("Something Went Wrong. Please Contact the Administrator.");
          this.loading = false;
        });
    }
  }
};
</script>