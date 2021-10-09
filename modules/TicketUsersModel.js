const mongoose = require("mongoose");

const TicketUsersSchema = mongoose.Schema({
    GuildID: String,
    ChannelID: String,
    UserID: String,
    msgclosebutton: String,
    RoleID: String,
    Status: String,
});

const MessageModel = module.exports = mongoose.model("TicketsData", TicketUsersSchema)