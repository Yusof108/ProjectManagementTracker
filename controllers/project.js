const Project = require("../models/Project");
const { reset } = require("nodemon");

let project = {}

module.exports = class PRO {
    static async fetchAllProject(req, res) {
        try {
            const project = await Project.find();
            res.status(200).json(project);
        } catch (err) {
            res.status(404).json({ message: err.message });
        }
    }

    static async fetchProjectById(req, res) {
        const id = req.params.id;
        try {
            const project = await Project.findById(id);
            res.status(200).json(project);
        } catch (err) {
            res.status(404).json({ message: err.message });
        }
    }

    static async createProject(req, res) {
        let { title, description, deadline, createdBy, projectStatus, coCreate, memberId, taskId } = req.body

        project = new Project({ title, description, deadline, createdBy, projectStatus, coCreate, memberId, taskId })

        try {
            project.save().then(() => {
                return res.status(201).json({ message: "Post created successfully" });
            });

        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }


    static async updateProject(req, res) {
        const id = req.params.id;

        const newProject = req.body;
        try {
            await Project.findByIdAndUpdate(id, newProject);
            res.status(200).json({ message: "update successful" });
        } catch (err) {
            res.status(404).json({ message: err.message });
        }

    }

    static async deleteProject(req, res) {
        const id = req.params.id;

        try {
            const result = await Project.findByIdAndDelete(id);
            res.status(200).json({ message: "Project deleted" });
        } catch (err) {
            res.status(404).json({ message: err.message });
        }
    }
}