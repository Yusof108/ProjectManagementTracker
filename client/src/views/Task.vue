<template>
  <v-container>
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

    <v-row>
      <v-col>
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Title</th>
                <th class="text-left">Description</th>
                <th class="text-left">Deadline</th>
                <th class="text-left">Project</th>
                <th class="text-left">Create Date</th>
                <th class="text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="task in filterTask" :key="task._id">
                <td>{{ task.title }}</td>
                <td>
                  <v-expansion-panels>
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

                <td>{{ task.project.projectName }}</td>
                <td>{{ task.created }}</td>
                <td>{{ task.deadline }}</td>
                <td>
                  <v-chip dark :class="task.taskStatus">{{
                    task.taskStatus
                  }}</v-chip>
                </td>
                <td>
                  <v-btn
                    elevation="2"
                    text
                    @click="goToProject(task.project.projectId)"
                    >GO TO</v-btn
                  >
                  <v-btn elavation="2" @click="ungrabTask(task._id)"
                    >UNGRAB</v-btn
                  >
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>
  </v-container>
</template>



<script>
import API from "../api";

export default {
  data() {
    return {
      thisUser : JSON.parse(sessionStorage.getItem('thisUser')),
      tasks: [],
      notUser: true,
    };
  },

  computed: {
    
    filterTask: function () {
      return this.tasks.filter((task) => {
        if (task.memberId !== undefined) {
          let x = task.memberId.map((x) => x).indexOf(this.thisUser.id);
          return x !== -1;
        }
      });
    },
  },

  methods: {
    goToProject(id){
      sessionStorage.setItem('projectId', id)
      this.$router.push('/project')
    },

    //get All Tasks
    async getTask() {
      this.tasks = await API.fetchAllTask();
    },

    //ungrab task
    async ungrabTask(id) {
      let x = this.tasks.map(x => x._id).indexOf(id)
      if (confirm(`UNGRAB THIS TASK?\nTask : ${this.tasks[x].title}\nProject : ${this.tasks[x].project.projectName}`)){
          let newMember = {
        memberId: {},
      };
      let taskMember = [];
      const res = await API.fetchTaskById(id);
      taskMember = res.memberId;

      if (taskMember !== undefined) {
        let x = taskMember.indexOf(this.thisUser.id);
        taskMember.splice(x, 1);
        newMember.memberId = taskMember;

        const response = API.editTask(id, newMember);
        this.getTask();
      }
      }
      
    },
  },
  created() {
    this.getTask();
 
  },
};
</script>
<style scoped>
.Available {
  background-color: lightslategrey !important;
}
.Progress {
  background-color: steelblue !important;
}
.Completed {
  background-color: seagreen !important;
}
</style>
