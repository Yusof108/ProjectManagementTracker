<template>
  <v-container>
    <v-row>
      <v-col sm="5">
        <v-card flat align="center">
          <v-divider></v-divider>
          <v-form
            ref="form"
            class="pa-3"
          >
            <v-text-field
              label="Title"
              outlined
              v-model="task.title"
              :rules="rules"
            >
            </v-text-field>
            <v-text-field
              label="Description"
              outlined
              v-model="task.description"
              :rules="rules"
            >
            </v-text-field>
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
                  v-model="task.deadline"
                  label="Deadline Date"
                  hint="DD-MM-YYYY format"
                  persistent-hint
                  outlined
                  prepend-icon="mdi-calendar"
                  v-bind="attrs"
                  v-on="on"
                  :rules="rules"
                ></v-text-field>
              </template>

              <v-date-picker
                v-model="date"
                no-title
                @input="menu1 = false"
              ></v-date-picker>
            </v-menu>

            <v-btn @click="editForm" class="mt-3 mr-3" color="primary"
              >Save Task</v-btn>
              <v-btn @click="getTask()" class="mt-3" color="error"
              >Reset</v-btn>
          </v-form>
        </v-card>
      </v-col>
      <v-col>
        <h3>Team</h3>
         <ul class="pl-0" v-for="user in filterUser" :key="user.id">
          <li>
            {{ user.name }} &nbsp; ({{ user.email }})
            <v-btn
              dark
              depressed
              icon
              x-small
              fab
              color="red"
              @click="deleteUser(user.id)"
            >
              <v-icon>mdi-minus-circle</v-icon>
            </v-btn>
          </li>
        </ul>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import API from "../api";

export default {
 
  data(vm) {
    return {
      rules: [(value) => !!value || "this field required"],
      date: new Date().toISOString().substr(0, 10),
      dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
      menu1: false,
      task_Id : sessionStorage.getItem('taskId'),
      userDetails:[],
      team:[],
      task: {
        title: "",
        description: "",
        deadline: "",
      },
    };
  },

  
  computed: {
    computedDateFormatted() {
      return this.formatDate(this.date);
    },
    filterUser: function () {
      return this.userDetails.filter((user) => {
        let x = this.team.map((x) => x).indexOf(user.id);
        return x !== -1;
      });
    },
    
  },
  watch: {
    date(val) {
      this.task.deadline = this.formatDate(this.date);
    },
  },

  methods: {
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${day}-${month}-${year}`;
    },
    async getTask(){
        const res = await API.fetchTaskById(this.task_Id);
        this.task = res;

        if(this.task.memberId !== undefined){
          this.team = this.task.memberId
        }
    },

    async editForm() {
      const formData = new FormData();
      formData.append("title", this.task.title);
      formData.append("description", this.task.description);
      formData.append("deadline", this.task.deadline);
      if (this.$refs.form.validate()) {
        const response = await API.editTask(
          this.task_Id,
          formData
        );
        this.$router.push('/project');
      }
    },

     async getAllUser() {
      let newData = await API.fetchAllUser();
      let data = [];
      for (var i = 0; i < newData.length; i++) {
        let detail = {
          id: newData[i]._id,
          name: newData[i].name,
          email: newData[i].email,
        };

        this.userDetails.push(detail);
        data.push(newData[i].email);
      }
      this.allUsers = data;
    },
  },

  async created() {
    this.getTask()
    this.getAllUser()
  },
};
</script>
<style scoped>
li{
  list-style: none!important;
}
</style>
