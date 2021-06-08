const queue = require('async/queue');

// TODO think about order of arguments
const withQueue = async (callback, tasks, { onError, onSuccess }) => {
    const myQueue = await queue(async (task) => await callback(task));

    myQueue.error(onError);

    tasks.forEach(async (task) => {
        const data = await myQueue.push(task);

        onSuccess && onSuccess(data || {});
    });

    await myQueue.drain();
};

module.exports = withQueue;
