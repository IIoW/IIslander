export default {
    token: process.env.TOKEN,
    defaultGuild: process.env.DEFAULT_GUILD,
    channels: new Map([
        ['notifications', process.env.CHANNEL_NOTIFICATION],
        ['starboard', process.env.CHANNEL_STARBOARD],
    ]),
    roles: new Map([
        ['cooldown_tier1bronze', process.env.ROLE_COOLDOWN_1],
        ['cooldown_tier2silver', process.env.ROLE_COOLDOWN_2],
        ['cooldown_tier3gold', process.env.ROLE_COOLDOWN_3],
        ['cooldown_tier4diamond', process.env.ROLE_COOLDOWN_4],
        ['cooldown_tier5crystal', process.env.ROLE_COOLDOWN_5],
        ['timeoutChair', process.env.ROLE_TIMEOUT],
    ]),
};
