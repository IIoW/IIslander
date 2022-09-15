import { EmbedBuilder, PermissionsBitField } from 'discord.js';
import config from '../../config';

const subscriptions = new Map();
subscriptions.set('messageCreate', async (client, message) => {
    if (message.author.bot) return;
    const messages = [
        ...message.content.matchAll(
            /https?:\/\/(?:(?:ptb|canary)\.)?discord(?:app)?\.com\/channels\/\d+\/(\d+)\/(\d+)\/?/gi
        ),
    ].map((l) => ({ channel: l[1], message: l[2] }));
    if (!messages.length) return;

    if (message.member) await message.guild.members.fetch(message.author);

    const sent = new Set();
    for (const msgData of messages) {
        // Avoid sending the same message twice
        /* eslint-disable-next-line no-continue */
        if (sent.has(msgData.message)) continue;
        sent.add(msgData.message);
        // links need to be handled in order
        /* eslint-disable no-await-in-loop */
        const msg = await client.channels.cache
            .get(msgData.channel)
            ?.messages.fetch(msgData.message)
            .catch(() => null);
        if (!msg) return;
        if (msg.guildId !== config.defaultGuild) return;
        if (
            !msg.channel
                .permissionsFor(message.author)
                ?.has([
                    PermissionsBitField.Flags.ViewChannel,
                    PermissionsBitField.Flags.ReadMessageHistory,
                ])
        )
            return;
        if (!msg.member) await msg.guild.members.fetch(msg.author);

        const embed = new EmbedBuilder()
            .setAuthor({
                name: msg.member.displayName,
                iconURL: msg.member.displayAvatarURL(),
                url: msg.url,
            })
            .setColor(msg.member.displayColor)
            .setFooter({ text: `Requested by ${message.member.displayName}` })
            .setTimestamp(msg.createdTimestamp);

        const additionalEmbeds = [];
        if (msg.content) embed.setDescription(msg.content);
        if (msg.attachments.size) {
            const imgs = msg.attachments.filter((a) => a.contentType?.startsWith('image/'));
            Array.from(imgs.entries()).forEach(([, a], i) => {
                if (i === 0) return embed.setImage(a.url);
                if (i > 3) return null;
                return additionalEmbeds.push(new EmbedBuilder().setImage(a.url).setURL(msg.url));
            });
            embed.addFields({
                name: 'Attachments:',
                value: msg.attachments.map((a) => `[${a.name}](${a.url})`).join('\n'),
            });
        }

        await message.channel.send({ embeds: [embed, ...additionalEmbeds] });
    }
});

const enabled = true;

export { subscriptions, enabled };
