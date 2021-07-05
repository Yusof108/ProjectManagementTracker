<template>
  <v-container>
    <div class="ma-10">
      <v-card flat>
        <v-list-item three-line>
          <v-list-item-avatar class="my-auto" round size="80" color="grey"
            ><v-icon size="50" dark>mdi-account</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="text-h4 mb-2">{{
              thisUser.name
            }}</v-list-item-title>
            <v-list-item-subtitle class="text-h5 mb-1">{{
              thisUser.department
            }}</v-list-item-subtitle>
            <v-list-item-subtitle class="text-h6">{{
              thisUser.position
            }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </div>
    <h5>Projects Created By You</h5>
    <v-simple-table class="mb-10" >
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Title</th>
            <th class="text-left">Description</th>
            <th class="text-left">Created By</th>
            <th class="text-left">Deadline</th>
            <th class="text-left">Create Date</th>
            <th class="pa-5">
              <v-btn
                @click="$router.push('/add-project')"
                color="green"
                style="color: white"
              >
                <v-icon class="mr-2">mdi-folder-plus</v-icon> Add Project
              </v-btn>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="project in filterProject" :key="project._id">
            <td>{{ project.title }}</td>
            <td>
              <v-expansion-panels flat>
                <v-expansion-panel>
                  <v-expansion-panel-header>
                    {{ project.description.substring(0, 15) + "..." }}
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    {{ project.description }}
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </td>
            <td>{{ project.createdBy.name }}</td>
            <td>{{ project.deadline }}</td>
            <td>{{ project.created }}</td>
            <td>
              <v-btn
                elevation="2"
                class="mr-2"
                @click="goToProject(project._id)"
              >
                <v-icon class="mr-3">mdi-open-in-app</v-icon>Open Project</v-btn
              >

              <v-btn
                elevation="2"
                dark
                color="error"
                @click="deleteProject(project._id)"
              >
                <v-icon>mdi-delete-empty</v-icon></v-btn
              >
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

    <h5>Active Projects</h5>
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Title</th>
            <th class="text-left">Description</th>
            <th class="text-left">Created By</th>
            <th class="text-left">Deadline</th>
            <th class="text-left">Create Date</th>
            <th class="pa-5"></th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="project in filterActive" :key="project._id">
            <td>{{ project.title }}</td>
            <td>
              <v-expansion-panels flat>
                <v-expansion-panel>
                  <v-expansion-panel-header>
                    {{ project.description.substring(0, 15) + "..." }}
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    {{ project.description }}
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </td>
            <td>{{ project.createdBy.name }}</td>
            <td>{{ project.deadline }}</td>
            <td>{{ project.created }}</td>
            <td>
              <v-btn
                elevation="2"
                text
                @click="goToProject(project._id)"
              >
                <v-icon class="mr-3">mdi-open-in-app</v-icon>Open Project</v-btn
              >
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-container>
</template>



<script>
import PRO from "../projectApi";
import API from "../api"

export default {
  data() {
    return {
      projects: [],
      tasks:[],
      thisUser: JSON.parse(sessionStorage.getItem('thisUser'))
    };
  },

  computed: {

    filterProject: function () {
      return this.projects.filter((project) => {
        return project.createdBy.userId == this.thisUser.id;
      });
    },
    filterActive: function () {
      return this.projects.filter((project) => {
        if (project.memberId !== undefined) {
          let x = project.memberId.map((x) => x).indexOf(this.thisUser.id);
          return x !== -1;
        }
      });
    },
  },

  methods: {
     async getTask(){
      this.tasks = await API.fetchAllTask()
    },

      async getProject() {
      this.projects = await PRO.fetchAllProject();
    },
      async deleteProject(id){
      let x = this.projects.map(x => x._id).indexOf(id)
      if(confirm(`THIS ACTION INCLUDES DELETING ALL TASKS INSIDE THIS PROJECT\n Project: ${this.projects[x].title}`)){

        for (var i = 0; i < this.tasks.length; i++){
        if (this.tasks[i].project.projectId == id){
          const res = await API.deleteTask(this.tasks[i]._id)
        }
        
      }
      const response = await PRO.deleteProject(id)
      this.getProject()
      this.getTask()
      }
    },

    goToProject(id){
      sessionStorage.setItem('projectId', id)
      this.$router.push('/project')

    }

  },

  async created() {
   
    this.getProject();
    this.getTask();
  },
};
</script>