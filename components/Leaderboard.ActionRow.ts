import {ActionRowBuilder, ButtonBuilder, ButtonStyle} from "discord.js";

export default class LeaderboardActionRow extends ActionRowBuilder<ButtonBuilder> {
    constructor(page: number, totalPages: number) {
        super();
        if (page == 1) {
            this.addComponents(
                new ButtonBuilder()
                    .setEmoji("👈")
                    .setCustomId(`0`)
                    .setStyle(ButtonStyle.Success)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setEmoji("👉")
                    .setCustomId("page-2")
                    .setStyle(ButtonStyle.Success)
            )
        }
        else if (page == totalPages) {
            this.addComponents(
                new ButtonBuilder()
                    .setEmoji("👈")
                    .setCustomId(`page-${totalPages - 1}`)
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setEmoji("👉")
                    .setCustomId("0")
                    .setStyle(ButtonStyle.Success)
                    .setDisabled(true)
            )
        }
        else {
            this.addComponents(
                new ButtonBuilder()
                    .setEmoji("👈")
                    .setCustomId(`page-${page - 1}`)
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setEmoji("👉")
                    .setCustomId(`page-${page + 1}`)
                    .setStyle(ButtonStyle.Success)
            )
        }
    }
}