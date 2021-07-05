<template>
  <v-container>
    <v-row justify="center">

   
  </v-row>
    <v-snackbar v-model="snackbar" :timeout="3000" top color="success">
      <span>Test</span>
      <v-btn @click="snackbar = false">Close</v-btn>
    </v-snackbar>
    <v-row>
      <v-col sm="5">
        <v-card flat align="center" class="pa-5">
          <v-text-field
            label="Title"
            v-model="project.title"
            outlined
            :readonly="this.disable"
          />

          <v-textarea
            label="Description"
            v-model="project.description"
            outlined
            :readonly="this.disable"
            auto-grow
          />

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
                v-model="project.deadline"
                label="Deadline Date"
                hint="DD-MM-YYYY format"
                persistent-hint
                outlined
                prepend-icon="mdi-calendar"
                v-bind="attrs"
                v-on="on"
                :readonly="disable"
              ></v-text-field>
            </template>

            <v-date-picker
              v-if="this.enable"
              v-model="date"
              no-title
              @input="menu1 = false"
            ></v-date-picker>
          </v-menu>

          <v-btn
            v-if="showEdit && isAdmin == thisUser.id"
            @click="
              (disable = false),
                (showEdit = false),
                (showSave = true),
                (enable = true)
            "
            class="ma-3"
            color="primary"
            >Edit</v-btn
          >
          <v-btn v-if="showSave" @click="saveEdit" class="ma-3" color="primary"
            >Save Edit</v-btn
          >
          <v-btn v-if="showSave" @click="cancelEdit" class="ma-3" color="error"
            >Cancel</v-btn
          >
        </v-card>
      </v-col>

      <v-col class="sm-5">
        <v-toolbar flat v-if="saveTeam">
          <v-autocomplete
            v-model="selectUser"
            :items="items"
            :search-input.sync="search"
            cache-items
            class="mx-4"
            flat
            hide-no-data
            hide-details
            outlined
            placeholder="Enter user e-mail"
            hint="Search user by e-mail"
            persistent-hint
          >
            <template slot="label"
              ><v-icon>mdi-account-search</v-icon>Search User</template
            >
          </v-autocomplete>
          <v-btn
            color="purple"
            dark
            class="mr-2"
            @click="addUser"
          >
          
            <v-icon class="mr-2">mdi-account-plus</v-icon>
            Add User</v-btn
          >
          <v-btn
            color="primary"
            dark
            @click="(editTeam = true), (saveTeam = false)"
          >
            
            Done</v-btn
          >
        </v-toolbar>

        <h3 class="my-3">
          Team
          <v-btn
            v-if="isAdmin == thisUser.id && editTeam"
            @click="(editTeam = false), (saveTeam = true)"
            small
            dark
            color="purple"
            class="ml-5"
          >
            <v-icon class="mr-2">mdi-account-multiple-plus</v-icon>EDIT
          </v-btn>
        </h3>

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
              v-if="saveTeam && user.id !== thisUser.id"
              @click="deleteUser(user.id)"
            >
              <v-icon>mdi-minus-circle</v-icon>
            </v-btn>
          </li>
        </ul>
      </v-col>
    </v-row>
    <v-row>
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th></th>
              <th class="text-left">Title</th>
              <th class="text-left">Description</th>

              <th class="text-left">Created By</th>
              <th class="text-left">Create Date</th>
              <th class="text-left">Deadline</th>
              <th class="text-left">Status</th>
              <th>
                <v-row>
                  <v-btn
                    color="green"
                    style="color: white"
                    @click="$router.push('add-task')"
                    v-if="isAdmin == thisUser.id"
                  >
                    <v-icon white>mdi-plus</v-icon>
                    Add Task</v-btn
                  >
                </v-row>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="task in filterTask" :key="task._id">
              <td>
                <v-icon
                   v-if="
                          task.memberId !== undefined &&
                          task.memberId.indexOf(thisUser.id) !== -1
                        "
                  dark
                  color="purple">
                  mdi-account</v-icon></td>
              <td>
                  {{ task.title }}
              </td>
              <td>
                <v-expansion-panels flat>
                  <v-expansion-panel>
                    <v-expansion-panel-header>
                      {{ task.description.substring(0, 10) + "..." }}
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      {{ task.description }}
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </td>
              <td>{{ task.createdBy.name }}</td>
              <td>{{ task.created }}</td>
              <td>{{ task.deadline }}</td>
              <td>
                <v-chip dark :class="task.taskStatus">{{ task.taskStatus }}</v-chip>
              </td>
              <td>
                <v-menu offset-x>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn class ="px-2" dark color="orange"  v-bind="attrs" v-on="on">
                      actions<v-icon class="ml-1">mdi-chevron-double-right</v-icon>
                    </v-btn>
                  </template>

                  <v-list>
                    <v-list-item v-if="
                          task.memberId == undefined ||
                          task.memberId.indexOf(thisUser.id) == -1
                        ">
                      <v-btn
                        class="mr-3"
                      
                        text
                        
                        @click="grabTask(task._id)"
                        ><v-icon class ="mr-3">mdi-briefcase-check</v-icon>Grab</v-btn
                      >
                    </v-list-item>
                    <v-list-item v-if="
                          task.memberId !== undefined &&
                          task.memberId.indexOf(thisUser.id) !== -1
                        ">
                      <v-btn
                        class="mr-3"
                     
                        text
                        
                        @click="ungrabTask(task._id)"
                        ><v-icon class ="mr-3">mdi-briefcase-off</v-icon>Ungrab Task</v-btn
                      >
                    </v-list-item>
                    <v-list-item v-if=" task.memberId !== undefined &&
                          task.memberId.indexOf(thisUser.id) !== -1">
                      <v-btn
                        v-if="task.taskStatus !== 'Completed'"
                        class="mr-3"
                        text
                        color="success"
                        @click ="completeStatus(task._id)"
                        ><v-icon class ="mr-3">mdi-marker-check</v-icon>Mark as Completed</v-btn
                      >
                      <v-btn
                        v-if="task.taskStatus == 'Completed'"
                        class="mr-3"
                        text
                        color="success"
                        @click ="progressStatus(task._id)"
                        ><v-icon class ="mr-3">mdi-progress-check</v-icon>Mark as In Progress</v-btn
                      >
                    </v-list-item>
                    
                    <v-list-item v-if="isAdmin == thisUser.id">
                      <v-btn
                        text
                        color="primary"
                        @click="editTask(task._id)"
                      >
                        <v-icon class ="mr-3">mdi-pencil</v-icon>EDIT TASK</v-btn
                      >
                    </v-list-item>
                    <v-list-item v-if="isAdmin == thisUser.id">
                      <v-btn
                        text
                        color="error"
                        
                        v-on:click="deleteTask(task._id)"
                      >
                        <v-icon class ="mr-3">mdi-delete</v-icon>DELETE TASK</v-btn
                      >
                    </v-list-item>
                  </v-list>
                </v-menu>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-row>
  </v-container>
</template>

<script>
import PRO from "../projectApi";
import API from "../api";

export default {
  data(vm) {
    return {
      thisUser : "",
      project_Id:"",
      //other attributes
      snackbar: false,
      isMember: true,
      editTeam: true,
      saveTeam: false,
      //prompt pop up
      dialog: false,
      promptDialog:"",
      promptYes: false,
      //autocomplete data
      loading: false,
      items: [],
      search: null,
      selectUser: null,
      allUsers: [],
      userDetails: [],
      team: [],
      isAdmin: "",
      //Project Details
      showEdit: true,
      showSave: false,
      enable: false,
      disable: true,
      //Date Picker data
      date: new Date().toISOString().substr(0, 10),
      dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
      menu1: false,
      //Mongodb data
      tasks: [],
      taskMember: [],
      project: {
        title: "",
        description: "",
        deadline: "",
      },
    };
  },
  computed: {
    filterTask: function () {
      return this.tasks.filter((task) => {
        return task.project.projectId == this.project_Id;
      });
    },
    filterUser: function () {
      return this.userDetails.filter((user) => {
        let x = this.team.map((x) => x).indexOf(user.id);
        return x !== -1;
      });
    },
    computedDateFormatted() {
      return this.formatDate(this.date);
    },
  },
  watch: {
    date(val) {
      this.project.deadline = this.formatDate(this.date);
    },
    search(val) {
      val && val !== this.select && this.querySelections(val);
    },
  },
  methods: {
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${day}-${month}-${year}`;
    },

    querySelections(v) {
      this.loading = true;
      // Simulated ajax query
      setTimeout(() => {
        this.items = this.allUsers.filter((e) => {
          return (e || "").toLowerCase().indexOf((v || "").toLowerCase()) > -1;
        });
        this.loading = false;
      }, 500);
    },
    //getProject Details
    async projectDetails() {
      this.thisUser = JSON.parse(sessionStorage.getItem('thisUser'))
      this.project_Id = sessionStorage.getItem('projectId')
      const res = await PRO.fetchProjectById(this.project_Id);
      this.project = res;
      if (this.project.memberId !== undefined) {
        this.team = this.project.memberId;
      }
      this.isAdmin = this.project.createdBy.userId;
    },

    //get All Users
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

    //Add new Team member to PROJECT
    async addUser() {
      let addnew = {
        memberId: {},
      };

      if (this.selectUser !== null) {
        let x = this.userDetails.map((x) => x.email).indexOf(this.selectUser);
        this.team.unshift(this.userDetails[x].id);
        addnew.memberId = this.team;
        const res = await PRO.editProject(this.project_Id, addnew);
      } else {
        console.log("user not selected");
      }
      this.selectUser = null;
      this.projectDetails();
    },

    //Delete user from PROJECT
    async deleteUser(id) {
      let newMember = {
        memberId: {},
      };
      for(let i = 0; i < this.tasks.length; i++){
        let y = this.tasks[i].memberId.indexOf(id)
        if (y !== -1) {
          let taskMember = this.tasks[i].memberId
          let z = taskMember.indexOf(id)
          taskMember.splice(z,1)

          newMember.memberId = taskMember
          const response = await API.editTask(this.tasks[i]._id, newMember)
          this.getTask()
        }
      }
      let x = this.team.indexOf(id);
      this.team.splice(x, 1);
      newMember.memberId = this.team;
      const res = await PRO.editProject(this.project_Id, newMember);

      this.projectDetails();
    },

    //getAllTask
    async getTask() {
      this.tasks = await API.fetchAllTask();
    },
    //Edit Task
    editTask(id){
      sessionStorage.setItem('taskId', id)
      this.$router.push('edit-task')
    },

    //DeleteTask
    async deleteTask(id) {
      let x = this.tasks.map(x => x._id).indexOf(id)
      if(confirm(`Delete this task? ${this.tasks[x].title}`)){
        const response = await API.deleteTask(id);
        this.getTask();
      }
    },
    //grabTask
    async grabTask(id) {
      let newGrab = {
        taskStatus: "",
        memberId: {},
      };
      const res = await API.fetchTaskById(id);
      if(res.taskStatus !== "Completed"){
          newGrab.taskStatus = "In Progress"
        }else{
          newGrab.taskStatus = res.taskStatus
        }

      if (res.memberId !== undefined && res.memberId.length != 0) {
        this.taskMember = res.memberId;
        
        if (this.taskMember.length !== 0) {
          let x = this.taskMember.indexOf(this.thisUser.id);
          if (x == -1) {
            this.taskMember.push(this.thisUser.id);
            newGrab.memberId = this.taskMember;
            const res = await API.editTask(id, newGrab);
            this.getTask();
          } else {
            console.log("error");
          }
        }
      } else {
        this.taskMember.push(this.thisUser.id);
        newGrab.memberId = this.taskMember;
        const res = await API.editTask(id, newGrab);
        this.getTask();
      }
    },
    //Ungrab Task
    async ungrabTask(id) {
      let newMember = {
        memberId: {},
      };
      const res = await API.fetchTaskById(id);
      this.taskMember = res.memberId;

      if (this.taskMember !== undefined) {
        let x = this.taskMember.indexOf(this.thisUser.id);
        this.taskMember.splice(x, 1);
        newMember.memberId = this.taskMember;

        const response = API.editTask(id, newMember);
        this.getTask();
      }
    },

    //Patching Task Status
    async completeStatus(id) {
      let afterGrab = {
        taskStatus: "Completed",
      };
      const response = await API.editTask(id, afterGrab);
      this.getTask();
    },
    async progressStatus(id) {
      let afterGrab = {
        taskStatus: "In Progress",
      };
      const response = await API.editTask(id, afterGrab);
      this.getTask();
    },

    //Patching Project
    saveEdit() {
      let saveProject = {
        title: this.project.title,
        description: this.project.description,
        deadline: this.project.deadline,
      };
      const response = PRO.editProject(this.project_Id, saveProject);

      this.disable = true;
      this.enable = false;
      this.showSave = false;
      this.showEdit = true;
      this.projectDetails();
    },

    cancelEdit() {
      this.disable = true;
      this.enable = false;
      this.showSave = false;
      this.showEdit = true;
      this.projectDetails();
    },
  },

  created() {
    this.projectDetails();
    this.getTask();
    this.getAllUser();
  },
};
</script>

<style scoped>
li {
  list-style: none !important;
}
.Available{
  background-color: lightslategrey!important;
}
.Progress{
  background-color:steelblue!important
}
.Completed{
  background-color:seagreen!important;
}
</style>

