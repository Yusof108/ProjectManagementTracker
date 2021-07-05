import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import AddTask from '../views/AddTask.vue'
import Task from "../views/Task.vue"
import EditTask from "../views/EditTask.vue"
import TaskStats from "../views/TaskStats.vue"
import store from '../store'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'Home',
        component: Home,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/add-task',
        name: 'Add Task',
        component: AddTask,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/task',
        name: 'Task',
        component: Task,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/edit-task',
        name: 'Edit Task',
        component: EditTask,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/task-stats',
        name: 'Task Stats',
        component: TaskStats,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/about',
        name: 'About',
        component: () =>
            import ('../views/About.vue')
    },
    {
        path: '/register',
        name: 'Register',
        component: () =>
            import ('../views/Register.vue'),
        meta: {
            requiresGuest: true
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: () =>
            import ('../views/Login.vue'),
        meta: {
            requiresGuest: true
        }
    },
    {
        path: '/project',
        name: 'Project',
        component: () =>
            import ('../views/Project.vue'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/add-project',
        name: 'Add Project',
        component: () =>
            import ('../views/AddProject.vue'),
        meta: {
            requiresAuth: true
        }
    },

    {
        path: '/dashboard',
        name: 'Dashboard',
        component: () =>
            import ('../views/Dashboard.vue'),
        meta: {
            requiresAuth: true
        }
    }


]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})
router.beforeEach((to, from, next) => {

    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!store.getters.isLoggedIn) {
            //redirect to login page
            next('/login')
        } else {
            next()
        }
    } else if (to.matched.some(record => record.meta.requiresGuest)) {
        if (store.getters.isLoggedIn) {
            next('/dashboard')
        } else {
            next()
        }
    } else {
        next()
    }
})

export default router