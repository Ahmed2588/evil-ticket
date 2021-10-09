const { Message,MessageEmbed } = require("discord.js");
const usersmodel = require("../../modules/TicketUsersModel");

module.exports = {
    name: "delete",
    /**
     * @param {Message} message
     * @param {Client} client
     */
    run: async(client,message,args) => {
        const data = await usersmodel.findOne({
            GuildID: message.guild.id,
            ChannelID: message.channel.id
        });
        if (data) {
        if (message.member.roles.cache.has(data.RoleID)) {
        message.delete()
                const embed = new Discord.MessageEmbed()
                .setDescription("هذه التذكرة سوف يتم إغلاقها بعد 5 ثواني")
                .setColor("RED")
       message.channel.send(embed)
        setTimeout(() => {
        message.channel.delete()
        }, 5000)
        } else if (message.member.hasPermission("ADMINISTRATOR")) {
        message.delete()
                const embed = new Discord.MessageEmbed()
                .setDescription("هذه التذكرة سوف يتم إغلاقها بعد 5 ثواني")
                .setColor("RED")
    message.channel.send(embed)
        setTimeout(() => {
        message.channel.delete()
        }, 5000)
        }
        }
    }
}