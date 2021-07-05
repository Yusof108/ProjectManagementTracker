import axios from 'axios'
import API from '../api'
import router from '../router'

const state = {
    token: sessionStorage.getItem('token') || '',
    user: {},
    status: ''
}
const getters = {
    isLoggedIn: state => !!state.token,
    authState: state => state.status,
    user: state => state.user,

}
const actions = {
    //Register Users
    async register({
        commit
    }, userData) {
        commit('register_request')
        let res = await axios.post('http://localhost:5000/api/user/register', userData)
        if (res.data.success != undefined) {
            commit('register_success')
        }
        return res;
    },

    //Login User
    async login({
        commit
    }, user) {
        commit('auth_request')
        let res = await axios.post('http://localhost:5000/api/user/login', user)
        if (res.data.success) {
            const token = res.data.token
            const user = res.data.user

            //Store the token into sessionStorage
            sessionStorage.setItem('token', token)

            //set the axios defaults
            axios.defaults.headers.common['Authorization'] = token
            commit('auth_success', token, user)
        }
        return res;
    },

    //Get User Profile
    async getProfile({
        commit
    }) {
        commit('profile_request');
        let response = await axios.get('http://localhost:5000/api/user/profile')

        commit('user_profile', response.data.user)
        return response
    },
    //Logout the user
    async logout({
        commit
    }) {
        await sessionStorage.removeItem('token')
        commit('logout')
        delete axios.defaults.headers.common['Authorization']
        router.push('/login')
        return
    }



}

const mutations = {
    register_request(state) {
        state.status = 'loading'
    },

    register_success(state) {
        state.status = 'success'
    },
    auth_request(state) {
        state.status = 'loading'
    },
    auth_success(state, token, user) {
        state.token = token
        state.user = user
        state.status = 'success'
    },
    profile_request(state) {
        state.status = 'loading'
    },
    user_profile(state, user) {
        state.user = user
    },
    logout(state) {
        state.status = '',
            state.token = '',
            state.user = ''

    }

}
export default {
    state,
    getters,
    actions,
    mutations
}