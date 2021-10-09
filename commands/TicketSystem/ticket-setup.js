const { Message , MessageEmbed , Client } = require("discord.js")
const { MessageActionRow, MessageButton, MessageMenu  } = require("discord-buttons");
const ticketModel = require("../../modules/ticketModel")

let tickettitle;
let channelticket;
let parentID;
let whiteRole;
let __id;

module.exports = {
    name: "ticket-setup",
    /**
     * @param {Message} message
     * @param {Client} client
     */
    run: async(client,message,args) => {
    if (!message.member.permissions.has("ADMINISTRATOR")) return;
    const embed1 = new MessageEmbed()
    .setTitle("Ticket setup 📩")
    .setDescription("What is the title you want to put in the ticket?")
    .setFooter(client.user.tag,client.user.avatarURL())
    .setColor("GREEN")

    const button1 = new MessageButton()
    .setLabel("Cancel")
    .setStyle("gray")
    .setID("cancel_button")

    message.channel.send(`Follow the steps shown below`, { embed: embed1 }).then((msg) => {
        const filter = m => m.author.id === message.author.id;
        const Collector = message.channel.createMessageCollector(filter,{ time: 30000,max:1 })

        Collector.on("collect", async(collect) => {
            tickettitle = collect.content;
            collect.delete()
            Collector.stop()


            const embed2 = new MessageEmbed()
            .setTitle("Ticket setup 📩")
            .setDescription("What channel do you want to put the ticket in?, Please mention a channel or type channeID")
            .setFooter(client.user.tag,client.user.avatarURL())
            .setColor("GREEN")
            
            msg.edit(`Follow the steps shown below`,{embed: embed2})

            const filter = m => m.author.id === message.author.id;
            const Collector1 = message.channel.createMessageCollector(filter,{ time: 30000,max:1 })

            Collector1.on("collect", async(collect1) => {
            channelticket = collect1.mentions.channels.first() || message.guild.channels.cache.get(collect1.content);

            if (!channelticket) {
                msg.edit(`Installation not completed,Please try again later.`)
                collect1.delete()
                Collector1.stop()
            }
            collect1.delete()
            Collector1.stop()

            const embed3 = new MessageEmbed()
            .setTitle("Ticket setup 📩")
            .setDescription("What is the id of the category you want to open the tickets in?")
            .setFooter(client.user.tag,client.user.avatarURL())
            .setColor("GREEN")
            
            msg.edit(`Follow the steps shown below`, { embed: embed3 })

            const Collector2 = message.channel.createMessageCollector(filter,{ time: 30000,max:1 })

            Collector2.on("collect", async(collect2) => {
            parentID = collect2.content;
            collect2.delete()
            Collector2.stop()

            const embed4 = new MessageEmbed()
            .setTitle("Ticket setup 📩")
            .setDescription("What are the role that can control ticket?")
            .setFooter(client.user.tag,client.user.avatarURL())
            .setColor("GREEN")

            msg.edit(`Follow the steps shown below`, {embed: embed4})

            const Collector3 = message.channel.createMessageCollector(filter,{ time: 30000,max:1 })

            Collector3.on("collect", async(collect3) => {
            whiteRole = collect3.mentions.roles.first().id || message.guild.roles.cache.get(collect3.content);

            if (whiteRole) {
                msg.edit(`Installation not completed , Please try again later.`)
                collect3.delete()
                Collector3.stop()
            }

            msg.edit(`Wait a while to make a ticket, it doesn't take much time`)


            const embedticket = new MessageEmbed()
            .setTitle(tickettitle)
            .setDescription(`To create a ticket click on the button bleow down 📩`)
            .setColor("GREEN")
            .setFooter(message.guild.name,message.guild.iconURL({dynamic: true}))

            const ticketbutton = new MessageButton()
            .setLabel('Create ticket')
            .setEmoji('📩')
            .setID('create_button')
            .setStyle('gray')

            channelticket.send(embedticket,{ button: ticketbutton }).then(async(msg1) => {
                const newData = ticketModel.create({
                    GuildID: message.guild.id,
                    ChannelID: channelticket.id,
                    WhiteRoleID: whiteRole,
                    parentID,
                    TicketNumber: 0,
                    embedTitle: tickettitle,
                    msgID: msg1.id
                });
                (await newData).save().then((data) => {
                __id = data._id;

                msg.edit(`Ticket sutep completed successfully\n save and keep this key becase it's important! : ${__id}`)
                })
            })


            })
            })
            })
        });
    })
    }
}