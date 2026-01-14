const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true, // 非常重要，后面你会感谢我
    },

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