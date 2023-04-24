import {SlashCommandBuilder} from "@discordjs/builders";
import {ChatInputCommandInteraction} from "discord.js";
import LeaderboardImage from "../images/Leaderboard.Image";
import LeaderboardActionRow from "../components/Leaderboard.ActionRow";
import {bot} from "../app";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Displays the PUPL Leaderboard')
        .addIntegerOption((option) => option
            .setName('page')
            .setDescription('The page of the leaderboard')
            .setRequired(false)
            .setMinValue(1)
        ),

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.deferReply();

        let page = interaction.options.getInteger('page') ?? 1;
        const maxPages = Math.ceil(await bot.database.players.countDocuments() / 5);
        if (page > maxPages) page = maxPages;
        const file = await LeaderboardImage.build(page);
        const actionRow = new LeaderboardActionRow(page, maxPages);

        await interaction.editReply({files: [file], components: [actionRow]});
    },
}
