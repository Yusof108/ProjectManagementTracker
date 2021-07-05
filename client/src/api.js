import axios from "axios";
const url = "http://localhost:5000/api/task";
const userUrl = "http://localhost:5000/api/user"

export default class API {
    static async fetchAllTask() {
        const res = await axios.get(url);
        return res.data;
    }

    static async fetchAllUser() {
        const res = await axios.get(userUrl);
        return res.data
    }

    static async fetchTaskById(id) {
        const res = await axios.get(`${url}/${id}`);
        return res.data;
    }

    static async addTask(task) {
        const res = await axios.post(url, task);
        return res.data;

    }

    static async editTask(id, task) {
        const res = await axios.patch(`${url}/${id}`, task);
        return res.data;
    }
    static async deleteTask(id, task) {
        const res = await axios.delete(`${url}/${id}`);
        return res.data;
    }

}