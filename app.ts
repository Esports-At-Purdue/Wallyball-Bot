import Bot from "./Bot";
import * as config from "./config.json";
import InteractionStatus, {InteractionType} from "./InteractionStatus";
import {ChatInputCommandInteraction, Events, GuildMember, Interaction, ModalSubmitInteraction} from "discord.js";
import Player from "./Player";

export const bot = new Bot();

bot.login(config.token).then(async () => {
    await bot.init();
})

bot.on(Events.InteractionCreate, (interaction: Interaction) => {
    let status: Promise<InteractionStatus>;
    if (interaction.isCommand()) status = handleCommand(interaction as ChatInputCommandInteraction);
    if (interaction.isModalSubmit()) status = handleModalSubmit(interaction);

    status.then((response) => {
        if (!response.status) {
            if (interaction.isRepliable()) {
                if (interaction.isChatInputCommand()) {
                    if (interaction.deferred) {
                        interaction.editReply({content: "Sorry, that didn't work"}).catch()
                    }
                } else {
                    interaction.reply({content: "Sorry, that didn't work.", ephemeral: true}).catch();
                }
            }
            bot.logger.error(`${response.type} by ${response.user.username} failed.`, response.error);
        }
    }).catch();
});

async function handleCommand(interaction: ChatInputCommandInteraction): Promise<InteractionStatus> {
    const user = interaction.user;
    const command = bot.commands.get(interaction.commandName);

    try {
        await command.execute(interaction);
        return new InteractionStatus(InteractionType.Command, user, true, null);
    } catch (error) {
        return new InteractionStatus(InteractionType.Command, user, false, error);
    }
}

async function handleModalSubmit(interaction: ModalSubmitInteraction): Promise<InteractionStatus> {
    const user= interaction.user;
    const member = interaction.member as GuildMember;

    try {
        if (interaction.customId == "wallyball") {
            const name = interaction.fields.getTextInputValue("name");
            await new Player(user.id, name, 0, 0, 0, 0, 500, 1000).save();
            await bot.database.updateRankings();
            await member.roles.add(config.guild.roles.wallyball);
            await interaction.reply({content: `You have been registered as ${name}.`, ephemeral: true});
            await interaction.followUp({content: `You applied **<@&${config.guild.roles.wallyball}>**.`, ephemeral: true});
        }
    } catch (error) {
        return new InteractionStatus(InteractionType.Modal, user, false, error);
    }
    return new InteractionStatus(InteractionType.Modal, user, true, null);
}