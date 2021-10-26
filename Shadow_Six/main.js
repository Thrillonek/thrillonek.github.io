var discord = require("discord.js");
require("dotenv").config();
var client = new discord.Client({
    intents: ["GUILD_MESSAGES", "GUILDS", "GUILD_MEMBERS"],
    partials: ["CHANNEL", "MESSAGE", "REACTION"],
    allowedMentions: { parse: ['users', 'roles'], repliedUser: true }
});

/* EXPRESS */
var express = require("express");
var app = express();
app.all("/", (req, res) => {
    res.send("OK");
});
function keepAlive() {
    app.listen(3000, () => { console.log("Hosting je ready!") });
}
keepAlive();

client.on("message", (msg) => {
    if(msg.content === "YO" && msg.author.username === "Thrillonek"){
        msg.reply({ content: "čau" })
    }
})

client.login(process.env.TOKEN);