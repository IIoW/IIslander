import { MessageEmbed } from 'discord.js';
import ResponseDto from '../../../dto/ResponseDto';
import { makeTitle, responseDb } from '../../../util';

const info = {
    name: 'ar',
    desc:
        'Manage auto responses!' +
        '\nar create <name> - Create an auto response with the given name.' +
        '\nar delete <name> - Delete an auto response with the given name.' +
        '\nar list - List all auto responses.' +
        '\nar view <name> - View an existing auto response.' +
        '\nar edit title <name> <new title> - Edits the title of an existing auto response.' +
        '\nar edit response <name> <new response> - Edits the response of an existing auto response.' +
        '\nar trigger add <name> <new trigger> - Adds a new trigger to an existing auto response.' +
        '\nar trigger remove <name> <old trigger> - Removes an old trigger from an existing auto response.' +
        '',
    level: 1,
};

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} message
 * @param {string[]} args
 */
// eslint-disable-next-line no-unused-vars
async function fun(client, message, args) {
    const subCommand = args.shift();
    if (!subCommand) return message.reply('Choose a valid sub-command.');
    switch (subCommand.toLowerCase()) {
        case 'create':
        case 'make':
        case 'new':
        case 'add': {
            const name = args.shift().toLowerCase();
            if (responseDb.has(name))
                return message.reply(`Auto response \`${name}\` already exists.`);
            const responseDto = new ResponseDto(
                [],
                false,
                'This is a default response.',
                'Default Title'
            );
            responseDb.set(name, responseDto);
            await message.reply(`Ok created the auto response \`${name}\`!`);
            break;
        }

        case 'delete':
        case 'rm':
        case 'remove': {
            const name = args.shift().toLowerCase();
            if (!responseDb.has(name))
                return message.reply(`Auto response \`${name}\` does not exist.`);
            responseDb.delete(name);
            await message.reply(`Ok deleted the auto response \`${name}\`!`);
            break;
        }

        case 'list':
        case 'ls': {
            const embed = new MessageEmbed()
                .setTitle('Auto Responses')
                .setDescription(`Total auto responses: ${responseDb.size}`);
            responseDb.forEach((response, name) => {
                embed.addField(
                    name,
                    `${makeTitle(response.title)}\n\n${response.response}\n\n**Triggers:**\n${
                        response.trigger.join('\n') || 'None!'
                    }`,
                    true
                );
            });
            await message.reply({ embeds: [embed] });
            break;
        }

        case 'view':
        case 'show':
        case 'preview': {
            const name = args.shift().toLowerCase();
            if (!responseDb.has(name))
                return message.reply(`Auto response \`${name}\` does not exist.`);
            const responseDto = responseDb.get(name);
            await message.reply(`${makeTitle(responseDto.title)}\n\n${responseDto.response}`);
            break;
        }

        case 'edit':
        case 'modify':
        case 'set': {
            const editCommand = args.shift();
            if (!editCommand) return message.reply('Choose a valid edit action.');
            const name = args.shift().toLowerCase();
            if (!responseDb.has(name))
                return message.reply(`Auto response \`${name}\` does not exist.`);
            const responseDto = responseDb.get(name);
            const newArg = args.join(' ');
            switch (editCommand.toLowerCase()) {
                case 'title': {
                    if (!newArg) return message.reply('Please provide a valid title.');
                    responseDto.title = newArg;
                    await message.reply(`Got it! New title set to: \n${makeTitle(newArg)}`);
                    responseDb.set(name, responseDto);
                    break;
                }
                case 'response':
                case 'desc':
                case 'description':
                case 'content':
                case 'message':
                case 'msg': {
                    if (!newArg) return message.reply('Please provide a valid response.');
                    responseDto.response = newArg;
                    await message.reply(`Got it! New title set to: \n${newArg}`);
                    responseDb.set(name, responseDto);
                    break;
                }
                default:
                    await message.reply('Please choose a valid edit action.');
                    break;
            }
            break;
        }

        case 'trigger':
        case 'trig':
        case 'action':
        case 'event': {
            const addOrRemove = args.shift();
            if (!addOrRemove)
                return message.reply('Specify if you would like to add or remove a trigger.');
            const name = args.shift().toLowerCase();
            if (!responseDb.has(name))
                return message.reply(`Auto response \`${name}\` does not exist.`);
            const responseDto = responseDb.get(name);
            const trigger = args.join(' ').toLowerCase();
            if (!trigger) return message.reply('Please provide a valid trigger.');
            if (responseDto.isRegex)
                return message.reply("This auto response's triggers can't be modified.");
            switch (addOrRemove.toLowerCase()) {
                case 'add':
                case 'create':
                case 'make':
                case '+': {
                    if (responseDto.trigger.includes(trigger))
                        return message.reply('This trigger already exists!');
                    await message.reply(`Got it! Added trigger: ${trigger}`);
                    responseDto.trigger.push(trigger);
                    responseDb.set(name, responseDto);
                    break;
                }
                case 'remove':
                case 'rm':
                case 'delete':
                case 'destroy':
                case '-': {
                    const index = responseDto.trigger.indexOf(trigger);
                    if (index < 0) return message.reply('This trigger does not exist!');
                    await message.reply(`Got it! Removed trigger: ${trigger}`);
                    responseDto.trigger.splice(index, 1);
                    responseDb.set(name, responseDto);
                    break;
                }
                default:
                    await message.reply(
                        'Please specify if you would like to add or remove a trigger.'
                    );
                    break;
            }
            break;
        }

        default:
            await message.reply('Please choose a valid sub-command.');
            break;
    }
    return null;
}

export { info, fun };
