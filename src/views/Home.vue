<template>
  <v-app>
    <v-container>
      <h1>Contact List</h1>
      <v-row>
        <v-col class="text-right" cols="12">
          <v-btn @click="showCreate" depressed large light-blue darken-4>
            Create Contact
          </v-btn>
        </v-col>
      </v-row>
      <v-alert v-if="alertTwo.show" cols="12" :type="alertTwo.type">
        <span v-html="alertTwo.message"></span>
      </v-alert>
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">
                Name
              </th>
              <th class="text-left">
              Address
              </th>
              <th class="text-left">
              Phone Number
              </th>
              <th class="text-left">
              Facebook Username
              </th>
              <th class="text-left">
              Action
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="list in contactList" :key="list.id">
              <td>{{ list.name }}</td>
              <td>{{ list.address }}</td>
              <td>{{ list.phone_number }}</td>
              <td>{{ list.fb_username }}</td>
              <td>
                <v-icon
                 @click="getContact(list.id)" 
                >
                  mdi-pencil-outline
                </v-icon>
                <v-icon
                 @click="deleteContact(list.id)" 
                >
                  mdi-delete
                </v-icon>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <v-dialog
        v-model="showModal"
        persistent
        transition="dialog-top-transition"
      >
        <template>
          <v-card>
            <v-toolbar color="primary">Create Contact</v-toolbar>
            <v-container>
              <v-alert v-if="alert.show" cols="12" :type="alert.type">
                <span v-html="alert.message"></span>
              </v-alert>
              <v-form @submit.prevent="submit(type)">
                <v-text-field
                  v-model="form.name"
                  label="Name"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="form.address"
                  label="Address"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="form.phone_number"
                  label="Phone Number"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="form.fb_username"
                  label="Facebook Username"
                ></v-text-field>
                <v-row class="text-right">
                  <v-col cols="12">
                    <v-btn class="my-3 mx-3" type="submit" color="primary"> Submit </v-btn>
                    <v-btn class="my-3 mx-3" color="error" @click="showModal = false">
                      Close
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-container>
          </v-card>
        </template>
      </v-dialog>
    </v-container>
  </v-app>
</template>

<script>

export default {
  name: "home",
  data: () => ({
    usedKey: 0,
    showModal: false,
    contactList: [],
    type: 'Create',
    alert: {
      show: false,
      message: "",
      type: "error",
    },
    alertTwo: {
      show: false,
      message: "",
      type: "error",
    },
    form: {
      name: "",
      address: "",
      phone_number: "",
      fb_username: "",
    }
  }),
  methods: {
    showCreate() {
      this.showModal = true;
      this.form = {
        name: "",
        address: "",
        phone_number: "",
        fb_username: "",
      };
      this.alert = {
        show: false,
      };
    },
    getContactList() {
        this.$http.get(this.$api + "/").then((response) => {
        this.contactList = response.data.data;
      });
    },
    getContact(id) {
      this.showModal = true;
      this.type = 'Update';
      this.usedKey = id;
      this.alert = {
        show: false,
      };
      this.$http
        .get(this.$api + "/contact/" + id)
        .then((response) => {
          this.form.name = response.data.information.name;
          this.form.address = response.data.information.address;
          this.form.phone_number = response.data.information.phone_number;
          this.form.fb_username = response.data.information.fb_username;
        });
    },
    submit() {
      var url = ''
      var data = {}
      switch (this.type) {
        case 'Create' :
          url = this.$api + '/add'
          data = {
            name: this.form.name,
            address: this.form.address,
            phone_number: this.form.phone_number,
            fb_username: this.form.fb_username,
          }
        break;
        case 'Update' :
          url = this.$api + '/contact/update/' + this.usedKey
          data = {
            name: this.form.name,
            address: this.form.address,
            phone_number: this.form.phone_number,
            fb_username: this.form.fb_username,
            _method: 'PUT',
          }
          break;
      }
      this.$http
        .post(url, data)
        .then((success) => {
          if(this.type == 'Create') {
            this.form = {
              name: "",
              address: "",
              phone_number: "",
              fb_username: "",
            };
          }
          this.alert = {
            show: true,
            type: "success",
            message: success.data.message,
          };
          this.getContactList();
        })
        .catch((error) => {
          let msg = "";
          if (error.response.data.message) {
            msg = error.response.data.message;
          } else {
            msg = "Something went wrong. Please contact the administrator";
          }
          this.alert = {
            show: true,
            type: "error",
            message: msg,
          };
        });
    },
    deleteContact(id) {
      this.$http
        .delete(this.$api + "/contact/delete/" + id)
        .then((response) => {
          this.getContactList();
          this.alertTwo = {
            show: true,
            type: "success",
            message: response.data.message,
          };
        })
        .catch((error) => {
          let msg = "";
          if (error.response.data.message) {
            msg = error.response.data.message;
          } else {
            msg = "Something went wrong. Please contact the administrator";
          }
          this.alertTwo = {
            show: true,
            type: "error",
            message: msg,
          };
        });
    }
  },
  mounted() {
    this.getContactList();
  }
};
</script>
