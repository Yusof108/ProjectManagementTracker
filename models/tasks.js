const mongoose = require("mongoose");
const current = new Date();
const dateCreated = current.getDate() + "-" + (current.getMonth() + 1) + "-" + current.getFullYear();

const postSchema = mongoose.Schema({
    title: String,
    description: String,
    deadline: String,
    project: {
        projectId: String,
        projectName: String
    },
    createdBy: {
        userId: String,
        name: String,
    },
    taskStatus: {
        type: String,
        default: "Available",
    },
    memberId: {},
    created: {
        type: String,
        default: dateCreated,
    },

});

module.exports = mongoose.model("Task", postSchema);