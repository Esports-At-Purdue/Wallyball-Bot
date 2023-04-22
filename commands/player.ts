import {SlashCommandBuilder} from "@discordjs/builders";
import {ChatInputCommandInteraction, Message} from "discord.js";
import {bot} from "../app";
import * as config from "../config.json"
import Player from "../Player";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("player")
        .setDescription("commands related to players")

        .addSubcommand((command) => command
            .setName("stats")
            .setDescription("Changes a player's stats")
            .addUserOption((user) => user
                .setName("target")
                .setDescription("The player to update")
                .setRequired(true)
            )
            .addIntegerOption((integer) => integer
                .setName("elo")
                .setDescription("The new amount of elo")
                .setRequired(false)
                .setMinValue(0)
            )
            .addIntegerOption((integer) => integer
                .setName("sets-won")
                .setDescription("The new amount of sets won")
                .setRequired(false)
                .setMinValue(0)
            )
            .addIntegerOption((integer) => integer
                .setName("sets-lost")
                .setDescription("The new amount of sets lost")
                .setRequired(false)
                .setMinValue(0)
            )
            .addIntegerOption((integer) => integer
                .setName("points-won")
                .setDescription("The new amount of points won")
                .setRequired(false)
                .setMinValue(0)
            )
            .addIntegerOption((integer) => integer
                .setName("points-lost")
                .setDescription("The new amount of points lost")
                .setRequired(false)
                .setMinValue(0)
            )
        )

        .addSubcommand((command) => command
            .setName("name")
            .setDescription("Changes a player's name")
            .addUserOption((user) => user
                .setName("target")
                .setDescription("The player to update")
                .setRequired(true)
            )
            .addStringOption((string) => string
                .setName("name")
                .setDescription("The new name")
                .setRequired(true)
            )
        )

        .addSubcommand((command) => command
            .setName("create")
            .setDescription("Create a new player")
            .addUserOption((user) => user
                .setName("target")
                .setDescription("The player to create")
                .setRequired(true)
            )
            .addStringOption((string) => string
                .setName("name")
                .setDescription("The name of the player")
                .setRequired(true)
            )
        )
    ,

    async execute(interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();
        const user = interaction.options.getUser("target");
        const player = await Player.get(user.id);

        if (subcommand == "stats") {
            const elo = interaction.options.getInteger("elo") ?? -1;
            const setsWon = interaction.options.getInteger("sets-won") ?? -1;
            const setsLost = interaction.options.getInteger("sets-lost") ?? -1;
            const pointsWon  = interaction.options.getInteger("points-won") ?? -1;
            const pointsLost = interaction.options.getInteger("points-lost") ?? -1;

            if (!player) {
                await interaction.reply({content: "This player does not exist", ephemeral: true});
                return;
            }

            if (elo > 0) player.elo = elo;
            if (setsWon > 0) player.setsWon = setsWon;
            if (setsLost > 0) player.setsLost = setsLost;
            if (pointsWon > 0) player.pointsWon = pointsWon;
            if (pointsLost > 0) player.pointsLost = 0;
            await player.save();
            await bot.database.updateRankings();
            const deletables: Message[] = [];
            await interaction.reply({content: `${player.name} has been successfully updated.`});
            if (elo > 0) deletables.push(await interaction.followUp({content: `elo -> ${elo}`}));
            if (setsWon > 0) deletables.push(await interaction.followUp({content: `sets won -> ${elo}`}));
            if (setsLost > 0) deletables.push(await interaction.followUp({content: `sets lost -> ${elo}`}));
            if (pointsWon > 0) deletables.push(await interaction.followUp({content: `points won -> ${elo}`}));
            if (pointsLost > 0) deletables.push(await interaction.followUp({content: `points lost -> ${elo}`}));
            setTimeout(() => {
                for (const deletable of deletables) {
                    deletable.delete().catch();
                }
            }, 10000);

            return;
        }

        if (subcommand == "name") {
            const name = interaction.options.getString("name");

            if (!player) {
                await interaction.reply({content: "This player does not exist", ephemeral: true});
                return;
            }

            player.name = name;
            await player.save();
            await interaction.reply({content: `${name} has been successfully updated.`})
            const deletable = await interaction.followUp({content: `name -> ${name}`});
            setTimeout(() => {
                deletable.delete().catch();
            }, 15000);
            return;
        }

        if (subcommand == "create") {
            if (player) {
                await interaction.reply({content: "This player already exists", ephemeral: true});
                return;
            }

            const member = await bot.guild.members.fetch(user.id);
            const name = interaction.options.getString("name");
            await new Player(user.id, name, 0, 0, 0, 0, 500, 0).save();
            await bot.database.updateRankings();
            await member.roles.add(config.guild.roles.wallyball);
            await interaction.reply({content: `${name} has successfully been created`, ephemeral: true});
            return;
        }

        throw new Error(`Unknown Subcommand /player ${subcommand}`);
    }
}