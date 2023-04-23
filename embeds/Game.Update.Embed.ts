import {EmbedBuilder} from "discord.js";
import Player from "../Player";
import {sprintf} from "sprintf-js";

export default class GameUpdateEmbed extends EmbedBuilder {
    constructor(title: string, players: Player[], eloChanges: number[]) {
        super();
        this.setTitle(title);
        let description = "```";
        for (let i = 0; i < players.length; i++) {
            const player = players[i];
            const eloChange = eloChanges[i];
            const newElo = player.elo;
            const oldElo = player.elo - eloChange;
            if (eloChange >= 0) {
                const formatString = sprintf("%-15s %4d + %2d = %4d\n", player.name + ":", oldElo, eloChange, newElo);
                description += formatString
            } else {
                const formatString = sprintf("%-15s %4d - %2d = %4d\n", player.name + ":", oldElo, Math.abs(eloChange), newElo);
                description += formatString
            }
        }
        this.setDescription(description + "```");
    }
}