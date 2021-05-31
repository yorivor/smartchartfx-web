<template>
  <div>
  <!-- Login Modal -->
  <div v-if="showLogin">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="storyModal">{{ modalTitle }}</h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
                @click="showLogin = false"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="form col-sm-12">
                  <div v-if="showMessage" class="alert alert-danger" role="alert">
                    {{ message }}
                    <button
                      type="button"
                      class="close"
                      data-dismiss="alert"
                      aria-label="Close"
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <form @submit.prevent="login">
                    <div class="form-group">
                      <input
                        class="form-control"
                        required
                        v-model="username"
                        type="text"
                        placeholder="Username"
                      >
                    </div>
                    <div v-if="showPassword" class="form-group">
                      <input
                        class="form-control"
                        required
                        v-model="password"
                        type="password"
                        placeholder="Password"
                        v-on:keyup.enter="login"
                      >
                    </div>
                    <p class="text-left">
                      <a class="forgot-style"
                        data-dismiss="modal"
                        @click="openForgot"
                      >Forgot Password?</a>
                    </p>
                    <p class="text-right">
                      <button type="button" class="btn btn-primary" @click="login">{{ buttonlabel }}</button>
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Forgot Modal -->
  <div v-if="showForgot">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="storyModal">Forgot Password</h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
                @click="showForgot = false"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="form col-sm-12">
                  <div v-if="showMessage" class="alert alert-danger" role="alert">
                    {{ message }}
                    <button
                      type="button"
                      class="close"
                      data-dismiss="alert"
                      aria-label="Close"
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <form @submit.prevent="submit">
                    <div class="form-group">
                      <input
                        class="form-control"
                        required
                        v-model="email"
                        type="text"
                        placeholder="Email Address"
                      >
                    </div>
                    <p class="text-right">
                      <button
                        type="button"
                        class="btn btn-primary text-right"
                        data-dismiss="modal"
                        @click="submit"
                      >Send</button>
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- End easygen Contact -->
    <div v-if="showMessageModal">
      <div class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="storyModal">Message</h5>
                <button
                  type="button"
                  class="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  @click="showMessageModal = false"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">{{ modalmessage }}</div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-dismiss="modal"
                  @click="showMessageModal = false"
                >Close</button>
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
  mounted() {
    // this.$store.dispatch("logout");
  },
  data() {
    return {
      showMessageModal: false,
      showLogin: false,
      showForgot: false,
      showMessage: false,
      username: "",
      password: "",
      email: "",
      message: "",
      modalmessage: "",
    };
  },
  methods: {
    closeMessage: function() {
      setTimeout(function() {
        this.showMessage = false;
      }, 3000);
    },
    openLogin: function() {
      this.buttonlabel = "Login";
      this.modalTitle = "Login";
      this.showPassword = true;
      this.showLogin = true;
    },
    openForgotPassword: function() {
      this.showLogin = false;
      this.modalTitle = "Forgot Password";
      this.buttonlabel = "Reset Password";
      this.showPassword = false;
      this.showLogin = true;
    },
    login: function() {
      let username = this.username;
      let password = this.password;
      this.$store
        .dispatch("loginteacher", { username, password })
        .then(() => {
          this.$router.push({ name: "usercourses" });
          this.username = "";
          this.password = "";
          this.message = "";
          this.showLogin = false;
        })
        .catch(err => {
          this.password = "";
          this.message = err.response.data.message;
          this.showMessage = true;
        });
    },
    openForgot: function() {
      this.showForgot = true;
      this.showLogin = false;
    },
    submit: function() {
      var url = "";
      var data = {};

      url = process.env.VUE_APP_API_BASE_URL + "/password";
      data = {
          email: this.email,
      };

      this.$http
      .post(url, data)
      .then(response => {
          this.modalmessage = response.data.message;
          this.showMessageModal = true;
          this.showForgot = false;
          this.email = "";
      })
      .catch(error => {
          this.modalmessage = error.response.data.message;
          this.showMessageModal = true;
      });
    }
  }
};
</script>
<style>
.forgot-style{
  color: #385b67;
  cursor: pointer;
}
</style>
