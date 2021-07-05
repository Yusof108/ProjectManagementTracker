<template>
  
      <form class="ma-10">
          <h1 class="ma-5">Registration</h1>
        <v-text-field
          v-model="name"
          :error-messages="nameErrors"
          label="Name"
          required
          outlined
          @input="$v.name.$touch()"
          @blur="$v.name.$touch()"
        ></v-text-field>

        <v-text-field
          v-model="ic"
          :error-messages="icErrors"
          :counter="8"
          type="number"
          label="Identity Card"
          outlined
          required
          @input="$v.ic.$touch()"
          @blur="$v.ic.$touch()"
        ></v-text-field>

        <v-text-field 
          v-model="email"
          :error-messages="emailErrors"
          label="E-mail"
          outlined
          required
          @input="$v.email.$touch()"
          @blur="$v.email.$touch()"
        ></v-text-field>
        <v-select
          v-model="select"
          :items="items"
          :error-messages="departmentErrors"
          label="Department"
          outlined
          required
          @change="$v.select.$touch()"
          @blur="$v.select.$touch()"
        ></v-select>

        <v-text-field
          v-model="position"
          :error-messages="positionErrors"
          label="Position"
          outlined
          required
          @input="$v.position.$touch()"
          @blur="$v.position.$touch()"
        ></v-text-field>

        <v-text-field
          v-model="password"
          :error-messages="passwordErrors"
          type="password"
          label="Password"
          outlined
          required
          @input="$v.password.$touch()"
          @blur="$v.password.$touch()"
        ></v-text-field>

        <v-text-field
          v-model="confirm_password"
          :error-messages="confirmPasswordErrors"
          type="password"
          label="Confirm Password"
          outlined
          required
          @input="$v.confirm_password.$touch()"
          @blur="$v.confirm_password.$touch()"
        ></v-text-field>

        <v-checkbox
          v-model="checkbox"
          :error-messages="checkboxErrors"
          label="I do hereby declare that the information given above is true"
          required
          @change="$v.checkbox.$touch()"
          @blur="$v.checkbox.$touch()"
        ></v-checkbox>

        <v-btn 
        class="mr-4" 
        @click="submit"
        :disabled = "$v.$invalid"
        > submit </v-btn>
        <v-btn @click="clear"> clear </v-btn>
      </form>
 
</template>

<script>
import axios from 'axios'
import { mapActions } from "vuex";
import { validationMixin } from "vuelidate";
import {
  required,
  maxLength,
  email,
  sameAs,
  minLength,
} from "vuelidate/lib/validators";

export default {
  mixins: [validationMixin],

  validations: {
    name: { required },
    ic: { required, maxLength: maxLength(8), minLength: minLength(8) },
    email: { required, email},
    select: { required },
    position: { required },
    password: { required, minLength: minLength(8) },
    confirm_password: { required, sameAsPassword: sameAs("password") },
    checkbox: {
      checked(val) {
        return val;
      },
    },
  },

  data: () => ({
    name: "",
    ic: "",
    position: "",
    email: "",
    password: "",
    confirm_password: "",
    select: null,
    items: ["Department 1", "Department 2", "Department 3", "Department 4"],
    checkbox: false,
  }),

  computed: {
    checkboxErrors() {
      const errors = [];
      if (!this.$v.checkbox.$dirty) return errors;
      !this.$v.checkbox.checked && errors.push("You must agree to continue!");
      return errors;
    },
    departmentErrors() {
      const errors = [];
      if (!this.$v.select.$dirty) return errors;
      !this.$v.select.required && errors.push("Item is required");
      return errors;
    },
    nameErrors() {
      const errors = [];
      if (!this.$v.name.$dirty) return errors;
      !this.$v.name.required && errors.push("Name is required.");
      return errors;
    },
    icErrors() {
      const errors = [];
      if (!this.$v.ic.$dirty) return errors;
      !this.$v.ic.minLength && errors.push("Invalid IC number");
      !this.$v.ic.maxLength && errors.push("Invalid IC number");
      !this.$v.ic.required && errors.push("IC is required.");
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push("Must be valid e-mail");
      !this.$v.email.required && errors.push("E-mail is required");
      return errors;
    },
    positionErrors() {
      const errors = [];
      if (!this.$v.position.$dirty) return errors;
      !this.$v.position.required && errors.push("Position is required.");
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.minLength &&
        errors.push("Password must be at least 8 characters");
      !this.$v.password.required && errors.push("Password is required.");
      return errors;
    },
    confirmPasswordErrors() {
      const errors = [];
      if (!this.$v.confirm_password.$dirty) return errors;
      !this.$v.confirm_password.sameAsPassword &&
        errors.push("Password do not match");
      !this.$v.confirm_password.required &&
        errors.push("Confirm password is required.");
      return errors;
    },
  },

  methods: {
    ...mapActions(["register"]),
    submit() {
      let user = {
        name: this.name,
        ic: this.ic,
        email: this.email,
        position: this.position,
        password: this.password,
        confirm_password: this.confirm_password,
        department: this.select,
      };
      this.register(user).then((res) => {
        if (res.data.success) {
          this.$router.push('/login')
        }
      }).catch((err) => {
        const errors = [];
         console.log(err.message)
         this.isValid = true
         this.email = 'This email has been taken'
          });

    
    },
    clear() {
      this.$v.$reset();
      this.name = "";
      this.ic = "";
      this.email = "";
      this.position = "";
      this.password = "";
      this.confirm_password = "";
      this.select = null;
      this.checkbox = false;
    },
  },
};
</script>
<style scoped>
.v-text-field{
    width: 60%;
    
}
.error .v-text-field__slot input {
   color: red !important;
}
</style>