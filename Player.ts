import {Filter, ObjectId, UpdateFilter, UpdateOptions} from "mongodb";
import {bot} from "./app";

export default class Player {
    public id: string;
    public name: string;
    public setsWon: number;
    public setsLost: number;
    public pointsWon: number;
    public pointsLost: number;
    public elo: number;
    public rank: number;

    constructor(id: string, name: string, setsWon: number, setsLost: number, pointsWon: number, pointsLost: number, elo: number, rank: number) {
        this.id = id;
        this.name = name;
        this.setsWon = setsWon;
        this.setsLost = setsLost;
        this.pointsWon = pointsWon;
        this.pointsLost = pointsLost;
        this.elo = elo;
        this.rank = rank;
    }

    public static fromObject(object) {
        if (object == null) return null;
        return new Player(object.id, object.name, object.setsWon, object.setsLost, object.pointsWon, object.pointsLost, object.elo, object.rank);
    }

    public static eloChange(playerElo: number, allyElo: number, opponentElo: number, outcome: boolean): number {
        // ToDo: Tommy, this function receives 3 variables
        // Todo:    playerElo -> Current elo of the a Player
        // ToDo:    allyElo -> The average elo of the players team
        // ToDo:    opponentElo -> The average elo of the opponents
        // ToDo:    outcome -> True: the player won, False: the player lost
        // ToDo:    With these three variables, do a calculation that returns the change in elo for this player.

        const k = 5;
        let p = 1 / (1 + Math.pow(10, (opponentElo - playerElo) / 300))
        let result;
        if (outcome) result = 1;
        else result = 0;
        let eloBias = Math.round((k * (result-p)));
        if (outcome) eloBias = eloBias + 28;
        else eloBias = eloBias - 20;

        return eloBias;
    }

    public async save() {
        const query: Filter<any> = { id: this.id};
        const update: UpdateFilter<any> = {$set: this};
        const options: UpdateOptions = {upsert: true};
        await bot.database.players.updateOne(query, update, options);
    }

    public static async get(id: string): Promise<Player> {
        try {
            const query = { id: id};
            const document = await bot.database.players.findOne(query);
            if (!document) return null;
            return Player.fromObject(document);
        } catch (error) {
            return null;
        }
    }

    static async delete(player: Player) {
        await bot.database.players.deleteOne({ id: player.id });
    }
}