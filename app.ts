import Bot from "./Bot";
import * as config from "./config.json";
import InteractionStatus, {InteractionType} from "./InteractionStatus";
import {
    ButtonInteraction,
    ChatInputCommandInteraction,
    Events,
    GuildMember,
    Interaction,
    ModalSubmitInteraction
} from "discord.js";
import Player from "./Player";
import LeaderboardImage from "./images/Leaderboard.Image";
import LeaderboardActionRow from "./components/Leaderboard.ActionRow";

export const bot = new Bot();

bot.login(config.token).then(async () => {
    await bot.init();
})

bot.on(Events.InteractionCreate, (interaction: Interaction) => {
    let status: Promise<InteractionStatus>;
    if (interaction.isButton()) status = handleButton(interaction);
    if (interaction.isCommand()) status = handleCommand(interaction as ChatInputCommandInteraction);
    if (interaction.isModalSubmit()) status = handleModalSubmit(interaction);

    status.then((response) => {

        if (response && response.status) return

        bot.logger.error(`${response.type} by ${response.user.username} failed.`, response.error);

        if (!interaction.isRepliable()) return;

        if (interaction.replied) {
            interaction.followUp({content: "Sorry, that didn't work.", ephemeral: true}).catch();
            return;
        }

        if (interaction.deferred) {
            interaction.editReply({content: "Sorry, that didn't work"}).catch();
            return;
        }

        interaction.reply({content: "Sorry, that didn't work.", ephemeral: true}).catch();
    }).catch(error => {
        bot.logger.error("Unknown Interaction Failed", error);
    });
});

async function handleButton(interaction: ButtonInteraction): Promise<InteractionStatus> {
    const user = interaction.user;
    const id = interaction.customId;

    try {

        if (id.startsWith("page")) {
            await interaction.deferUpdate();
            const page = Number.parseInt(id.slice(5));
            const maxPages = Math.ceil(await bot.database.players.countDocuments() / 5);
            const actionRow = new LeaderboardActionRow(page, maxPages);
            const file = await LeaderboardImage.build(page);
            await interaction.editReply({files: [file], components: [actionRow]})
        }

        return new InteractionStatus(InteractionType.Button, user, true, null);
    } catch (error) {
        return new InteractionStatus(InteractionType.Button, user, false, error);
    }
}

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