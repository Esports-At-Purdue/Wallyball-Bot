import {EmbedBuilder} from "discord.js";
import Team from "../Team";

export default class TeamEmbed extends EmbedBuilder {
    public constructor(team: Team) {
        super();
        this.setTitle(capitalizeEveryWord(team.name));
        let description = "";
        for (const playerId of team.players) {
            description += `<@${playerId}>\n`
        }

        const playerField = {name: "Players", value: `${description}`, inline: true};
        const setsWonField = {name: "Sets Won", value: `${team.setsWon}`, inline: true};
        const pointsWonField = {name: "Points Won", value: `${team.pointsWon}`, inline: true};

        this.setFields([playerField, setsWonField, pointsWonField]);
    }
}

function capitalizeEveryWord(str: string): string {
    if (str.length === 0) {
        return str; // Return an empty string if the input is empty
    }
    const words = str.split(' '); // Split the string into an array of words
    const capitalizedWords = words.map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1); // Capitalize the first letter of each word
    });
    return capitalizedWords.join(' '); // Join the capitalized words back into a string
}
