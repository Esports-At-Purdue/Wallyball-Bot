import {Filter, UpdateFilter, UpdateOptions} from "mongodb";
import {adjectives, nouns} from "./wallyball.json";
import {bot} from "./app";
import Player from "./Player";

export default class Team {
    public name: string;
    public setsWon: number;
    public setsLost: number;
    public pointsWon: number;
    public pointsLost: number;
    public players: string[];

    constructor(name: string, setsWon: number, setsLost: number, pointsWon: number, pointsLost: number, players: string[]) {
        this.name = name;
        this.setsWon = setsWon;
        this.setsLost = setsLost;
        this.pointsWon = pointsWon;
        this.pointsLost = pointsLost;
        this.players = players;
    }

    public async getAverageElo(): Promise<number> {
        let totalElo = 0;
        let totalPlayers = this.players.length;
        for (const playerId of this.players) {
            const player = await Player.get(playerId);
            totalElo += player.elo;
        }
        return totalElo / totalPlayers;
    }

    public static fromObject(object): Team {
        if (object == null) return null;
        return new Team(object.name, object.setsWon, object.setsLost, object.pointsWon, object.pointsLost, object.players);
    }

    public static generateRandomName(): string {
        const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        const noun = nouns[Math.floor(Math.random() * nouns.length)];
        return `${adjective} ${noun}`;
    }

    public async save(): Promise<void> {
        const query: Filter<any> = {name: this.name};
        const update: UpdateFilter<any> = {$set: this};
        const options: UpdateOptions = {upsert: true};
        await bot.database.teams.updateOne(query, update, options);
    }

    public static async get(name: string): Promise<Team> {
        try {
            const query = { name: name.toLowerCase() };
            const document = await bot.database.teams.findOne(query);
            if (!document) return null;
            return Team.fromObject(document);
        } catch (error) {
            return undefined;
        }
    }
}