import { userDb } from '../../../util';
import config from '../../../config';
import { addXp } from '../../../xpHandling';

/**
 *
 * @param {import('discord.js').VoiceState} state
 */
function getVoiceMultiplier(state) {
    let multiplier = 2;
    if (state.deaf) multiplier -= 0.5; // because mute is always true if deaf
    if (state.mute) multiplier -= 1;
    if (state.streaming) multiplier += 1;
    if (state.selfVideo) multiplier += 2;
    return multiplier;
}

/**
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').VoiceState} oldState
 * @param {import('discord.js').VoiceState} newState
 * @return {Promise<void>}
 */
export default async function voiceStateUpdate(client, oldState, newState) {
    if (newState.guild.id !== config.defaultGuild) return;
    const userDto = userDb.get(newState.member.id);
    const now = Date.now();

    if (!oldState.channelId) {
        userDto.voiceTimeStampJoin = now;
        userDto.voiceXpMultiplier = getVoiceMultiplier(newState);
    } else {
        await addXp(
            newState.member,
            ((now - userDto.voiceTimeStampJoin) / 1000) * userDto.voiceXpMultiplier
        );
        userDto.voiceTimeStampJoin = now;
        userDto.voiceXpMultiplier = getVoiceMultiplier(newState);
    }

    userDb.set(newState.member.id, userDto);
}
