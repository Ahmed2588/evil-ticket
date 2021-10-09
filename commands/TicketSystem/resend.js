const { Message , Client, MessageEmbed } = require("discord.js")
const { MessageButton } = require("discord-buttons");
const model = require("../../modules/ticketModel")

module.exports = {
    name: "resend",
    /**
     * @param {Message} message
     * @param {Client} client
     */
    run: async(client,message,args) => {
    if (!message.member.hasPermission("ADMINISTRATOR")) return;
    const tdata = await model.findById(args[0])

    if (!tdata) {
        return message.react(":x:")
    } else {
        const channel = message.guild.channels.cache.find(c => c.id === tdata.ChannelID)

            const embed = new MessageEmbed()
            .setTitle(tdata.embedTitle)
            .setDescription(`أظغط على 📩 لـ فتح التذكرة`)
            .setColor("GREEN")
            .setFooter(message.guild.name,message.guild.iconURL({dynamic: true}))

            const ticketbutton = new MessageButton()
            .setLabel('Create ticket')
            .setEmoji('📩')
            .setID('create_button')
            .setStyle('gray')

            channel.send(embed, {button : ticketbutton}).then(async(msg) => {
                tdata.msgID = msg.id;
                await tdata.save();
            })
        
    }
    }
}