class GamesRepository {
    constructor(dbAdapter) {
        this.dbAdapter = dbAdapter;
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