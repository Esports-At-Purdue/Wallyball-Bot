import {Collection, MongoClient} from "mongodb";
import * as config from "./config.json";
import {bot} from "./app";
import Player from "./Player";

export default class Database {
    public players: Collection;
    public teams: Collection;

    async init() {
        const client: MongoClient = new MongoClient(`mongodb://${config.mongo.username}:${config.mongo.password}@technowizzy.dev:27017/?authMechanism=DEFAULT`);
        await client.connect();
        const valDb = client.db("Valorant");
        this.players = valDb.collection("wallyball-players");
        this.teams = valDb.collection("wallyball-teams");
    }

    public async updateRankings() {
        const players = (await this.players.find().sort({elo: -1, setsWon: -1, pointsWon: -1}).toArray());
        for (let i = 0; i < players.length; i++) {
            let player = Player.fromObject(players[i]);
            bot.guild.members.fetch(player.id).catch(async () => {await Player.delete(player)});
            player.rank = i + 1;
            await player.save();
        }
    }
}