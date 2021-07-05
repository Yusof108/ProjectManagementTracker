const Task = require("../models/tasks");

const { reset } = require("nodemon");

let task = {}

module.exports = class API {
    static async fetchAllTask(req, res) {
        try {
            const tasks = await Task.find();
            res.status(200).json(tasks);
        } catch (err) {
            res.status(404).json({ message: err.message });
        }
    }


    static async fetchById(req, res) {
        const id = req.params.id;
        try {
            const task = await Task.findById(id);
            res.status(200).json(task);
        } catch (err) {
            res.status(404).json({ message: err.message });
        }
    }

    static async createTask(req, res) {
        let { title, description, deadline, createdBy, taskStatus, project, memberId } = req.body

        task = new Task({ title, description, deadline, createdBy, taskStatus, project, memberId })

        try {
            task.save().then(() => {
                return res.status(201).json({ message: "Post created successfully" });
            });

        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }


    static async updateTask(req, res) {
        const id = req.params.id;

        const newTask = req.body;
        try {
            await Task.findByIdAndUpdate(id, newTask);
            res.status(200).json({ message: "update successful" });
        } catch (err) {
            res.status(404).json({ message: err.message });
        }

    }

    static async deleteTask(req, res) {
        const id = req.params.id;

        try {
            const result = await Task.findByIdAndDelete(id);
            res.status(200).json({ message: "task deleted" });
        } catch (err) {
            res.status(404).json({ message: err.message });
        }
    }
}