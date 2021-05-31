<template>
  <div>
    <div v-if="showModal">
      <div class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="storyModal">New Event</h5>
                <button
                  type="button"
                  class="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  @click="showModal = false"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <!-- Error Message Goes Here -->
                <div class="row">
                  <div class="col-sm-12">
                    <div v-if="showAlert" :class="alertClass" role="alert" v-html="alertMessage"></div>
                  </div>
                </div>
                <!-- Event Name -->
                <div class="form-group row">
                  <label for="eventname" class="col-sm-4 col-form-label text-right">Event Name</label>
                  <div class="col-sm-8">
                    <input
                      type="text"
                      class="form-control"
                      id="eventname"
                      v-model="eventname"
                    >
                  </div>
                </div>
                <!-- From -->
                <div class="form-group row">
                  <label for="fromtime" class="col-sm-4 col-form-label text-right">From</label>
                  <div class="col-sm-8">
                    <input
                      type="text"
                      class="form-control"
                      id="fromtime"
                      v-model="fromtime"
                      :disabled="disableFields"
                    >
                  </div>
                </div>
                <!-- To -->
                <div class="form-group row">
                  <label for="totime" class="col-sm-4 col-form-label text-right">To</label>
                  <div class="col-sm-8">
                    <input
                      type="text"
                      class="form-control"
                      id="totime"
                      v-model="totime"
                      :disabled="disableFields"
                    >
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-primary"
                  data-dismiss="modal"
                  @click="submitNewEvent"
                >Add New Event</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "tools",
  components: {},
  data: function() {
    return {
      baseUrl: process.env.VUE_APP_API_BASE_URL,
      disableFields: true,
      disableTin: true,
      showModal: false,
      CapacityRoom: false,
      eventname: "",
      totime: "",
      fromtime: "",
      reservationDate: new Date()
        .toJSON()
        .slice(0, 10)
        .replace(/-/g, "-"),
      minDate: new Date()
        .toJSON()
        .slice(0, 10)
        .replace(/-/g, "-"),
      showAlert: false,
      alertClass: "alert alert-danger",
      alertMessage: "",
    };
  },
  methods: {
    submitNewEvent() {
      let formData = {
        eventname: this.eventname,
        totime: this.totime,
        fromtime: this.fromtime
      };
      this.$http
        .post(this.baseUrl + "/admin/events", formData)
        .then(response => {
          this.alertMessage = response.data.message;
          this.alertClass = "alert alert-success";
          this.showAlert = true;
          this.eventname = "";
          this.totime = "";
          this.fromtime = "";
          this.$parent.fetchCalendar();
          this.showModal = false;
        })
        .catch(error => {
          this.alertMessage = error.response.data.message;
          this.alertClass = "alert alert-danger";
          this.showAlert = true;
        });
    },
    open(info) {
      this.fromtime = info.startStr;
      this.totime = info.endStr;
      this.showModal = true;
      this.showAlert = false;
    }
  },
  mounted() {
  }
};
</script>