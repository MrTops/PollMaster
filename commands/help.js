const Discord = require('discord.js');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./config.json'));
const { randHexColor } = require('../util/randHex');

exports.run = async (client, message, args) => {
    message.author.send(new Discord.MessageEmbed()
    .setTitle(`Help for ${message.author.username}.`)
    .setDescription(`${config.Version}v | Prefix "${config.Prefix}" | Created by DevTops`)
    .setColor(randHexColor())
    .setTimestamp()
    .setFooter(`Proudly part of the \`\`Tops' Bots\`\` discord bot collection, created by DevTops`)
    .setAuthor(`@DevTops#9999`, 'https://cdn.discordapp.com/attachments/690025470162632704/727491074884370563/ScriptTopsPFP.png', 'https://github.com/MrTops')
    .addField('General Info', '\u200b')
    .addField('What does this do', `This bot offers a couple ways to start polls, and different types of polls in the near future.`, true)
    .addField('Who made this bot', 'incase you didn\'t see, @DevTops#9999 made this bot.', true)
    .addField('I like programming, where can I find the source?', 'https://github.com/MrTops/PollMaster here!', true)
    .addField('\u200b', '\u200b')
    .addField('Using The Bot', '\u200b')
    .addField(`${config.Prefix}vote <mentioned_user or message_id> [vote_type (just put vote) default: vote] [length_in_seconds default: 600]`, `generates a poll with from the message of message_id or the last message sent by the mentioned user. The mentioned user cannot be you.`, true)
    .addField(`vote *with reaction of* \":ballot_box:\"`, `After reacting it will ask for input through dms, please follow the prompts. You must beable to speak in the channel.`, true)).catch(async () => {
        await message.channel.send(`${message.author.username} I couldn't send you a dm, please open your dms.`).catch(()=>{}).delete({timeout: 10000}).catch(()=>{});
    });
};

exports.config = {
    command: "help",
    aliases: [],
    description: "Help command",
    usage: "vote"
}