import {SlashCommandBuilder} from "@discordjs/builders";
import {ChatInputCommandInteraction} from "discord.js";
import LeaderboardImage from "../images/Leaderboard.Image";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Displays the PUPL Leaderboard')
        .addIntegerOption((option) => option
            .setName('page')
            .setDescription('The page of the leaderboard')
            .setRequired(false)
        ),

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.deferReply();

        const page = interaction.options.getInteger('page') ?? 1;
        const file = await LeaderboardImage.build(page)

        await interaction.editReply({files: [file]});
    },
}
