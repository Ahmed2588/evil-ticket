require('dotenv').config();
const Discord = require("discord.js");
const canvas= require("canvas");
const client = new Discord.Client();
require("discord-buttons")(client);
const cool = new Set();
const TicketModel = require("./modules/ticketModel");
const usersdata = require("./modules/TicketUsersModel")

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

["command", "events"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

const { promisify } = require("util");
const { MessageButton } = require('discord-buttons');
const wait  = promisify(setTimeout)
const id = "852605921665613835"
let invites;


client.on("ready",async() => {
        await wait(2000)

    client.guilds.cache.get(id).fetchInvites().then(inv => {
    setInterval(() => {
        invites = inv;
    }, 2000)
    })
    })
//Welcome command
    client.on("guildMemberAdd", async(member) => {
        // image link : https://cdn.discordapp.com/attachments/871457096703553629/895413894196113448/123.png
        const createCanvas = canvas.createCanvas(400, 200);
        const ctx = createCanvas.getContext('2d');

        const { loadImage } = canvas

        const image = await loadImage(`https://cdn.discordapp.com/attachments/871457096703553629/895413894196113448/123.png`)
        const avatar = await loadImage(member.user.displayAvatarURL({format:"png"}))
            ctx.drawImage(image ,  500,700 ,900 ,900 )
            ctx.drawImage(avatar, 200,100,100,50)
        
        const att = new Discord.MessageAttachment(createCanvas.toBuffer(), "image-name.png")
        
        member.guild.fetchInvites().then(ginvite => {
            const invite = ginvite.find(inv => invites.get(inv.code).uses < inv.uses);

            const channel = member.guild.channels.cache.get("852605921665613838");

            channel.send(att)

            channel.send(`Member joined: ${member}\n Joined by : ${invite.inviter}`)
        })
    })

//creating ticket 
client.on("clickButton", async(button) => {
    if (button.id === "create_button") {
    if (button.applicationID === client.user.id) {
        const ticketdata = await TicketModel.findOne({
            GuildID: button.guild.id,
            ChanneID: button.channel.id,
            msgID: button.message.id
        });
           let message = button;
            if (ticketdata) {
                ticketdata.TicketNumber +=1;
                await ticketdata.save()
                button.reply.send(`جاري صُنع التذكرة ، الرجاء الأنتظار...`, true).then((msg) => {
                    message.guild.channels.create(`ticket-${'0'.repeat(4 - ticketdata.TicketNumber.toString().length)}${ticketdata.TicketNumber}`, {
                        parent: ticketdata.parentID,
                        permissionOverwrites: [
                            {
                                id: message.clicker.id,
                                allow: ["VIEW_CHANNEL","SEND_MESSAGES","ATTACH_FILES"]
                            },
                            {
                                id: ticketdata.WhiteRoleID,
                                allow: ["VIEW_CHANNEL","SEND_MESSAGES","ATTACH_FILES"]
                            },
                            {
                                id: message.guild.id,
                                deny: ["VIEW_CHANNEL"]
                            }
                        ],
                    }).then((tchannel) => {
                        msg.edit(`تم صُنع التذكرة : ${tchannel}`)
                        const embed = new Discord.MessageEmbed()
                        .setDescription(`الأدارة سوف تأتي قريباً الرجاء الانتظار
لـ قفل  التذكرة ، يرجى الضغط على الزر أسفل الرسالة 🔒`)
                       .setColor("GREEN")
                       .setFooter(message.guild.name,message.guild.iconURL({ dynamic: true }))
                                   
             const button2 = new MessageButton()
             .setLabel("Close")
             .setEmoji("🔒")
             .setID("close_button")
             .setStyle("gray")

             const button3 = new MessageButton()
             .setLabel("Raise the ticket to senior management")
             .setEmoji("🚩")
             .setID("a_button")
             .setStyle("gray")

             tchannel.send(`<@${message.clicker.id}> // <@&${ticketdata.WhiteRoleID}>`, { buttons: [button2,button3],embed: embed }).then(async(msgs) => {
            const newData = usersdata.create({
                     GuildID: message.guild.id,
                     ChannelID: tchannel.id,
                     UserID: message.clicker.id,
                     msgclosebutton: msgs.id,
                     RoleID: ticketdata.WhiteRoleID,
                     Status: "open",
            });
            (await newData).save();
})
})
                })
            }
        
    }
    }
});
//senior management button
client.on("clickButton", async(button) => {
    if (button.applicationID === client.user.id) {
        if (button.id === "a_button") {
            const data = await usersdata.findOne({
                GuildID: button.message.guild.id,
                ChannelID: button.message.channel.id
            });
            if (!data) return;
        if (button.clicker.id === data.UserID) {
            const embed = new Discord.MessageEmbed()
            .setDescription(`الأدارة سوف تأتي قريباً الرجاء الانتظار
لـ قفل  التذكرة ، يرجى الضغط على الزر أسفل الرسالة 🔒`)
           .setColor("GREEN")
           .setFooter(button.message.guild.name,button.message.guild.iconURL({ dynamic: true }))
                       
       const button2 = new MessageButton()
            .setLabel("Close")
            .setEmoji("🔒")
            .setID("close_button")
           .setStyle("gray")

           button.message.edit({
               embeds: [embed],
               button: button
           });

            button.guild.channels.cache.get(button.channel.id).updateOverwrite(data.RoleID,{
                VIEW_CHANNEL: false
            });

            button.reply.send(`**تم رفع التذكرة إلى الأدارة العليا.**`,true)
        }
        }
    }
});
//yes button no button
client.on("clickButton", async(button) => {
    let message = button;
    if (message.applicationID === client.user.id) {
    const data = await usersdata.findOne({
        GuildID: message.guild.id,
        msgclosebutton: message.message.id,
        UserID: button.clicker.id,
    });
    if (!data) return;
        if (message.id === "close_button" && data.UserID === button.clicker.id && data.Status === "open") {
            button.reply.send().catch(console.log)
    if (data) {
                    const yesb = new MessageButton()
            .setLabel("Yes")
            .setStyle("green")
            .setID("yes_button")

            const nob = new MessageButton()
            .setLabel("No")
            .setStyle("red")
            .setID("no_button")
            button.message.channel.send(`**هل أنت متاكد انك تريد ان تقفل هذه التذكره؟**`, { buttons: [yesb,nob] })
    }
        }
    }
});

//yes button no button functions
client.on("clickButton", async(button) => {
    if (button.applicationID === client.user.id) {
        if (button.id === "yes_button") {
            button.message.delete()
            const channel = button.message.guild.channels.cache.get(button.channel.id)
            channel.updateOverwrite(button.clicker.id, {
                VIEW_CHANNEL: false
            })
            const data = await usersdata.findOne({ChanneID: button.channel.id});
            if (data) {
                data.Status = "closed";
                await data.save()
            }
            const embed = new Discord.MessageEmbed()
            .setDescription(`Ticket Closed by <@${button.clicker.id}>`)
            .setColor('YELLOW')
            button.reply.send().catch(console.log)
            button.message.channel.send(embed)
    
            const embeed = new Discord.MessageEmbed()
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
            button.reply.send().catch(console.log)
            button.message.channel.send(embeed, {buttons:[deleteb,openb,transb]})
        }

        if (button.id === "no_button") {
            button.message.delete()
        }
    }
});

//delete button open button transscript button
client.on('clickButton', async(button) => {
    if (button.id === 'Delete') {
        const datalog = await usersdata.findOne({
            ChannelID: button.channel.id,
        });
        if (!datalog) return;
        const embed = new Discord.MessageEmbed()
        .setDescription(`Ticket well be deleted in a few seconds`)
        .setColor('RED')
        button.reply.send().catch(console.log)
        button.message.channel.send(embed).then(msg => {
            msg.delete({timeout:2000})
            setTimeout(async => {
            button.channel.delete
            }, 6000)
        })
    }

    if (button.id === 'open') {
        const datalog = await usersdata.findOne({
            ChannelID: button.channel.id,
        });
        if (!datalog) return;
        button.message.delete()
        button.message.channel.updateOverwrite(datalog.UserID, {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true
        });
        button.message.channel.updateOverwrite(datalog.RoleID, {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true
        });
        const openembed = new Discord.MessageEmbed()
        .setDescription(`Ticket opened by <@${button.clicker.id}>`)
        .setColor('YELLOW')
        button.reply.send().catch(console.log)
        button.message.channel.send(openembed)
        datalog.Status = "open";
        await datalog.save()
    }

    if (button.id === 'tranb') {
        const datalog = await usersdata.findOne({
            ChannelID: button.channel.id,
        });

        if (!datalog) return;
        const tanembed = new Discord.MessageEmbed()
        .setDescription(`Transcript saved to ${button.message.channel}`).setColor('GREEN')
        button.reply.send().catch(console.log)
        button.message.channel.send(tanembed);

        const transembed = new Discord.MessageEmbed()
        .setAuthor(button.clicker.user.tag,button.clicker.user.avatarURL({dynamic:true}))
        .addFields(
            {
                name:"Ticket owner",
                value: `<@${datalog.UserID}>`,
                inline:true
            }, 
            {
                name: "Ticket name",
                value: button.message.channel.name,
                inline: true,
            },
            {
                name: "Panel Name",
                value: button.message.channel.parent
            },
        )
        .setColor('GREEN')
        button.message.channel.send(transembed)
    }

});

//delete command
client.on("message", async(message) => {
    if (message.content.startsWith("delete")) {
    const data = await usersdata.findOne({
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
});

//rename command
client.on("message", async(message) => {
    if (message.content.startsWith("rename")) {
        const args = message.content.split(" ").slice(1).join(" ")
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
});

client.login(process.env.BOT_TOKEN);