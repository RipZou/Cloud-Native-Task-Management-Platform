const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true,
    },

    completed: {
        type: Boolean,
        default: false,
    },

    dueAt: {
        type: Date,
        default: null,
    },

    reminderSent: {
        type: Boolean,
        default: false,
    },

    overdueSent: {
        type: Boolean,
        default: false,
    }





}, { timestamps: true, })

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;