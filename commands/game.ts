import {SlashCommandBuilder} from "@discordjs/builders";
import {ChatInputCommandInteraction} from "discord.js";
import Team from "../Team";
import Player from "../Player";
import {bot} from "../app";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("game")
        .setDescription("commands related to games")

        .addSubcommand((command) => command
            .setName("record")
            .setDescription("records a new game")

            .addStringOption((string) => string
                .setName("team-one")
                .setDescription("the name of team 1")
                .setRequired(true)
            )

            .addIntegerOption((integer) => integer
                .setName("team-one-score")
                .setDescription("how many points team 1 had")
                .setRequired(true)
            )

            .addStringOption((string) => string
                .setName("team-two")
                .setDescription("the name of team 1")
                .setRequired(true)
            )

            .addIntegerOption((integer) => integer
                .setName("team-two-score")
                .setDescription("how many points team 1 had")
                .setRequired(true)
            )
        )
    ,

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const teamOneName = interaction.options.getString("team-one");
        const teamTwoName = interaction.options.getString("team-two");
        const teamOneScore = interaction.options.getInteger("team-one-score");
        const teamTwoScore = interaction.options.getInteger("team-two-score");
        const totalRounds = teamOneScore + teamTwoScore;
        const winningTeamName = teamOneScore > teamTwoScore ? capitalizeEveryWord(teamOneName) : capitalizeEveryWord(teamTwoName);
        const losingTeamName = teamOneScore > teamTwoScore ? capitalizeEveryWord(teamTwoName) : capitalizeEveryWord(teamOneName);

        const teamOne = await Team.get(teamOneName);
        const teamTwo = await Team.get(teamTwoName);

        if (!teamOne) {
            await interaction.reply({content: `Sorry, the \`${teamOneName}\` do not exist`, ephemeral: true});
            return;
        }

        if (!teamTwo) {
            await interaction.reply({content: `Sorry, the \`${teamTwoName}\` do not exist`, ephemeral: true});
            return;
        }

        teamOne.pointsWon += teamOneScore;
        teamTwo.pointsWon += teamTwoScore;
        teamOne.pointsLost += teamTwoScore;
        teamTwo.pointsLost += teamOneScore;

        if (teamOneScore > teamTwoScore) {
            teamOne.setsWon += 1;
            teamTwo.setsLost += 1;
        } else {
            teamTwo.setsWon += 1;
            teamOne.setsLost += 1;
        }

        const teamOneAverageElo = await teamOne.getAverageElo();
        const teamTwoAverageElo = await teamTwo.getAverageElo();

        for (const playerId of teamOne.players) {
            const player = await Player.get(playerId);
            const eloChange = Player.eloChange(player.elo, teamOneAverageElo, teamTwoAverageElo, teamOneScore > teamTwoScore);
            player.elo += eloChange;
            player.pointsWon += teamOneScore;
            player.pointsLost += totalRounds - teamOneScore;
            if (teamOneScore > teamTwoScore) player.setsWon += 1;
            else player.setsLost += 1;
            await player.save();
        }

        for (const playerId of teamTwo.players) {
            const player = await Player.get(playerId);
            const eloChange = Player.eloChange(player.elo, teamTwoAverageElo, teamOneAverageElo, teamOneScore < teamTwoScore);
            player.elo += eloChange;
            player.pointsWon += teamTwoScore;
            player.pointsLost += totalRounds - teamTwoScore;
            if (teamOneScore > teamTwoScore) player.setsLost += 1;
            else player.setsWon += 1;
            await player.save();
        }

        await teamOne.save();
        await teamTwo.save();
        await bot.database.updateRankings();
        await interaction.reply({content: `A victory has been recorded for the ${winningTeamName} versus the ${losingTeamName}.`});
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