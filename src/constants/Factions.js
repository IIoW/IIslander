import config from '../config';

export default {
    strike: {
        fullName: 'Strike Coalition',
        joinMessages: [
            // strike being a 'family' or in general rather pointed towards the USSR
            'Welcome to Strike. Have fun with your comrades!',
            'Welcome to the Strike. We secure iislands by striking fear into our enemies.',
        ],
        channels: {
            chat: config.channels.get('faction-strike-chat'),
            submissions: config.channels.get('faction-strike-submissions'),
        },
        role: config.roles.get('faction_strike'),
        emote: '_S',
    },
    nova: {
        fullName: 'Nova Alliance',
        joinMessages: [
            // Joke about the 'We throw people into the core' stuff
            'Hello and Welcome to the Nova alliance. Please mind the gap between the iislands.',
        ],
        channels: {
            chat: config.channels.get('faction-nova-chat'),
            submissions: config.channels.get('faction-nova-submissions'),
        },
        role: config.roles.get('faction_nova'),
        emote: '_N',
    },
    prime: {
        fullName: 'Prime Federation',
        joinMessages: [
            // The gray hand is among us
            "Hello. So, you've entered the Prime Federation." +
                '\nYou know the rules (about our submission rate etc) and so do I.' +
                "\nPay attention that you don't get grabbed too tightly by the others.",
        ],
        channels: {
            chat: config.channels.get('faction-prime-chat'),
            submissions: config.channels.get('faction-prime-submissions'),
        },
        role: config.roles.get('faction_prime'),
        emote: '_P',
    },
};
