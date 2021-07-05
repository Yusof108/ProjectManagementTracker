const mongoose = require("mongoose");
const current = new Date();
const dateCreated = current.getDate() + "-" + (current.getMonth() + 1) + "-" + current.getFullYear();


const projectSchema = mongoose.Schema({
    title: String,
    description: String,
    deadline: String,
    projectStatus: {
        type: String,
        default: "Ready",
    },
    createdBy: {
        userId: String,
        name: String,
    },
    coCreate: {},
    memberId: {},
    taskId: {},
    created: {
        type: String,
        default: dateCreated,
    },
});

module.exports = mongoose.model("Project", projectSchema);