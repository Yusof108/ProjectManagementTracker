<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            BTMS
          </v-list-item-title>
          <v-list-item-subtitle>
            Fullstack App
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
          <v-list dense>
      
      <v-list-item-group
         color="primary"
      >
      <div v-if = "isLoggedIn">
        <v-list-item
          v-for="(item, i) in items"
          :key="i" :to="item.link" link
        >
          <v-list-item-icon>
            <v-icon v-text="item.icon"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </div>
        
        <v-list-item v-if = "!isLoggedIn">
          <v-list-item-icon><v-icon>mdi-account-arrow-right</v-icon></v-list-item-icon>
          <v-list-item-title @click ="$router.push('/login')" >Log In</v-list-item-title>
        </v-list-item>
        <v-list-item v-if = "!isLoggedIn">
          <v-list-item-icon><v-icon>mdi-clipboard-edit-outline</v-icon></v-list-item-icon>
          <v-list-item-title @click ="$router.push('/register')" >Register</v-list-item-title>
        </v-list-item>
        <v-list-item v-if = "isLoggedIn">
          <v-list-item-icon><v-icon>mdi-account-arrow-right</v-icon></v-list-item-icon>
          <v-list-item-title @click ="logoutUser" >Log Out</v-list-item-title>
        </v-list-item>

      </v-list-item-group>
    </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>{{$route.name}}</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
  export default {
    data: () => ({ drawer: null,
     items: [
        { title: 'Home', icon: 'mdi-home', link: "/dashboard" ,},
        { title: 'Task List', icon: 'mdi-briefcase', link: "/task" },
        { title: 'View Stats', icon: 'mdi-file-document', link: "/task-stats" },
      ],
    }),

    computed: {
      ...mapGetters(["isLoggedIn"])
    },
    methods: {
      ...mapActions(["logout"]),

      logoutUser(){
        this.logout()
      }
    }
  }
</script>
