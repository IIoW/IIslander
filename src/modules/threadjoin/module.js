const subscriptions = new Map();

subscriptions.set('threadCreate', async (client, thread) => {
    if (thread.joinable && !thread.joined) {
        await thread.join();
    }
});

const enabled = true;

export { subscriptions, enabled };
