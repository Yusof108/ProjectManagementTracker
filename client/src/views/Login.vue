<template>
  <v-container fluid>
    <v-row justify="center" class="mt-16">
      <v-card align="center" width="40%" class="pa-3">
        <h2 class="ma-2">Log In</h2>
        <v-text-field
          v-model="email"
          :error-messages="emailErrors"
          label="Email"
          outlined
          required
          @input="$v.email.$touch()"
          @blur="$v.email.$touch()"
        ></v-text-field>
        <v-text-field
          v-model="password"
          :error-messages="passwordErrors"
          label="Password"
          type="password"
          outlined
          required
          @input="$v.password.$touch()"
          @blur="$v.password.$touch()"
        ></v-text-field>
        <h5 v-if = "error" style="color:red;">Check your email and password</h5>
        <v-btn class="mx-auto" @click="submit" :disabled="$v.$invalid">
        submit
      </v-btn>
      <div align="center"><router-link to="/register" class="card-link">Create an account</router-link></div>
      </v-card>
      
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import { validationMixin } from "vuelidate";
import { required, email, minLength } from "vuelidate/lib/validators";
export default {
  mixins: [validationMixin],

  validations: {
    email: { required, email },
    password: { required, minLength: minLength(8) },
  },
  data: () => ({
    email: "",
    password: "",
    error: false
  }),
  computed: {
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push("Must be valid e-mail");
      !this.$v.email.required && errors.push("E-mail is required");
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
  },
  methods: {
    ...mapActions(["login"]),
    submit() {
      let user = {
        email: this.email,
        password: this.password,
      };
      this.login(user)
        .then((res) => {
          if (res.data.success) {
            let userDetails = {
              id: res.data.user._id,
              name: res.data.user.name,
              email: res.data.user.email,
              department : res.data.user.department,
              position: res.data.user.position
            }
            sessionStorage.setItem('thisUser', JSON.stringify(userDetails))
            console.log(res)
            this.$router.push("/dashboard");
          }
        })
        .catch((err) => {
          const errors = [];
          this.error = true
        });
    },
  },
};
</script>

<style>
</style>