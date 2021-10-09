const { Message,MessageEmbed } = require("discord.js");

module.exports = {
    name: "ping",
    /**
     * @param {Message} message
     * @param {Stirng[]} args
     */
    run: async(client,message,args) => {
    const embed = new MessageEmbed()
    .setTitle("Pong 🏓")
    .setDescription(`Client ws ping : **${client.ws.ping}**MS`)
    .setColor("GREEN")

    message.channel.send(embed)
    }
}
