export default {
    token: process.env.TOKEN,
    defaultGuild: process.env.DEFAULT_GUILD,
    prefix: process.env.PREFIX,
    channels: new Map([
        ['notifications', process.env.CHANNEL_NOTIFICATION],
        ['starboard', process.env.CHANNEL_STARBOARD],
    ]),
};
