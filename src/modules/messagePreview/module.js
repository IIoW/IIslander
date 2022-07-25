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

    for (const msgData of messages) {
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
            .setAuthor({ name: msg.member.displayName, iconURL: msg.member.displayAvatarURL() })
            .setDescription(msg.content)
            .setColor(msg.member.displayColor)
            .setFooter({ text: `Requested by ${message.member.displayName}` })
            .setTimestamp(msg.createdTimestamp);

        if (msg.attachments.size) {
            embed.setImage(msg.attachments.first().url);
            embed.addFields({
                name: 'Attachments:',
                value: msg.attachments.map((a) => `[${a.name}](${a.url})`).join('\n'),
            });
        }

        await message.channel.send({ embeds: [embed] });
    }
});

const enabled = true;

export { subscriptions, enabled };
