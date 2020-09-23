class ParticipantsRepository {

    constructor(dbAdapter) {
        this.dbAdapter = dbAdapter;
    }

    async GetRandomParticipant(guild_id) {
        return this.dbAdapter.get(
            "SELECT id, discord_user_id, discord_user_name FROM participants WHERE discord_guild_id = ?1 ORDER BY random() LIMIT 1",
            {
                1: guild_id
            }
        ).then(result => {
            if (result === undefined) {
                return null;
            }

            return result;
        });
    }

    AddParticipant(user_id, guild_id, name) {
        this.dbAdapter.run(
            "INSERT INTO participants(discord_user_id, discord_guild_id, discord_user_name, score) VALUES (?1, ?2, ?3, ?4)",
            {
                1: user_id,
                2: guild_id,
                3: name,
                4: 0
            }
        );
    }

    RemoveParticipant(user_id, guild_id) {
        this.dbAdapter.run(
            "DELETE FROM participants WHERE discord_user_id = ?1 AND discord_guild_id = ?2",
            {
                1: user_id,
                2: guild_id
            }
        );
    }

    IsParticipantExists(user_id, guild_id) {
        return this.dbAdapter.get(
            "SELECT count(id) as cnt FROM participants WHERE discord_user_id = ?1 AND discord_guild_id = ?2",
            {
                1: user_id,
                2: guild_id
            },
        ).then(result => {
            return result.cnt > 0;
        });
    }

    ScoreParticipant(participant_id) {
        this.dbAdapter.run("UPDATE participants SET score = score + 1 WHERE id = ?1", {
            1: participant_id,
        });
    }
}

module.exports = ParticipantsRepository;