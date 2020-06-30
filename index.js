/*
*   Copyright DevTops 2020
*   LibTard: Basic voting bot.
*/

//Require
const Discord = require('discord.js');
const { log } = require('./util/log');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./config.json'));
const prefix = config.Prefix;
const voteType = require('./voteType');
const { randHexColor } = require('./util/randHex')

//Instance bot
const client = new Discord.Client();


//Functions

//Load Commands
client.commands = new Discord.Collection();
fs.readdir('./commands/', (err, files) => {
    if (err) log(err);
    files.forEach(file => {
        let command = require(`./commands/${file}`);
        client.commands.set(command.config.command, command);
        command.config.aliases.forEach(alias => {
            client.commands.set(alias, command);
        });
    });
});

//events
client.once('ready', async () => {
    log(`Bot logged in as ${client.user.username} on ${client.guilds.cache.array().length} servers!`);
});

client.on('messageReactionAdd', async (messageReaction, user) => {
    if(messageReaction.emoji.name === "🗳️" && messageReaction.message.guild.member(user).permissionsIn(messageReaction.message.channel).has(['SEND_MESSAGES'])){
        try{
            messageReaction.remove().catch(()=>{});
            let ioReq = await user.send(new Discord.MessageEmbed()
                .setTitle(`Input request for ${user.username}.`)
                .setDescription(`Please specify a vote type | 1 min | default: \`\`vote\`\``)
                .setColor(randHexColor()))
            .catch(()=>{
                messageReaction.message.channel.send(`${user.username} I could not send you a dm, please turn them on!`).then(msg=>{
                    msg.delete({timeout:15000}).catch(()=>{});
                }).catch(()=>{});
            });
            let ioCollector = ioReq.channel.createMessageCollector(m => m.author.id === user.id, {time: 60000});
            ioCollector.on('collect', async m => {
                if(!voteType[m.content] && m.content !== " "){
                    user.send(`${user.username} That's not a valid input!`).then(msg=>{
                        msg.delete({timeout:7500}).catch(()=>{});
                    }).catch(()=>{});
                }else{
                    let selectedVoteType = !voteType[m.content] ? m.content: 'vote';
                    ioCollector.stop('COOL')
                    ioReq.delete().catch(()=>{});
                    //
                    messageReaction.remove().catch(()=>{});
                    ioReq = await user.send(new Discord.MessageEmbed()
                        .setTitle(`Input request for ${user.username}.`)
                        .setDescription(`Please specify an amount of time to run vote *in seconds*, *must be number* | 1 min | default: \`\`600\`\``)
                        .setColor(randHexColor()))
                    .catch(()=>{
                        messageReaction.message.channel.send(`${user.username} I could not send you a dm, please turn them on!`).then(msg=>{
                            msg.delete({timeout:15000}).catch(()=>{});
                        }).catch(()=>{});
                    });
                    ioCollector = ioReq.channel.createMessageCollector(m => m.author.id === user.id && !isNaN(m.content), {time: 60000});
                    ioCollector.on('collect', async m => {
                        let selectedAmountOfTime = m.content;
                        ioCollector.stop('COOL')
                        ioReq.delete().catch(()=>{});
                        //
                        let voteHolder = await messageReaction.message.channel.send(new Discord.MessageEmbed()
                        .setTitle(messageReaction.message.author.id === user.id ? `Vote called by ${user.username}.` : `Vote called by ${user.username} for message sent by ${messageReaction.message.author.username}`)
                        .setColor(randHexColor())
                        .setDescription(`A vote of the type \`\`${selectedVoteType}\`\` has been called.`)
                        .addField(`Message content`, `${messageReaction.message.content}`, true));

                        voteType[selectedVoteType](client, voteHolder, messageReaction.message, messageReaction.message, user, ['', selectedVoteType, selectedAmountOfTime]);
                        //
                    });
                    ioCollector.on('end', (collected, reason) => {
                        if(reason == "COOL") return;
                        user.send(`${user.username} The input request time'd out :(`).then(msg=>{
                            msg.delete({timeout:15000}).catch(()=>{});
                        }).catch(()=>{});
                        ioReq.delete().catch(()=>{});
                    });
                    //
                }
            });
            ioCollector.on('end', (collected, reason) => {
                if(reason == "COOL") return;
                user.send(`${user.username} The input request time'd out :(`).then(msg=>{
                    msg.delete({timeout:15000}).catch(()=>{});
                }).catch(()=>{});
                ioReq.delete().catch(()=>{});
            });
        }catch(err){
            log(err);
            messageReaction.message.channel.send(`An unexpected error occurred :(`).then(msg=>{msg.delete({timeout: 8000}).catch(()=>{})}).catch(()=>{});
        }
    }
});

client.on('message', async message => {
    if(!message.content.startsWith(prefix)) return;

    let args = message.content.split(' ');
    let command = args.shift().toLowerCase();
    command = command.slice(prefix.length);
    if(!client.commands.get(command)) return;
    let commandObject = client.commands.get(command);
    commandObject.run(client, message, args);
    message.delete().catch(()=>{});
});

//Login bot
client.login(config.Token);