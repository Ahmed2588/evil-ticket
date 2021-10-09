const { Message,MessageEmbed } = require("discord.js");
const usersmodel = require("../../modules/TicketUsersModel");

module.exports = {
    name: "rename",
    /**
     * @param {Message} message
     */
    run: async(client,message,args) => {
        const data = await usersdata.findOne({
            GuildID: message.guild.id,
            ChannelID: message.channel.id
        });
        if (data) {
            if (message.member.roles.cache.has(data.RoleID)) {
            message.channel.setName(args)
            message.delete()
            } else if (message.member.hasPermission("ADMINISTRATOR")) {
                message.channel.setName(args)
                message.delete()
            }
        }
    }
}