/*
*   This file contains the functions called when a specific vote type is called
*/

const Discord = require('discord.js')

exports.vote = async (client, message, ogMessage, voteMessage, invokingUser, args) => {
    message.react('👍'); message.react('👎'); message.react('⛔');
    const filter = (checkReaction, checkUser) => {
        let returnObject = false;
        if(checkReaction.emoji.name === "👍" || checkReaction.emoji.name === "👎"){
            returnObject = true;
        }
        if(checkReaction.emoji.name === "⛔"){
            if(checkUser.id === ogMessage.author.id || ogMessage.guild.member(checkUser).hasPermission(['ADMINISTRATOR']) || ogMessage.guild.member(checkUser).permissionsIn(ogMessage.channel).has(['MANAGE_MESSAGES'])) returnObject = true;
        }
        return returnObject
    };
    const reactionCollector = message.createReactionCollector((r,u)=>true, {time: parseInt(args[2])*1000});
    reactionCollector.on('collect', (newReaction, newUser) => {
    if(!filter(newReaction, newUser)){
        newReaction.users.remove(newUser).then(mr=>{return}).catch(()=>{})
    }else if(filter(newReaction, newUser)){
        if(newReaction.emoji.name === "⛔" && newUser.id != client.user.id) reactionCollector.stop();
    }
    });
    reactionCollector.on('end', (collected, reason) => {
        let yes = collected.get('👍').count;
        let no = collected.get('👎').count;
        message.delete().catch(()=>{});
        message.channel.send(new Discord.MessageEmbed()
            .setTitle(yes < no ? 'The vote has been rejected.' : yes == no ? 'The vote was a tie.' : 'The vote was a success!')
            .setColor(yes < no ? '#ff3030' : yes == no ? '#adadad' : '#47ff6c')
            .setDescription(`👍's: ${yes-1}\n👎's: ${no-1}\n${yes < no ? `👎's won by ${Math.abs(yes-no)} votes` : yes == no ? 'They are equal' : `👍's won by ${Math.abs(no-yes)} votes`}`)
            .addField(`Message content`, `${voteMessage.content}`, true)).then(replyMsg => {
        }).catch(()=>{});
    });
};