const chatFunctions = require('./chat-functions.js');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const prePhrases = [
    [
        'Woob-woob, that\'s da sound of da pidor-police!',
        'Выезжаю на место...',
        'Но кто же он?'
    ],
    [
        'Woob-woob, that\'s da sound of da pidor-police!',
        'Ведётся поиск в базе данных',
        'Ведётся захват подозреваемого...'
    ],
    [
        'Что тут у нас?',
        'А могли бы на работе делом заниматься...',
        'Проверяю данные...'
    ],
    [
        'Инициирую поиск пидора дня...',
        'Машины выехали',
        'Так-так, что же тут у нас...',
    ],
    [
        'Что тут у нас?',
        'Военный спутник запущен, коды доступа внутри...',
        'Не может быть!',
    ]
];

const resultPhrases = [
    'А вот и пидор - ',
    'Вот ты и пидор, ',
    'Ну ты и пидор, ',
    'Сегодня ты пидор, ',
    'Анализ завершен, сегодня ты пидор, ',
    'ВЖУХ И ТЫ ПИДОР, ',
    'Пидор дня обыкновенный, 1шт. - ',
    'Стоять! Не двигаться! Вы объявлены пидором дня, ',
    'И прекрасный человек дня сегодня... а нет, ошибка, всего-лишь пидор - ',
];

let getRandomElement = function(array) {
    return array[Math.floor(Math.random() * array.length)];
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
    }
}

exports.canStartGame = function(db, msg) {
    return new Promise((resolve, reject) => {
        db.get(
            "SELECT g.datetime, p.discord_user_name FROM games g JOIN participants p ON p.id = g.winner_participant_id WHERE g.discord_guild_id = ?1 ORDER BY datetime DESC",
            {
                1: msg.guild.id
            },
            (err, row) => {
                if (typeof row === 'undefined') {
                    resolve();
                } else {
                    if (row.datetime > Math.floor(Date.now() / 1000) - 86400) {
                        reject(row.discord_user_name);
                    } else {
                        resolve();
                    }
                }
            }
        );
    });
}

exports.register = function(db, msg) {
    db.get(
        "SELECT count(id) as cnt FROM participants WHERE discord_user_id = ?1 AND discord_guild_id = ?2",
        {
            1: msg.author.id,
            2: msg.guild.id
        },
        (err, row) => {
            console.log(err);
            if (row.cnt > 0) {
                chatFunctions.temporaryMessage(msg.channel, "Yes, "+chatFunctions.getNickname(msg)+", you're already participate in this game you silly.", 9000);
                return false;
            } else {
                db.run("INSERT INTO participants(discord_user_id, discord_guild_id, discord_user_name, score) VALUES (?1, ?2, ?3, ?4)", {
                    1: msg.author.id,
                    2: msg.guild.id,
                    3: chatFunctions.getNickname(msg),
                    4: 0
                });
                chatFunctions.temporaryMessage(msg.channel, "Alright, you're in, **"+chatFunctions.getNickname(msg)+"**", 7000);
            }
        }
    );
};

exports.run = async function(db, msg) {
    let phrases = getRandomElement(prePhrases);
    asyncForEach(phrases, async (phrase) => {
        msg.channel.send(phrase);
        await sleep(2500);
    });

    await sleep(10500);

    db.all(
        "SELECT id, discord_user_id, discord_user_name FROM participants WHERE discord_guild_id = ?1",
        {
            1: msg.guild.id
        },
        (err, rows) => {
            if (typeof rows === 'undefined') {
                chatFunctions.temporaryMessage(msg.channel, "Something is sick and wrong with me: " + err);
            }
            if (rows.length === 0) {
                chatFunctions.temporaryMessage(msg.channel, "You can't run the game with no participants!", 9000);
                return false;
            } else {
                let player = getRandomElement(rows);
                let phrase = getRandomElement(resultPhrases);
                msg.channel.send(phrase + "<@" + player.discord_user_id + ">");

                db.run("UPDATE participants SET score = score + 1 WHERE id = ?1", {
                    1: player.id,
                });
                db.run("INSERT INTO games (discord_guild_id, winner_participant_id, datetime) VALUES (?1, ?2, ?3)", {
                    1: msg.guild.id,
                    2: player.id,
                    3: Math.floor(Date.now() / 1000)
                });
            }
        }
    );
}

exports.stat = function(db, msg) {
    var sql = "SELECT discord_user_name, score FROM participants WHERE score > 0 AND discord_guild_id = ?1 ORDER BY score DESC LIMIT 10";

    var strings = [];
    db.all(sql, {1: msg.guild.id},(err, rows) => {
        strings.push("**Топ-10 пидоров за все время:**\n");
        rows.forEach((row) => {
            strings.push(row.discord_user_name+" - "+row.score+"\n");
        });

        var i, j, temparray, chunk = 30;
        for (i = 0, j = strings.length; i<j; i+=chunk) {
            temparray = strings.slice(i, i+chunk);

            var string = "";
            temparray.forEach(function(elem) {
                string += elem;
            });
            chatFunctions.temporaryMessage(msg.channel, string, 25000);
        }
    });
}