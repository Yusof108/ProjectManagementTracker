<template>
<v-container>
    <v-row>
        <v-col sm="5">
            <h2>New Task</h2>
            <v-form ref="form" @submit.prevent="submitForm"  class="pa-3" enctype="multipart/form-data">
            <v-text-field label="Title" outlined v-model="task.title" :rules="rules">
            </v-text-field>
            <v-text-field label="Description" outlined v-model="task.description" :rules="rules">

            </v-text-field>
            

                <v-menu
      ref="menu2"
      v-model="menu2"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
      max-width="290px"
      min-width="auto"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-model="dateFormatted"
          outlined
          label="Deadline Date"
          hint="DD-MM-YYYY format"
          persistent-hint
          prepend-icon="mdi-calendar"
          v-bind="attrs"
         
          v-on="on"
        ></v-text-field>
      </template>

      <v-date-picker
        v-model="date"
        no-title
        @input="menu2 = false"
      ></v-date-picker>
    </v-menu>

            <v-btn type="submit" class="mt-10" color="primary">Add Task</v-btn>
            </v-form>
        </v-col>
    </v-row>
</v-container>
</template>

<script>
import PRO from "../projectApi";
import API from "../api";
import { mapActions, mapGetters} from 'vuex'
    export default{
        data: (vm) => ({
            date:new Date().toISOString().substr(0, 10),
            dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
            menu2:false,
            rules: [(value)=> !! value || "this field required"],
            project_Id : sessionStorage.getItem('projectId'),
            thisUser: JSON.parse(sessionStorage.getItem('thisUser')),
            project:[],
            task: {
                title: "",
                description:"",
                deadline:"",
                createdBy:{}
                
            },

  }),
        computed:{
             
        computedDateFormatted() {
         return this.formatDate(this.date);
     },
       
  },
  watch: {
    date(val) {
      this.dateFormatted = this.formatDate(this.date);
    },
        },
       
        methods:{
            ...mapActions(["getProfile"]),

            formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${day}-${month}-${year}`;
         },

        async submitForm(){

            let newTask = {
                title: this.task.title,
                description: this.task.description,
                deadline: this.dateFormatted,
                project:{
                    projectId: this.project._id,
                    projectName: this.project.title
                },
                createdBy:{
                    userId: this.thisUser.id,
                    name:this.thisUser.name
                }
            }
                if(this.$refs.form.validate()){
                const response = await API.addTask(newTask);
                this.$router.push('/project')
            }
        },
        },
        async created(){
            const res = await PRO.fetchProjectById(this.project_Id);
            this.project = res;
        },
    };
</script>
