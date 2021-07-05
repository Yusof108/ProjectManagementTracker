<template>
  <form class="ma-10">
    <h1 class="ma-5">Create Project</h1>
    <v-text-field
      v-model="title"
      :error-messages="titleErrors"
      label="Project Title"
      required
      outlined
      @input="$v.title.$touch()"
      @blur="$v.title.$touch()"
    ></v-text-field>

    <v-text-field
      v-model="description"
      :error-messages="descriptionErrors"
      label="Description"
      outlined
      required
      @input="$v.description.$touch()"
      @blur="$v.description.$touch()"
    ></v-text-field>

    <v-text-field
      v-model="thisUser.name"
      :error-messages="descriptionErrors"
      label="Created By"
      outlined
      disabled
      @input="$v.description.$touch()"
      @blur="$v.description.$touch()"
    ></v-text-field>

    <v-menu
      ref="menu1"
      v-model="menu1"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
      max-width="290px"
      min-width="auto"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-model="dateFormatted"
          label="Deadline Date"
          hint="DD-MM-YYYY format"
          persistent-hint
          outlined
          prepend-icon="mdi-calendar"
          v-bind="attrs"
         
          v-on="on"
        ></v-text-field>
      </template>

      <v-date-picker
        v-model="date"
        no-title
        @input="menu1 = false"
      ></v-date-picker>
    </v-menu>

    <v-autocomplete
            v-model="selectUser"
            :items="allUsers"
            outlined
            label="Add Team Member"
            hint="Search by e-mail"
            persistent-hint
            chips
            multiple
          ></v-autocomplete>

    <v-btn class="mt-4" @click="submit" :disabled="$v.$invalid">
      Save Project
    </v-btn>
  </form>
</template>

<script>
import PRO from "../projectApi";
import API from "../api";
import { mapActions, mapGetters} from 'vuex'
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";

export default {
  mixins: [validationMixin],

  validations: {
    title: { required },
    description: { required },
  },
  data: (vm) => ({
    title: "",
    description: "",
    date: new Date().toISOString().substr(0, 10),
    dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
    menu1:false,
    allUsers:[],
    userDetails:[],
    selectUser:[],
    thisUser: JSON.parse(sessionStorage.getItem('thisUser'))
  }),

  computed: {
    ...mapGetters(["user"]),
  
    computedDateFormatted() {
      return this.formatDate(this.date);
    },
     titleErrors() {
      const errors = [];
      if (!this.$v.title.$dirty) return errors;
      !this.$v.title.required && errors.push("Project Title is required.");
      return errors;
    },
    descriptionErrors() {
      const errors = [];
      if (!this.$v.description.$dirty) return errors;
      !this.$v.description.required && errors.push("Project Description is required.");
      return errors;
    },
  },

  watch: {
    date(val) {
      this.dateFormatted = this.formatDate(this.date);
    },
  },

  methods: {
    ...mapActions(["getProfile"]),
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${day}-${month}-${year}`;
    },

     //get All Users
    async getAllUser() {
      let newData = await API.fetchAllUser();
      let data = [];
      for (var i = 0; i < newData.length; i++) {
        if(newData[i]._id !== this.thisUser.id){
          let detail = {
          id: newData[i]._id,
          name: newData[i].name,
          email: newData[i].email,
        };
        this.userDetails.push(detail);
        data.push(newData[i].email);
        }
        
      }
      this.allUsers = data;
      console.log(this.allUsers)
      
    },
    submit() {
        let array = []
       
        
        if(this.selectUser.length !== 0){
          for(var i = 0; i < this.selectUser.length; i++){
            let x = this.userDetails.map(x => x.email).indexOf(this.selectUser[i])
           
            array.push(this.userDetails[x].id)
          }
        }
        array.unshift(this.thisUser.id)
        let newProject = {
            title : this.title,
            description : this.description,
            deadline : this.dateFormatted,
            createdBy : {
              userId: this.thisUser.id,
              name:this.thisUser.name
            },
            memberId: array
        }
        
        const response =  PRO.addProject(newProject);
        this.$router.push('/dashboard')
    },
  },
  async created(){
    this.getAllUser()
  }
};
</script>

<style scoped>
.v-text-field{
    width: 60%;
}
</style>