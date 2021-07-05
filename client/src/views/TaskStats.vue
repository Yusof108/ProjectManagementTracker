<template>
  <v-container fluid>
    <v-data-iterator
      :items="items"
      :search="search"
      :sort-by="sortBy.toLowerCase()"
      :sort-desc="sortDesc"
      hide-default-footer
    >
      <template v-slot:header>
        <v-toolbar dark color="blue darken-3" class="mb-1">
          <v-text-field
            v-model="search"
            clearable
            flat
            solo-inverted
            hide-details
            prepend-inner-icon="mdi-magnify"
            label="Search"
          ></v-text-field>
          <template v-if="$vuetify.breakpoint.mdAndUp">
            <v-spacer></v-spacer>
            <v-select
              v-model="sortBy"
              flat
              solo-inverted
              hide-details
              :items="keys"
              prepend-inner-icon="mdi-magnify"
              label="Sort by"
            ></v-select>
            <v-spacer></v-spacer>
            <v-btn-toggle v-model="sortDesc" mandatory>
              <v-btn large depressed color="blue" :value="false">
                <v-icon>mdi-arrow-up</v-icon>
              </v-btn>
              <v-btn large depressed color="blue" :value="true">
                <v-icon>mdi-arrow-down</v-icon>
              </v-btn>
            </v-btn-toggle>
          </template>
        </v-toolbar>
      </template>

      <template v-slot:default="props">
        <v-row>
          <v-col
            v-for="item in props.items"
            :key="item.name"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card>
              <v-card-title class="subheading font-weight-bold">
                {{ item.name }}
              </v-card-title>

              <v-divider></v-divider>

              <v-list dense>
                <v-list-item v-for="(key, index) in filteredKeys" :key="index">
                  <v-list-item-content
                    :class="{ 'blue--text': sortBy === key }"
                  >
                    {{ key }}:
                  </v-list-item-content>
                  <v-list-item-content
                    class="align-end"
                    :class="{ 'blue--text': sortBy === key }"
                  >
                    {{ item[key.toLowerCase()] }}
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </template>

      <template v-slot:footer> </template>
    </v-data-iterator>
  </v-container>
</template>

<script>
import API from "../api";
export default {
  data() {
    return {
      search: "",
      filter: {},
      sortDesc: false,
      page: 1,
      itemsPerPage: 4,
      sortBy: "name",
      keys: ["Name", "Task", "Completed",],
      items: [],
      tasks: [],
      allTask: [],
      allUser: [],
    };
  },
  computed: {
    numberOfPages() {
      return Math.ceil(this.items.length / this.itemsPerPage);
    },
    filteredKeys() {
      return this.keys.filter((key) => key !== "Name");
    },
  },
  methods: {
    async getTask() {
      this.tasks = await API.fetchAllTask();
    },
    async getAllUser() {
      this.allUser = await API.fetchAllUser();
      this.getStats();
    },

    async getStats() {
      var all = [];
      let no = 0;
      let completedList = []

      for (var i = 0; i < this.allUser.length; i++) {
        if (this.tasks !== undefined) {
          for (var x = 0; x < this.tasks.length; x++) {
            if (this.tasks[x].memberId !== undefined) {
                
              for (var y = 0; y < this.tasks[x].memberId.length; y++) {
                if (this.allUser[i]._id == this.tasks[x].memberId[y]) {
                  
                  if(this.tasks[x].taskStatus === "Completed"){
                    completedList.push(this.tasks[x].title)
                }
                  no = no + 1;
                }
              }
            }
          }
        }
        let string = completedList.toString()
        string.replaceAll("[^a-zA-Z0-9]", "")
       
        let newString = string.replace(/,/g , ", ")

      
        
        
        all.push({ 
          name: this.allUser[i].name, 
          task: no,
          completed : newString
          });
  
      

        no = 0;
        completedList = []
      }
      this.items = all;
    },

    nextPage() {
      if (this.page + 1 <= this.numberOfPages) this.page += 1;
    },
    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1;
    },
    updateItemsPerPage(number) {
      this.itemsPerPage = number;
    },
  },
  async created() {
    this.getTask();
    this.getAllUser();
  },
};
</script>