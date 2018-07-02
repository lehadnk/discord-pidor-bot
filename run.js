"use strict";
const DiscordJS = require("discord.js");
const pidorGame = require("./pidor.js");
const sqlite3 = require("sqlite3");
const chatFunctions= require("./chat-functions.js");
const DiscordClient = new DiscordJS.Client();

const db = new sqlite3.Database('database.db3');

DiscordClient.on('message', msg => {
    if (msg.content.match(/^!пидордня/)) {
        pidorGame.register(db, msg);
        chatFunctions.deleteMessage(msg, 2000);
        return;
    }

    if (msg.content.match(/^!ктопидор/)) {
        pidorGame.canStartGame(db, msg)
            .then(() => {
                pidorGame.run(db, msg);
                chatFunctions.deleteMessage(msg, 1000);
            }, (name) => {
                if (name !== undefined) {
                    msg.channel.send("А пидор сегодня - " + name);
                }
            });
    }

    if (msg.content.match(/^!топпидоров/)) {
        pidorGame.stat(db, msg);
        chatFunctions.deleteMessage(msg, 1000);
        return;
    }
});

DiscordClient.login(process.env.BOT_TOKEN);
