let Misc = require("./Misc");

const teasePhrases = [
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

class Game {
    constructor(dbAdapter, participantRepository, gamesRepository) {
        this.dbAdapter = dbAdapter;
        this.participantRepository = participantRepository;
        this.gamesRepository = gamesRepository;
    }

    async CanStartGame(guild_id) {
        return new Promise((resolve, reject) => {
            this.gamesRepository
                .GetLastGame(guild_id)
                .then(game => {
                    if (game === undefined) {
                        resolve(true);
                    }

                    if (game.datetime > Math.floor(Date.now() / 1000) - 86400) {
                        reject(game.discord_user_name);
                        return;
                    }

                    resolve(true);
                });
        });
    }

    async Tease(channel) {
        let phrases = Misc.GetRandomElement(teasePhrases);
        await Misc.AsyncForEach(phrases, async p => {
            await Misc.Sleep(2500 + Math.random() * 5500).then(() => {
                channel.send(p);
            });
        });
        await Misc.Sleep(3500 + Math.random() * 2500)
    }

    async Run(guild_id) {
        return new Promise((resolve, reject) => {
            this.participantRepository.GetRandomParticipant(guild_id).then(participant => {
                if (participant === null) {
                    reject("Вы не можете запустить игру без участников");
                    return;
                }

                this.gamesRepository.SaveGameInformation(guild_id, participant.id);
                this.participantRepository.ScoreParticipant(participant.id);
                resolve(Misc.GetRandomElement(resultPhrases) + "<@" + participant.discord_user_id+">");
            });
        });
    }

    GetStats(guild_id) {
        return new Promise(resolve => {
            this.dbAdapter
                .all(
                    "SELECT discord_user_name, score FROM participants WHERE score > 0 AND discord_guild_id = ?1 ORDER BY score DESC LIMIT 10",
                    {
                        1: guild_id,
                    })
                .then(rows => {
                    let string = "**Топ-10 пидоров за все время:**\n";
                    rows.forEach((row) => {
                        string += row.discord_user_name+" - " + row.score + "\n";
                    });

                    resolve(string);
                });
        });
    }
}

module.exports = Game;