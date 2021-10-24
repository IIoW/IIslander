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
        ['faction-chat', process.env.CHANNEL_FACTION_CHAT],
        ['steam-owner', process.env.CHANNEL_STEAM_OWNER],
        ['faction-strike-chat', process.env.CHANNEL_CHAT_STRIKE],
        ['faction-nova-chat', process.env.CHANNEL_CHAT_NOVA],
        ['faction-prime-chat', process.env.CHANNEL_CHAT_PRIME],
        ['faction-strike-submission', process.env.CHANNEL_CHAT_STRIKE],
        ['faction-nova-submission', process.env.CHANNEL_CHAT_NOVA],
        ['faction-prime-submission', process.env.CHANNEL_CHAT_PRIME],
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
        ['steamowner', process.env.ROLE_STEAMOWNER],
        ['faction_strike', process.env.ROLE_FACTION_STRIKE],
        ['faction_nova', process.env.ROLE_FACTION_NOVA],
        ['faction_strike', process.env.ROLE_FACTION_PRIME],
        ['windows', process.env.ROLE_WINDOWS],
        ['linux', process.env.ROLE_LINUX],
        ['mac', process.env.ROLE_MAC],
        ['subscriber', process.env.ROLE_SUBSCRIBER],
        ['tester', process.env.ROLE_TESTER],
    ]),
};
