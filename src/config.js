export default {
    token: process.env.TOKEN,
    defaultGuild: process.env.DEFAULT_GUILD,
    channels: new Map([
        ['notifications', process.env.CHANNEL_NOTIFICATION],
        ['starboard', process.env.CHANNEL_STARBOARD],
        ['log', process.env.CHANNEL_LOG],
        ['tweets', process.env.CHANNEL_TWEETS],
        ['welcome', process.env.CHANNEL_WELCOME],
        ['just-chatting', process.env.CHANNEL_JUST_CHATTING],
        ['help', process.env.CHANNEL_HELP],
    ]),
    roles: new Map([
        ['cooldown_tier1bronze', process.env.ROLE_COOLDOWN_1],
        ['cooldown_tier2silver', process.env.ROLE_COOLDOWN_2],
        ['cooldown_tier3gold', process.env.ROLE_COOLDOWN_3],
        ['cooldown_tier4diamond', process.env.ROLE_COOLDOWN_4],
        ['cooldown_tier5crystal', process.env.ROLE_COOLDOWN_5],
        ['timeoutChair', process.env.ROLE_TIMEOUT],
        ['tweets', process.env.ROLE_TWEETS],
        ['spoilores', process.env.ROLE_SPOILORES],
    ]),
};
