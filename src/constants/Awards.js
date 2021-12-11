import Levels from './Levels';
import Mod from './Mod';

export const xpReward = {
    tier1bronze: 200,
    tier2silver: 500,
    tier3gold: 1000,
    tier4diamond: 2000,
    tier5crystal: 4000,
    tier6dev: 10000,
};

export const xpRewardDonor = {
    tier1bronze: 20,
    tier2silver: 50,
    tier3gold: 100,
    tier4diamond: 200,
    tier5crystal: 400,
    tier6dev: 0,
};

export const xpMultiplier = {
    tier1bronze: 0,
    tier2silver: 5,
    tier3gold: 10,
    tier4diamond: 15,
    tier5crystal: 20,
    tier6dev: 50,
};

export const xpCooldown = {
    tier1bronze: 4 * 60 * 60 * 1000,
    tier2silver: 12 * 60 * 60 * 1000,
    tier3gold: 24 * 60 * 60 * 1000,
    tier4diamond: 2 * 24 * 60 * 60 * 1000,
    tier5crystal: 3 * 24 * 60 * 60 * 1000,
    tier6dev: 5 * 24 * 60 * 60 * 1000,
    swearing: 10 * 60 * 1000,
    everyoneping: 60 * 60 * 1000,
};

export const emojiStarValue = {
    downvote: -3,
    upvote: 10,
    tier1bronze: 15,
    tier2silver: 25,
    tier3gold: 50,
    tier4diamond: 75,
    tier5crystal: 100,
    tier6dev: 100,
};

export const emojiStarBotRequired = {
    downvote: false,
    upvote: false,
    tier1bronze: true,
    tier2silver: true,
    tier3gold: true,
    tier4diamond: true,
    tier5crystal: true,
    tier6dev: true,
};

/** Requirements to give out awards. */
export const xpRoleRequirement = {
    tier1bronze: { user: Levels.RARE, mod: Mod.ENFORCER },
    tier2silver: { user: Levels.EPIC, mod: Mod.ENFORCER },
    tier3gold: { user: Levels.LEGENDARY, mod: Mod.ENFORCER },
    tier4diamond: { user: Levels.INTERSTELLAR, mod: Mod.ENFORCER },
    tier5crystal: { user: Levels.ETHEREAL, mod: Mod.ENFORCER },
    tier6dev: { user: Infinity, mod: Mod.DEVELOPER },
};

export const starBoardThreshold = 100;
