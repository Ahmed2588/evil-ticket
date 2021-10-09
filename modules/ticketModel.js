const mongoose = require("mongoose");

const ticketSchema = mongoose.Schema({
    GuildID: String,
    ChannelID: String,
    WhiteRoleID: String,
    parentID: String,
    TicketNumber: Number,
    embedTitle: String,
    msgID: String,
});

const MessageModel = module.exports = mongoose.model("Tickets", ticketSchema)