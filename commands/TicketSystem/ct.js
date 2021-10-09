const { Message,MessageEmbed,Client } = require("discord.js");
const { MessageButton } = require("discord-buttons")
const model = require("../../modules/TicketUsersModel");

module.exports = {
    name: "ct",
    /**
     * @param {Message} message
     * @param {Stirng[]} args
     * @param {Client} client
     */
    run: async(client,message,args) => {
    const data = await model.findOne({
        GuildID: message.guild.id,
        ChannelID: message.channel.id
    });


    if (data) {
        if (message.member.permissions.has("ADMINISTRATOR") || message.member.roles.cache.has(data.RoleID)) {
                const embed = new MessageEmbed()
            .setDescription(`**لإغلاق التذكرة اضغط على: 🔐**\n\n **لـ رفع التذكرة لـ الأدارة العليا إضغط على: 🚩** \n\n **لإعادة فتح التذكرة اضغط على: 🏷️**`)
            .setColor("RED")
            message.channel.send(embed).then(async secondmsg => {
                secondmsg.react('🔐')
                secondmsg.react('🏷️')
                secondmsg.react('🚩')

                client.on("messageReactionAdd", async(reaction,user) => {
                    if (reaction.message.id === secondmsg.id) {
                        if (user.id === data.UserID) {
                            if (reaction.emoji.name === "🔐") {
                                message.delete()
                                reaction.message.channel.updateOverwrite(data.UserID, {
                                    VIEW_CHANNEL: false
                                });
                                reaction.message.delete()
                                const channel = reaction.message.guild.channels.cache.get(reaction.message.channel.id)
                                channel.updateOverwrite(user.id, {
                                    VIEW_CHANNEL: false
                                })
                                const data1 = await model.findOne({ChanneID: reaction.message.channel.id});
                                if (data1) {
                                    data.Status = "closed";
                                    await data.save()
                                }
                                const embed1 = new MessageEmbed()
                                .setDescription(`Ticket Closed by <@${user.id}>`)
                                .setColor('YELLOW')
                                reaction.message.channel.send(embed1)
                        
                                const embeed2 = new MessageEmbed()
                                .setDescription(`\`\`\`Support team ticket controls\`\`\``)
                                const deleteb = new MessageButton()
                                .setLabel('Delete')
                                .setEmoji('⛔')
                                .setID('Delete')
                                .setStyle('gray')
                        
                                const openb = new MessageButton()
                                .setLabel('Open')
                                .setEmoji('🔓')
                                .setID('open')
                                .setStyle('gray')
                        
                                const transb = new MessageButton()
                                .setLabel('Transcript')
                                .setEmoji('📑')
                                .setStyle('gray')
                                .setID('tranb')
                                reaction.message.channel.send(embeed2, {buttons:[deleteb,openb,transb]})
                            } else if (reaction.emoji.name === "🏷️") {
                                if (data.Status === "closed") {
                                    reaction.message.delete()
                                    reaction.message.channel.updateOverwrite(data.UserID, {
                                        VIEW_CHANNEL: true,
                                        SEND_MESSAGES: true
                                    });
                                    reaction.message.channel.updateOverwrite(data.RoleID, {
                                        VIEW_CHANNEL: true,
                                        SEND_MESSAGES: true
                                    });
                                    const openembed = new MessageEmbed()
                                    .setDescription(`Ticket opened by <@${user.id}>`)
                                    .setColor('YELLOW')
                                    reaction.message.channel.send(openembed)
                                    data.Status = "open";
                                    await data.save()
                                }
                            } else if (reaction.emoji.name === "🚩") {
                                reaction.message.delete()
                                message.delete()
                                reaction.message.guild.channels.cache.get(reaction.message.channel.id).updateOverwrite(data.RoleID,{
                                    VIEW_CHANNEL: false
                                });
                    
                                reaction.message.channel.send(`**تم رفع التذكرة إلى الأدارة العليا.**`)
                            }
                        }
                    }
               })

            })
        }
    }
    }
}