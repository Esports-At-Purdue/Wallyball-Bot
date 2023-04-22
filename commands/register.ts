import {SlashCommandBuilder} from "@discordjs/builders";
import {ChatInputCommandInteraction} from "discord.js";
import RegisterModal from "../modals/Register.Modal";
import Player from "../Player";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("register")
        .setDescription("Sign up for Wallyball!")
    ,

    async execute(interaction: ChatInputCommandInteraction) {
        const player = await Player.get(interaction.user.id)

        if (player) {
            await interaction.reply({content: `You are registered as ${player.name}`, ephemeral: true});
            return;
        }

        const modal = new RegisterModal();
        await interaction.showModal(modal);
    }
}