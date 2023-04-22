import {SlashCommandBuilder} from "@discordjs/builders";
import {ChatInputCommandInteraction} from "discord.js";
import Player from "../Player";
import Team from "../Team";
import TeamEmbed from "../embeds/Team.Embed";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("team")
        .setDescription("commands related to teams")

        .addSubcommand((command) => command
            .setName("generate")
            .setDescription("Generates teams from a collection of players")
            .addIntegerOption((integer) => integer
                .setName("teams")
                .setDescription("The number of total teams")
                .setRequired(true)
                .setMinValue(2)
                .setMaxValue(12)
            )
            .addUserOption((user) => user
                .setName("player-1")
                .setDescription("Player 1")
                .setRequired(true)
            )
            .addUserOption((user) => user
                .setName("player-2")
                .setDescription("Player 2")
                .setRequired(true)
            )
            .addUserOption((user) => user
                .setName("player-3")
                .setDescription("Player 3")
                .setRequired(false)
            )
            .addUserOption((user) => user
                .setName("player-4")
                .setDescription("Player 4")
                .setRequired(false)
            )
            .addUserOption((user) => user
                .setName("player-5")
                .setDescription("Player 5")
                .setRequired(false)
            )
            .addUserOption((user) => user
                .setName("player-6")
                .setDescription("Player 6")
                .setRequired(false)
            )
            .addUserOption((user) => user
                .setName("player-7")
                .setDescription("Player 7")
                .setRequired(false)
            )
            .addUserOption((user) => user
                .setName("player-8")
                .setDescription("Player 8")
                .setRequired(false)
            )
            .addUserOption((user) => user
                .setName("player-9")
                .setDescription("Player 9")
                .setRequired(false)
            )
            .addUserOption((user) => user
                .setName("player-10")
                .setDescription("Player 10")
                .setRequired(false)
            )
            .addUserOption((user) => user
                .setName("player-11")
                .setDescription("Player 11")
                .setRequired(false)
            )
            .addUserOption((user) => user
                .setName("player-12")
                .setDescription("Player 12")
                .setRequired(false)
            )
            .addUserOption((user) => user
                .setName("player-13")
                .setDescription("Player 13")
                .setRequired(false)
            )
            .addUserOption((user) => user
                .setName("player-14")
                .setDescription("Player 14")
                .setRequired(false)
            )
            .addUserOption((user) => user
                .setName("player-15")
                .setDescription("Player 15")
                .setRequired(false)
            )
            .addUserOption((user) => user
                .setName("player-16")
                .setDescription("Player 16")
                .setRequired(false)
            )
            .addUserOption((user) => user
                .setName("player-17")
                .setDescription("Player 17")
                .setRequired(false)
            )
            .addUserOption((user) => user
                .setName("player-18")
                .setDescription("Player 18")
                .setRequired(false)
            )
            .addUserOption((user) => user
                .setName("player-19")
                .setDescription("Player 19")
                .setRequired(false)
            )
            .addUserOption((user) => user
                .setName("player-20")
                .setDescription("Player 20")
                .setRequired(false)
            )
            .addUserOption((user) => user
                .setName("player-21")
                .setDescription("Player 21")
                .setRequired(false)
            )
            .addUserOption((user) => user
                .setName("player-22")
                .setDescription("Player 22")
                .setRequired(false)
            )
            .addUserOption((user) => user
                .setName("player-23")
                .setDescription("Player 23")
                .setRequired(false)
            )
            .addUserOption((user) => user
                .setName("player-24")
                .setDescription("Player 24")
                .setRequired(false)
            )
        )

        .addSubcommand((command) => command
            .setName("create")
            .setDescription("Creates a team")
            .addUserOption((user) => user
                .setName("player-1")
                .setDescription("Player 1")
                .setRequired(true)
            )
            .addUserOption((user) => user
                .setName("player-2")
                .setDescription("Player 2")
                .setRequired(false)
            )
            .addUserOption((user) => user
                .setName("player-3")
                .setDescription("Player 3")
                .setRequired(false)
            )
            .addUserOption((user) => user
                .setName("player-4")
                .setDescription("Player 4")
                .setRequired(false)
            )
            .addUserOption((user) => user
                .setName("player-5")
                .setDescription("Player 5")
                .setRequired(false)
            )
            .addUserOption((user) => user
                .setName("player-6")
                .setDescription("Player 6")
                .setRequired(false)
            )
            .addUserOption((user) => user
                .setName("player-7")
                .setDescription("Player 7")
                .setRequired(false)
            )
            .addUserOption((user) => user
                .setName("player-8")
                .setDescription("Player 8")
                .setRequired(false)
            )
            .addUserOption((user) => user
                .setName("player-9")
                .setDescription("Player 9")
                .setRequired(false)
            )
            .addUserOption((user) => user
                .setName("player-10")
                .setDescription("Player 10")
                .setRequired(false)
            )
            .addUserOption((user) => user
                .setName("player-11")
                .setDescription("Player 11")
                .setRequired(false)
            )
            .addUserOption((user) => user
                .setName("player-12")
                .setDescription("Player 12")
                .setRequired(false)
            )
        )

        .addSubcommand((command) => command
            .setName("info")
            .setDescription("View a team")
            .addStringOption((string)  => string
                .setName("name")
                .setDescription("The team name")
                .setRequired(true)
            )
        )
    ,

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const subcommand = interaction.options.getSubcommand();
        const players = [];

        for (let i = 0; i < 24; i++) {
            const user = interaction.options.getUser(`player-${i}`);
            if (!user) continue;
            const player = await Player.get(user.id);
            if (!player) {
                await interaction.reply({content: `Sorry, ${user.username} is not a valid player`, ephemeral: true});
                return;
            }
            if (players.indexOf(player.id) > -1) {
                await interaction.reply({content: `Sorry, you cannot specify duplicate players`, ephemeral: true});
                return;
            }
            players.push(player.id);
        }

        if (subcommand == "info") {
            const teamName = interaction.options.getString("name");
            const team = await Team.get(teamName);
            if (!team) {
                await interaction.reply({content: `Sorry, the \`${teamName}\` do not exist.`, ephemeral: true});
                return;
            }
            const embed = new TeamEmbed(team);
            await interaction.reply({embeds: [embed]});
            return;
        }

        if (subcommand == "create") {
            let teamName = Team.generateRandomName();
            let team = await Team.get(teamName);
            while (team != null) {
                teamName = Team.generateRandomName();
                team = await Team.get(teamName);
            }

            team = new Team(teamName, 0, 0, 0, 0, players);
            const embed = new TeamEmbed(team);
            await team.save();
            await interaction.reply({content: `Successfully created new team: **${teamName}**`, embeds: [embed]});
            return;
        }

        if (subcommand == "generate") {
            const totalTeams = interaction.options.getInteger("teams");
            const teams: Team[] = [];

            for (let i = 0; i < totalTeams; i++) {
                let teamName = Team.generateRandomName();
                let team = await Team.get(teamName);
                while (team != null) {
                    teamName = Team.generateRandomName();
                    team = await Team.get(teamName);
                }
                team = new Team(teamName, 0, 0, 0, 0, []);
                await team.save();
                teams.push(team);
            }

            if (players.length < totalTeams) {
                await interaction.reply({content: `Sorry, you must specify as many or players than total teams.`, ephemeral: true});
                return;
            }

            const shuffledPlayers = shuffleArray(players);

            for (let i = 0; i < shuffledPlayers.length; i++) {
                const teamIndex = i % totalTeams;
                teams[teamIndex].players.push(players[i]);
            }

            await interaction.reply({content: `Successfully created ${totalTeams} teams.`});

            for (const team of teams) {
                const embed = new TeamEmbed(team);
                await interaction.followUp({embeds: [embed]});
            }

            for (const team of teams) {
                await team.save();
            }

            return;
        }
    }
}

function shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}