<template>
  <div>
    <div v-if="showModal">
      <div class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="storyModal">{{ eventname }}</h5>
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
                <!-- Club -->
                <div class="form-group row">
                  <label for="club" class="col-sm-4 col-form-label text-right">Club</label>
                  <div class="col-sm-8">
                    <input
                      type="text"
                      class="form-control"
                      id="club"
                      v-model="club"
                      :disabled="disableFields"
                    >
                  </div>
                </div>
                <!-- Description -->
                <div class="form-group row">
                  <label for="description" class="col-sm-4 col-form-label text-right">Description:</label>
                  <div class="col-sm-8">
                    <textarea
                      class="form-control"
                      id="description"
                      v-model="description"
                      :disabled="disableFields"
                    ></textarea>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Autocomplete from "../../components/Autocomplete.vue";
export default {
  name: "tools",
  components: { Autocomplete },
  data: function() {
    return {
      baseUrl: process.env.VUE_APP_API_BASE_URL,
      disableFields: true,
      disableTin: true,
      showModal: false,
      event: "",
      showAlert: false,
      alertClass: "alert alert-danger",
      alertMessage: "",
      eventname: "",
      totime: "",
      fromtime: "",
      description: "",
      eventid: "",
      messageShow: false,
      messageClass: "alert alert-danger",
      messageText: "",
      showRemoveBox: false
    };
  },
  methods: {
    submitDeleteEvent() {
       this.showRemoveBox = true;
    },
    open(info) {
      this.event = info;
      this.eventname = info.event.title;
      this.totime = info.event.end;
      this.fromtime = info.event.start;
      this.eventid = info.event.id;
      if (info.event.extendedProps[0]) {
        this.description = info.event.extendedProps[0].description;
        this.club = info.event.extendedProps[0].club;
      }

      this.showModal = true;
      this.showAlert = false;
    }
  },
  mounted() {},
  computed: {
    isLoggedIn: function() {
      return this.$store.getters.isLoggedIn;
    },
    isAdmin: function() {
      return this.$store.getters.isAdmin;
    },
    isCaptain: function() {
      return this.$store.getters.isCaptain;
    }
  }
};
</script>