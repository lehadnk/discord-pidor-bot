let DbAdapter = require('./src/DbAdapter.js');
let ParticipantRepository = require('./src/Repositories/ParticipantRepository');
let GamesRepository = require('./src/Repositories/GamesRepository');
let Game = require('./src/Game');

let sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('../database.db3');

let adapter = new DbAdapter(db);
// let participants = adapter.get("SELECT * FROM participants", {})
//     .then(result => console.log(result));
//
// adapter.get("SELECT * FROM hooligans")
//     .catch(reject => {
//         console.log(reject)
//     })
//console.log(participants);

let repository = new ParticipantRepository(adapter);
let gamesRepository = new GamesRepository(adapter);

// repository.IsParticipantExists(1, 1).then(result => {
//     console.log(result)
// });
// repository.IsParticipantExists("207169330549358592", "207912188407578624").then(result => {
//     console.log(result)
// });

// repository.AddParticipant(123, 123, "test");

// repository.GetRandomParticipant(1243).then(r => console.log(r));

let game = new Game(adapter, repository, gamesRepository);

// game.CanStartGame(123).then(r => console.log(r)).catch(reject => console.log(reject));

game.run("237520435389005825").then(r => console.log(r)).catch(r => console.log(r));