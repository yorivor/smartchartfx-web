<template>
  <v-container>
    <v-alert v-if="alert.show" :type="alert.type">{{ alert.message }}</v-alert>
    <v-list-item-title class="headline mb-1">Change Auto Fill Details</v-list-item-title>
    <form>
      <v-row v-if="alert.show">
        <v-col cols="12"> </v-col>
      </v-row>
      <v-row align="center">
        <!-- Full Name -->
        <v-col cols="12" sm="12" md="6" lg="5" xl="5">
          <v-text-field
            v-model="form.fullname"
            label="Full Name"
            @input="$v.form.fullname.$touch()"
            @blur="$v.form.fullname.$touch()"
            :error-messages="nameErrors"
            required
          ></v-text-field>
        </v-col>
        <!-- E-Mail -->
        <v-col cols="12" sm="12" md="6" lg="6" xl="6">
          <v-text-field
            v-model="form.email"
            label="E-Mail Address"
            type="mail"
            @input="$v.form.email.$touch()"
            @blur="$v.form.email.$touch()"
            :error-messages="emailErrors"
            required
          ></v-text-field>
        </v-col>
        <!-- Mobile Number -->
        <v-col cols="12" sm="6" md="3" lg="3" xl="3">
          <v-text-field
            v-model="form.mobile_number"
            label="Mobile Number"
            @input="$v.form.mobile_number.$touch()"
            @blur="$v.form.mobile_number.$touch()"
            :error-messages="mobileErrors"
            required
          ></v-text-field>
        </v-col>
        <!-- Age -->
        <v-col cols="12" sm="6" md="3" lg="2" xl="2">
          <v-text-field
            v-model="form.age"
            label="Age"
            @input="$v.form.age.$touch()"
            @blur="$v.form.age.$touch()"
            :error-messages="ageErrors"
            required
          ></v-text-field>
        </v-col>
        <!-- Gender -->
        <v-col cols="12" sm="6" md="3" lg="2" xl="2">
          <v-select
            v-model="form.gender"
            :items="genders"
            label="Gender"
            @input="$v.form.gender.$touch()"
            @blur="$v.form.gender.$touch()"
            :error-messages="genderErrors"
          ></v-select>
        </v-col>
        <!-- Employee Number -->
        <v-col cols="12" sm="6" md="3" lg="2" xl="2">
          <v-text-field
            label="Employee Number"
            v-model="form.employee_number"
            @input="$v.form.employee_number.$touch()"
            @blur="$v.form.employee_number.$touch()"
            :error-messages="employeeNumberErrors"
          ></v-text-field>
        </v-col>
        <!-- Status -->
        <v-col cols="12" sm="6" md="3" lg="2" xl="2">
          <v-select
            :items="statuses"
            label="Status"
            v-model="form.visitor_type"
            @input="$v.form.visitor_type.$touch()"
            @blur="$v.form.visitor_type.$touch()"
            :error-messages="statusErrors"
            required
          ></v-select>
        </v-col>
        <!-- Status Specify if Others is selected -->
        <v-col cols="12" sm="6" md="3" lg="2" xl="2">
          <v-text-field
            v-model="form.visitor_type_others"
            :disabled="form.visitor_type != 'Others'"
            label="Specify Status"
            @input="$v.form.visitor_type_others.$touch()"
            @blur="$v.form.visitor_type_others.$touch()"
            :error-messages="statusOthersErrors"
          ></v-text-field>
        </v-col>
        <!-- Department -->
        <v-col cols="12" sm="6" md="6" lg="4" xl="4">
          <v-select
            :items="departments"
            label="Department"
            v-model="form.department"
            @input="$v.form.department.$touch()"
            @blur="$v.form.department.$touch()"
            :error-messages="departmentErrors"
            required
          ></v-select>
        </v-col>
        <!-- Site -->
        <v-col cols="12" sm="6" md="2" lg="2" xl="2">
          <v-select
            :items="sites"
            label="Site"
            v-model="form.site"
            @input="$v.form.site.$touch()"
            @blur="$v.form.site.$touch()"
            :error-messages="siteErrors"
            required
          ></v-select>
        </v-col>
        <!-- Nature of Visit -->
        <v-col cols="12" sm="6" md="3" lg="2" xl="2">
          <v-select
            :items="purposes"
            label="Nature of Visit"
            v-model="form.nature_of_visit"
            @input="$v.form.nature_of_visit.$touch()"
            @blur="$v.form.nature_of_visit.$touch()"
            :error-messages="natureErrors"
            required
          ></v-select>
        </v-col>
        <!-- Nature of Visit Specify if Others is selected -->
        <v-col cols="12" sm="6" md="3" lg="2" xl="2">
          <v-text-field
            v-model="form.nature_of_visit_others"
            label="Specify Nature of Visit"
            :disabled="form.nature_of_visit != 'Others'"
            @input="$v.form.nature_of_visit_others.$touch()"
            @blur="$v.form.nature_of_visit_others.$touch()"
            :error-messages="natureOthersErrors"
          ></v-text-field>
        </v-col>
        <!-- Household Headcount -->
        <v-col xs="12" sm="5" md="4" lg="3" xl="3">
          <v-text-field
            label="How many are you in the house?"
            v-model="form.household_headcount"
            @input="$v.form.household_headcount.$touch()"
            @blur="$v.form.household_headcount.$touch()"
            :error-messages="householdHeadcountErrors"
          ></v-text-field>
        </v-col>
        <!-- Home Address -->
        <v-col xs="12" sm="7" md="10" lg="5" xl="5">
          <v-text-field
            label="Home Address"
            v-model="form.home_address"
            @input="$v.form.home_address.$touch()"
            @blur="$v.form.home_address.$touch()"
            :error-messages="homeAddressErrors"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col xs="12" sm="12" md="12" lg="3" xl="3">
          <v-btn color="primary" :loading="isLoading" @click="submit">Submit</v-btn>
        </v-col>
      </v-row>
    </form>
    <!-- 
      --
      -- FORGOT PASSWORD
      --
      -->
    <v-divider class="mt-12 mb-12"></v-divider>
    <v-row v-if="alertpass.show">
      <v-col cols="12">
        <v-alert :type="alertpass.type">{{ alertpass.message }}</v-alert>
      </v-col>
    </v-row>
    <form @submit.prevent="submit">
      <v-list-item-title class="headline mb-1">Change Password</v-list-item-title>
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            label="Current Password"
            v-model="change_password_form.current_password"
            :append-icon="showCurrentPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showCurrentPassword ? 'text' : 'password'"
            @click:append="showCurrentPassword = !showCurrentPassword"
            @input="$v.change_password_form.current_password.$touch()"
            @blur="$v.change_password_form.current_password.$touch()"
            @keyup.enter="submit"
            :error-messages="currentPasswordErrors"
            :disabled="isLoading"
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            label="New Password"
            v-model="change_password_form.new_password"
            :append-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showNewPassword ? 'text' : 'password'"
            @click:append="showNewPassword = !showNewPassword"
            @input="$v.change_password_form.new_password.$touch()"
            @blur="$v.change_password_form.new_password.$touch()"
            @keyup.enter="submit"
            :error-messages="newPasswordErrors"
            :disabled="isLoading"
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            label="Confirm Password"
            v-model="change_password_form.confirm_password"
            :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showConfirmPassword ? 'text' : 'password'"
            @click:append="showConfirmPassword = !showConfirmPassword"
            @input="$v.change_password_form.confirm_password.$touch()"
            @blur="$v.change_password_form.confirm_password.$touch()"
            @keyup.enter="submit"
            :error-messages="confirmPasswordErrors"
            :disabled="isLoading"
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="4">
          <v-btn color="primary" :loading="isLoading" @click="changePassword"
            >Submit</v-btn
          >
        </v-col>
      </v-row>
    </form>
    <loading ref="loading" />
  </v-container>
</template>

<script>
import { validationMixin } from "vuelidate";
import {
  required,
  sameAs,
  minLength,
  maxLength,
  email,
  between,
  numeric,
  minValue,
  maxValue,
  requiredIf,
  decimal,
} from "vuelidate/lib/validators";
import Loading from "../components/Loading";
export default {
  name: "my-account",
  mixins: [validationMixin],
  components: { Loading },
  validations: {
    form: {
      fullname: {
        required,
        maxLength: maxLength(250),
        minLength: minLength(4),
      },
      email: { required, email },
      mobile_number: {
        required,
        maxLength: maxLength(11),
        minLength: minLength(11),
        numeric,
      },
      age: {
        required,
        numeric,
        between: between(1, 200),
      },
      gender: { required },
      visitor_type: { required },
      visitor_type_others: {
        required: requiredIf(function () {
          return this.form.visitor_type == "Others";
        }),
      },
      department: { required },
      site: { required },
      nature_of_visit: { required },
      nature_of_visit_others: {
        required: requiredIf(function () {
          return this.form.nature_of_visit == "Others";
        }),
      },
      employee_number: { required },
      home_address: { required },
      household_headcount: {
        required,
        numeric,
        minValue: (value) => value > 0,
      },
    },
    change_password_form: {
      current_password: { required },
      new_password: {
        required,
        sameAsPassword: sameAs("confirm_password"),
        minLength: minLength(8),
        maxLength: maxLength(60),
      },
      confirm_password: {
        required,
        sameAsPassword: sameAs("new_password"),
      },
    },
  },
  data: () => ({
    isLoading: false,
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
    sites: [],
    departments: [],
    genders: ["Male", "Female"],
    statuses: [
      "Employee",
      "Applicant",
      "Visitor",
      "Housekeeping",
      "Security Guard",
      "Others",
    ],
    purposes: [
      "Work",
      "Personal Visit",
      "Official Visit",
      "Official Visit",
      "Pick up  / Delivery",
      "Interview / Orientation",
      "Appointment",
      "Others",
    ],
    form: {},
    change_password_form: {
      current_password: "",
      new_password: "",
      confirm_password: "",
      _method: "PUT",
    },
    alert: {
      show: false,
      message: "",
      type: "error",
    },
    alertpass: {
      show: false,
      message: "",
      type: "error",
    },
  }),
  methods: {
    submit() {
      this.isLoading = true;
      this.alert.show = false;
      this.$refs.loading.open();
      this.$v.form.$touch();
      if (this.$v.form.$invalid) {
        this.alert = {
          show: true,
          message: "Please complete the form, see errors below.",
          type: "error",
        };
        this.$refs.loading.close();
        this.isLoading = false;
      } else {
        this.$http
          .post(this.$api + "/autofill", this.form)
          .then((response) => {
            this.alert = {
              show: true,
              message: "Update on auto fill details updated!",
              type: "success",
            };
            this.setForm();
            this.getAutoFills();
            this.$refs.loading.close();
            this.isLoading = false;
          })
          .catch((err) => {
            let msg = "";
            if (err.response.data.message) {
              msg = err.response.data.message;
            } else {
              msg = "Something went wrong. Please contact the administrator";
            }
            this.alert = {
              show: true,
              type: "error",
              message: msg,
            };
            this.$refs.loading.close();
            this.isLoading = false;
          });
      }
    },
    changePassword() {
      this.alert.show = false;
      this.isLoading = true;
      this.$refs.loading.open();
      this.$v.change_password_form.$touch();
      if (this.$v.change_password_form.$invalid) {
        this.alertpass = {
          show: true,
          message: "Please complete the form, see errors below.",
          type: "error",
        };
        this.$refs.loading.close();
        this.isLoading = false;
      } else {
        this.$http
          .post(this.$api + "/change-password", this.change_password_form)
          .then((resp) => {
            this.$refs.loading.close();
            this.$v.change_password_form.$reset();
            this.alertpass = {
              show: true,
              type: "success",
              message: resp.data.message,
            };
            this.change_password_form = {
              current_password: "",
              new_password: "",
              confirm_password: "",
              _method: "PUT",
            };
            this.isLoading = false;
          })
          .catch((err) => {
            let msg = "";
            if (err.response.data.message) {
              msg = err.response.data.message;
            } else {
              msg = "Something went wrong. Please contact the administrator";
            }
            this.alertpass = {
              show: true,
              type: "error",
              message: msg,
            };
            this.$refs.loading.close();
            this.isLoading = false;
          });
      }
    },
    getAutoFills() {
      this.$http.get(this.$api + "/autofill").then((resp) => {
        this.form.fullname = resp.data.response.fullname;
        this.form.email = resp.data.response.email;
        this.form.mobile_number = resp.data.response.mobile_number;
        this.form.age = resp.data.response.age;
        this.form.gender = resp.data.response.gender;
        const resultStatus = this.statuses.filter(
          (status) => status == resp.data.response.visitor_type
        );
        if (resultStatus.length > 0) {
          this.form.visitor_type = resp.data.response.visitor_type;
        } else {
          this.form.visitor_type = "Others";
          this.form.visitor_type_others = resp.data.response.visitor_type;
        }
        const textNoT = resp.data.response.nature_of_visit;
        const resultPurpose = this.purposes.filter((NoT) => NoT == textNoT);
        if (resultPurpose.length > 0) {
          this.form.nature_of_visit = textNoT;
        } else {
          this.form.nature_of_visit = "Others";
          this.form.nature_of_visit_others = textNoT;
        }
        this.form.department = resp.data.response.department;
        this.form.site = resp.data.response.site;
        this.form.employee_number = resp.data.response.employee_number;
        this.form.home_address = resp.data.response.home_address;
        this.form.household_headcount = resp.data.response.household_headcount;
      });
    },
    getDropDowns() {
      this.$http
        .get(this.$api + "/declarations/dropdowns")
        .then((resp) => {
          this.sites = resp.data.response.sites;
          this.departments = resp.data.response.departments;
        })
        .catch((err) => {
          alert("Something Went Wrong.");
          console.log(err);
        });
    },
    setForm() {
      this.$v.form.$reset();
      this.form = {
        _method: "PUT",
        fullname: "",
        mobile_number: "",
        email: "",
        age: "",
        gender: "",
        visitor_type: "",
        visitor_type_others: "",
        nature_of_visit: "",
        nature_of_visit_others: "",
        temperature: "",
        department: "",
        site: "",
        employee_number: "",
        home_address: "",
        household_headcount: "",
      };
    },
  },
  computed: {
    currentPasswordErrors() {
      const errors = [];
      if (!this.$v.change_password_form.current_password.$dirty) return errors;
      !this.$v.change_password_form.current_password.required &&
        errors.push("Current is required");
      return errors;
    },
    newPasswordErrors() {
      const errors = [];
      if (!this.$v.change_password_form.new_password.$dirty) return errors;
      !this.$v.change_password_form.new_password.required &&
        errors.push("New Password is required");
      !this.$v.change_password_form.new_password.minLength &&
        errors.push("Password minimum length is 8");
      !this.$v.change_password_form.new_password.maxLength &&
        errors.push("Password minimum length is 60");
      !this.$v.change_password_form.confirm_password.sameAsPassword &&
        errors.push("New Password must same as Confirm Password");
      return errors;
    },
    confirmPasswordErrors() {
      const errors = [];
      if (!this.$v.change_password_form.confirm_password.$dirty) return errors;
      !this.$v.change_password_form.confirm_password.required &&
        errors.push("Confirm Password is required");
      !this.$v.change_password_form.confirm_password.sameAsPassword &&
        errors.push("Confirm Password must same as New Password");
      return errors;
    },
    declarationErrors() {
      const errors = [];
      if (!this.$v.form.declaration.$dirty) return errors;
      !this.$v.form.declaration.checked && errors.push("You must agree to continue!");
      return errors;
    },
    dateErrors() {
      const errors = [];
      if (!this.$v.form.date.$dirty) return errors;
      !this.$v.form.date.required && errors.push("Date is required.");
      !this.$v.form.date.minValue && errors.push("Date must be today or future date");
      return errors;
    },
    nameErrors() {
      const errors = [];
      if (!this.$v.form.fullname.$dirty) return errors;
      !this.$v.form.fullname.required && errors.push("Full Name is required.");
      !this.$v.form.fullname.maxLength &&
        errors.push("Full Name must be at most 250 characters long");
      !this.$v.form.fullname.minLength &&
        errors.push("Full Name must be at least 4 characters long");
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.form.email.$dirty) return errors;
      !this.$v.form.email.email && errors.push("Must be valid e-mail");
      !this.$v.form.email.required && errors.push("E-mail is required");
      return errors;
    },
    mobileErrors() {
      const errors = [];
      if (!this.$v.form.mobile_number.$dirty) return errors;
      !this.$v.form.mobile_number.required && errors.push("Mobile Number is required.");
      !this.$v.form.mobile_number.numeric &&
        errors.push("Mobile Number must be numeric.");
      !this.$v.form.mobile_number.maxLength &&
        errors.push("Mobile Number must be 11 characters long");
      !this.$v.form.mobile_number.minLength &&
        errors.push("Mobile Number must be 11 characters long");
      return errors;
    },
    ageErrors() {
      const errors = [];
      if (!this.$v.form.age.$dirty) return errors;
      !this.$v.form.age.required && errors.push("Age is required.");
      !this.$v.form.age.numeric && errors.push("Age must be numeric.");
      !this.$v.form.age.between && errors.push("Age must be 1 to 200 number");
      return errors;
    },
    genderErrors() {
      const errors = [];
      if (!this.$v.form.gender.$dirty) return errors;
      !this.$v.form.gender.required && errors.push("Gender is required.");
      return errors;
    },
    statusErrors() {
      const errors = [];
      if (!this.$v.form.visitor_type.$dirty) return errors;
      !this.$v.form.visitor_type.required && errors.push("Status is required");
      return errors;
    },
    statusOthersErrors() {
      const errors = [];
      if (!this.$v.form.visitor_type_others.$dirty) return errors;
      !this.$v.form.visitor_type_others.required && errors.push("Please specify status");
      return errors;
    },
    natureErrors() {
      const errors = [];
      if (!this.$v.form.nature_of_visit.$dirty) return errors;
      !this.$v.form.nature_of_visit.required &&
        errors.push("Nature of Visit is required");
      return errors;
    },
    natureOthersErrors() {
      const errors = [];
      if (!this.$v.form.nature_of_visit_others.$dirty) return errors;
      !this.$v.form.nature_of_visit_others.required && errors.push("Please specify");
      return errors;
    },
    siteErrors() {
      const errors = [];
      if (!this.$v.form.site.$dirty) return errors;
      !this.$v.form.site.required && errors.push("Site is required.");
      return errors;
    },
    departmentErrors() {
      const errors = [];
      if (!this.$v.form.department.$dirty) return errors;
      !this.$v.form.department.required && errors.push("Department is required");
      return errors;
    },
    employeeNumberErrors() {
      const errors = [];
      if (!this.$v.form.employee_number.$dirty) return errors;
      !this.$v.form.employee_number.required &&
        errors.push("Employee Number is required");
      return errors;
    },
    homeAddressErrors() {
      const errors = [];
      if (!this.$v.form.home_address.$dirty) return errors;
      !this.$v.form.home_address.required && errors.push("Home Address is required");
      return errors;
    },
    householdHeadcountErrors() {
      const errors = [];
      if (!this.$v.form.household_headcount.$dirty) return errors;
      !this.$v.form.household_headcount.required && errors.push("This is required");
      !this.$v.form.household_headcount.numeric && errors.push("This must be numeric");
      !this.$v.form.household_headcount.minValue &&
        errors.push("This minimum value is 1");
      return errors;
    },
  },
  mounted() {
    this.getDropDowns();
    this.setForm();
    this.getAutoFills();
  },
};
</script>
<style lang="scss">
.v-application .primary {
  color: #00b4ee !important;
}
</style>
