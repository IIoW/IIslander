import config from './config';
import Factions from './constants/Factions';
import Levels from './constants/Levels';
import { getRole, userDb } from './util';

const roleInfo = [
    // Permanent roles (status, achievements, etc.)
    ...(process.env.ROLES_PERMANENT?.split(',') ?? []).map((r) => ({
        id: r,
        check: () => true,
    })),
    // Faction roles
    ...Object.entries(Factions).map(([name, faction]) => ({
        id: faction.role,
        check: (userDto) => userDto.faction === name,
    })),
    // Level roles
    ...[...Array(81)].map((_, i) => ({
        name: `Level ${i}`,
        check: (userDto) => {
            if (userDto.level >= 80 && i === 80) return true;
            return userDto.level === i;
        },
    })),
    // Rank roles
    ...Object.values(Levels)
        .reverse()
        .map((level, i, arr) => ({
            id: process.env.ROLES_RANKS?.split(',')[i],
            check: (userDto) => userDto.level >= level && userDto.level < (arr[i + 1] ?? Infinity),
        })),
    // Steam Owner
    {
        id: getRole('steamowner'),
        check: (userDto) => userDto.steamVia === 'owner',
    },
    // Giveaway Roles
    ...(process.env.ROLES_GIVEAWAYS?.split(',') || []).map((r, i) => ({
        id: r,
        /**
         *
         * @param {import('./dto/UserDto').default} userDto
         * @param {import('discord.js').GuildMember} member
         */
        check: (userDto, member) => {
            if (!userDto.eligibleGiveaway && userDto.steamVia && userDto.steamVia !== 'owner') {
                // This uses has been imported from the old db and we don't know what giveaway they won.
                const giveawayRegex = /^[\w ]+\((\d)\)$/;
                const giveawayRoles = member.roles.cache
                    .filter((role) => role.name.match(giveawayRegex))
                    .map((role) => parseInt(role.name.match(giveawayRegex)?.[1], 10))
                    .filter((num) => num || !Number.isNaN(num));
                // Theres not a role or too many roles that match.
                if (giveawayRoles.length === 1) {
                    const newUserDto = userDb.get(member.id);
                    [newUserDto.eligibleGiveaway] = giveawayRoles;
                    // We set the original one too so it doesn't have to be done again.
                    [userDto.eligibleGiveaway] = giveawayRoles;
                    userDb.set(member.id, newUserDto);
                }
                return member.roles.cache.has(r);
            }
            return (
                userDto.eligibleGiveaway === i + 1 &&
                (!userDto.steamVia || userDto.steamVia !== 'owner')
            );
        },
    })),
];

/**
 * Ensures a user has all the necessary roles.
 * @param {import('discord.js').User|import('discord.js').GuildMember} user - The user to run on.
 * @returns {boolean} Whether or not the check succeeded.
 */
const ensureRoles = async (user) => {
    if (!user?.id || !user?.client) return false;
    const member = await user.client.guilds.cache.get(config.defaultGuild).members.fetch(user.id);
    if (!member) return false;
    try {
        const userDto = userDb.get(user.id);
        const [toAdd, toRemove] = roleInfo.reduce(
            ([add, remove], roleData) => {
                const role =
                    member.guild.roles.cache.get(roleData.id) ||
                    member.guild.roles.cache.find((r) => r.name === roleData.name);
                // This shouldn't happen, but just in case.
                if (!role) return [add, remove];
                if (roleData.check(userDto, member)) {
                    if (!member.roles.cache.has(role.id)) add.push(role);
                } else if (member.roles.cache.has(role.id)) remove.push(role);
                return [add, remove];
            },
            [[], []]
        );
        if (toAdd.length > 0) await member.roles.add(toAdd);
        if (toRemove.length > 0) await member.roles.remove(toRemove);
        return true;
    } catch (e) {
        return false;
    }
};

export default ensureRoles;
