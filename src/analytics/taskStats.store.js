const stats = {
    totalTask: 0,
    completedTasks: 0,
    deletedTasks: 0,
}

const applyEvent = (event) => {
    switch (event.event) {
        case 'TASK_CREATED':
            stats.totalTask += 1;
            break;

        case 'TASK_COMPLETED':
            stats.completedTasks += 1;
            break;

        case 'TASK_DELETED':
            stats.deletedTasks += 1;
            break;

        default:
            break;
    }
};

const getStats = () => {
    return {...stats}
};

const resetStats = () => {
    stats.completedTasks = 0;
    stats.deletedTasks = 0;
    stats.totalTasks = 0;
};

module.exports = {
    applyEvent,
    getStats,
    resetStats,
}