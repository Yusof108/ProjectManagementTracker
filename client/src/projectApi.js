import axios from "axios";
const url = "http://localhost:5000/api/project";

export default class PRO {
    static async fetchAllProject() {
        const res = await axios.get(url);
        return res.data;
    }

    static async fetchProjectById(id) {
        const res = await axios.get(`${url}/${id}`);
        return res.data;
    }

    static async addProject(project) {
        const res = await axios.post(url, project);
        console.log(project)
        return res.data;

    }

    static async editProject(id, project) {
        const res = await axios.patch(`${url}/${id}`, project);
        return res.data;
    }
    static async deleteProject(id, project) {
        const res = await axios.delete(`${url}/${id}`);
        return res.data;
    }

}