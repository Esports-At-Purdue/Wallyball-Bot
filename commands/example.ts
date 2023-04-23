import {SlashCommandBuilder} from "@discordjs/builders";
import {ChatInputCommandInteraction} from "discord.js";
import {bot} from "../app";
import {Filter} from "mongodb";
import Player from "../Player";
import GameUpdateEmbed from "../embeds/Game.Update.Embed";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("example")
        .setDescription("example")
    ,
    async execute(interaction: ChatInputCommandInteraction) {
        const players = [];
        const eloChanges = [];
        for (let i = 0; i < 10; i++) {
            const filter: Filter<any> = { $sample: { size: 1}};
            const document = await bot.database.players.aggregate([
                { $sample: { size: 1 } },
            ]).next();
            const player = Player.fromObject(document);
            const eloChange = Math.floor(Math.random() * (60 + 1) - 30)
            players.push(player);
            eloChanges.push(eloChange)
        }
        const embed = new GameUpdateEmbed("Title", players, eloChanges);
        await interaction.reply({embeds: [embed], ephemeral: true});
    }
}