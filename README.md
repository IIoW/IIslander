# IIslander

The IIslander Discord bot for the IIslands of War Discord server

> Note: This bot is a WIP.

#### Table of Contents:

-   [Features](#features)
    -   [XP](#xp)
    -   [Actions](#actions)
    -   [Moderation](#moderation)
    -   [Server Management](#server-management)
    -   [DM Commands](#dm-commands)
-   [Self Hosting](#self-hosting)
    -   [First Time Setup](#first-time-setup)
    -   [Running the Bot](#running-the-bot)

## Features

IIslander has a wide range of features for the IIslands of War Discord server. Some of them are still under development. Please see the [the projects tab](https://github.com/IIoW/IIslander/projects/1?fullscreen=true) for progress on features.

### XP

-   Rank Roles
-   Crystals (Award xp)
-   Star board
-   Channel modes (different xp in different channels)
-   Level up messages

### Actions

-   Reactions
    -   Boom (delete message)
    -   Pin
-   User (xp) and mod perms
-   Preview message links

## Moderation

-   Timeout
-   Warns
    -   Ability to give out warns by a mod and automatically
    -   Generic responses
-   Punishment
    -   Different severities
    -   Remove xp

## Server Management

-   Roles
-   Messages
    -   Welcome messages
-   Factions
-   Keys
    -   Giveaways
    -   Steam owner role
-   Activity leaderboard
-   Faction list
-   Faction achievement list
-   Mod commands
    -   Nick set and reset
        -   Clean nicks
    -   Penalize
    -   Warn
    -   Timeout
    -   Mod help

## DM Commands

-   Join faction
-   View factions
-   Subscriber role
-   Tester role
-   Tweet role
-   Mac and windows roles
-   Spoilores role
-   Steam key
-   Steam owner

## Self Hosting

This bot was not really designed to be used outside of the IIsland of War server, but we are not stopping you from trying.

To run the bot your going to need [git](https://git-scm.com/), [node.js v16.x](https://nodejs.org/en/) and [yarn](https://yarnpkg.com/).

### First Time Setup

First clone the repo from github and cd into the folder.

```sh
git clone https://github.com/IIoW/IIslander
cd IIslander
```

Next install the dependencies using yarn.

```sh
yarn
```

Next copy the file `.env.example` to a new file called `.env`. Fill out the values.

### Running the Bot

Now the bot is setup, simply run `yarn start` to run it.
