import Roles from './constants/Roles';

const allowPin = [Roles.DEVELOPER, Roles.MINI_DEV, Roles.ENFORCER, Roles.ANCIENT, Roles.CELESTIAL];
const xpRoleRequirement = {
    tier1bronze: [Roles.RARE],
    tier2silver: [Roles.EPIC],
    tier3gold: [Roles.LEGENDARY, Roles.MYTHIC],
    tier4diamond: [Roles.INTERSTELLAR],
    tier5crystal: [Roles.MINI_DEV, Roles.ENFORCER, Roles.ANCIENT, Roles.CELESTIAL],
    tier6dev: [Roles.DEVELOPER],
};

/**
 *
 * @param {import('discord.js').GuildMember} member
 */
function getUserRoles(member) {
    return member.roles.cache.map((role) => role.name);
}

/**
 *
 * @param {import('discord.js').GuildMember} member
 */
export function pin(member) {
    return getUserRoles(member).some((role) => allowPin.includes(role));
}

/**
 * @param {import('discord.js').GuildMember} member
 */
export function awardLevel(member) {
    return (
        Math.max(
            ...getUserRoles(member).map((role) =>
                Math.max(...Object.values(xpRoleRequirement).map((roles) => roles.indexOf(role)))
            )
        ) + 1
    );
}
