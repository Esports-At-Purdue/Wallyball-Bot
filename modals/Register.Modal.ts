import {ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle} from "discord.js";

const prompt = "What is your preferred first name?"

export default class RegisterModal extends ModalBuilder {
    public constructor() {
        super();
        this.setCustomId("wallyball");
        this.setTitle("Wallyball Registration")
        const nameInput = new TextInputBuilder()
            .setCustomId("name")
            .setLabel(prompt)
            .setStyle(TextInputStyle.Short)
        const actionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(nameInput);
        this.addComponents(actionRow);
    }
}