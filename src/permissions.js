import { xpRoleRequirement } from './constants/Awards';
import Levels from './constants/Levels';
import Mod from './constants/Mod';
import Roles from './constants/Roles';
import { userDb } from './util';

/** The requirements for if you can pin or not. */
const allowPin = { user: Levels.CELESTIAL, mod: Mod.ENFORCER };

/**
 * Gets an array of the user's roles by name.
 * @param {import('discord.js').GuildMember} member - The member to get the roles of.
 * @returns {string[]} An array with the user's role names.
 */
function getUserRoles(member) {
    return member.roles.cache.map((role) => role.name);
}

/**
 * Get a user's mod level.
 * @param {import('discord.js').GuildMember} member - The member to get the users mod perms for.
 * @returns {number} The user's numeric mod level.
 */
export function getUserMod(member) {
    try {
        const userRoles = getUserRoles(member);
        return Object.entries(Mod).reduce((p, c) => {
            const roleName = Roles[c[0]];
            if (!roleName) return p;
            if (userRoles.includes(roleName)) return Math.max(p, c[1]);
            return p;
        }, 0);
    } catch (e) {
        return 0;
    }
}

/**
 * Get a user's user (xp) and mod level.
 * @param {*} member - The member to get levels for.
 * @returns An object with the user's user and mod level.
 */
export function getUserLevel(member) {
    const { level: user } = userDb.get(member.id);
    const mod = getUserMod(member);
    return {
        mod,
        user,
    };
}

/**
 * Whether or not a user can pin something.
 * @param {import('discord.js').GuildMember} member - The member to check.
 * @returns {boolean} Whether or not the user can pin.
 */
export function pin(member) {
    const { user, mod } = getUserLevel(member);
    return !(user < allowPin.user && mod < allowPin.mod);
}

/**
 * Get the awards a user can use.
 * @param {import('discord.js').GuildMember} member
 * @returns {string[]} An array of the names of awards the user can give.
 */
export function awards(member) {
    const { user, mod } = getUserLevel(member);
    return Object.entries(xpRoleRequirement).reduce(
        (p, [name, { mod: modRequirement, user: userRequirement }]) => {
            if (user < userRequirement && mod < modRequirement) return p;
            p.push(name);
            return p;
        },
        []
    );
}

export function permissionFor(userDto, member) {
    return {
        awardLevel: awards(member),
        pin: pin(member),
    };
}
