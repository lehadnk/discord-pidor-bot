class GamesRepository {
    constructor(dbAdapter) {
        this.dbAdapter = dbAdapter;
    }

    GetLastGame(guild_id) {
        return this.dbAdapter.get(
            "SELECT g.datetime, p.discord_user_name FROM games g JOIN participants p ON p.id = g.winner_participant_id WHERE g.discord_guild_id = ?1 ORDER BY datetime DESC",
            {
                1: guild_id
            }
        );
    }

    SaveGameInformation(guild_id, winner_user_id) {
        this.dbAdapter.run(
            "INSERT INTO games (discord_guild_id, winner_participant_id, datetime) VALUES (?1, ?2, ?3)",
            {
                1: guild_id,
                2: winner_user_id,
                3: Math.floor(Date.now() / 1000)
            }
        );
    }
}

module.exports = GamesRepository;