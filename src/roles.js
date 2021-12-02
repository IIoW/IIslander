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
    {
        id: getRole('giveaway'),
        check: (userDto) => userDto.steamVia && userDto.steamVia !== 'owner',
    },
    {
        id: getRole('giveaway_available'),
        check: (userDto) => userDto.eligibleGiveaway && !userDto.steamVia,
    },
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
