const Discord = require("discord.js");

const getNickname = function(msg) {
    if (msg.member === 'undefined' || msg.member === null) {
        return msg.author.username;
    }

    return msg.member.displayName;
};
exports.getNickname = getNickname;

exports.temporaryMessage = function(channel, text, lifespan) {
    const response = channel.send(text);
    response.then((m) => { m.delete(lifespan); });
};

exports.deleteMessage = function(msg, time) {
    msg.delete(time).then(() => {}, () => {});
}