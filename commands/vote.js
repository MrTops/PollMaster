/*
*   The vote command, the basis of the bot
*/

const Discord = require('discord.js')
const { randHexColor } = require('../util/randHex');
const { log } = require('../util/log');
const VoteType = require('../voteType');

exports.run = async (client, message, args) => {
    //vote command
    try{

        let voteMessage = message.mentions.users.array().length == 0 ? await message.channel.messages.fetch(args[0]).catch(()=>{}) : message.mentions.users.array()[0].id != message.author.id ? message.guild.member(message.mentions.users.array()[0]).lastMessage : "NO_MENTION_SELF";
        
        if(!voteMessage){
            message.channel.send(new Discord.MessageEmbed()
                .setTitle(`Error occurred for ${message.author.username}!`)
                .setColor(`#ff3030`)
                .setDescription(`Unable to find message`))
            .then(msg => {msg.delete({timeout: 15000})})
            .catch(()=>{});
        }else if(voteMessage === "NO_MENTION_SELF"){
            message.channel.send(new Discord.MessageEmbed()
                .setTitle(`Error occurred for ${message.author.username}!`)
                .setColor(`#ff3030`)
                .setDescription(`You cannot use the mention method to vote on your own message, try the 🗳️ reaction or use message id.`))
            .then(msg => {msg.delete({timeout: 15000})})
            .catch(()=>{});
            return;
        }else{
            if(!voteMessage.guild.member(message.author).permissionsIn(voteMessage.channel).has(['SEND_MESSAGE'])){
                message.author.send(new Discord.MessageEmbed()
                    .setTitle(`Error occurred for ${message.author.username}!`)
                    .setColor(`#ff3030`)
                    .setDescription(`You need the permission \`\`SEND_MESSAGE\`\`.`))
                .then(msg => {msg.delete({timeout: 15000})})
                .catch(()=>{});
                return;
            }

            if(!args[1]) args[1] = 'vote'
            if(!args[2]) args[2] = "600"
            if(!VoteType[args[1]]){
                message.channel.send(new Discord.MessageEmbed()
                    .setTitle(`Error occurred for ${message.author.username}!`)
                    .setColor(`#ff3030`)
                    .setDescription(`There is not a vote type of \`\`${args[1]}\`\`, valid vote types can be found with \`\`help voteTypes\`\`.`))
                .then(msg => {msg.delete({timeout: 15000})})
                .catch(()=>{});
            }else{
                message.channel.send(new Discord.MessageEmbed()
                    .setTitle(voteMessage.author.id === message.author.id ? `Vote called by ${message.author.username}.` : `Vote called by ${message.author.username} for message sent by ${voteMessage.author.username}`)
                    .setColor(randHexColor())
                    .setDescription(`A vote of the type \`\`${args[1]}\`\` has been called.`)
                    .addField(`Message content`, `${voteMessage.content}`, true)).then(replyMsg => {
                        VoteType[args[1]](client, replyMsg, message, voteMessage, message.author, args);
                }).catch(()=>{});
            }
        }
    }catch (e) {
        message.channel.send(new Discord.MessageEmbed()
            .setTitle(`Error occurred for ${message.author.username}!`)
            .setColor(`#ff3030`)
            .setDescription(`An error occurred when calling a vote! If this error persists please let a developer know.`))
        .then(msg => {msg.delete({timeout: 15000})})
        .catch(()=>{});
        log(e);
    }
};

exports.config = {
    command: "vote",
    aliases: [],
    description: "Call a vote by either mentioning a user *this votes on their last message* or giving a message id.",
    usage: "vote (mention or message_id) (vote type, default 'vote')"
}