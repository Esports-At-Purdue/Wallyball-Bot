import {
    Client,
    ClientOptions,
    Collection,
    Guild,
    IntentsBitField,
    REST,
    TextChannel
} from "discord.js";
import {Routes, ActivityType} from "discord-api-types/v9";
import Logger from "./Logger";
import Database from "./Database";
import * as config from "./config.json";
import {bot} from "./app";
import * as fs from "fs";

const options = {
    intents: [
        IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildBans, IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.DirectMessages, IntentsBitField.Flags.GuildPresences
    ]
} as ClientOptions;

export default class Bot extends Client {
    public guild: Guild;
    public logger: Logger;
    public database: Database;
    public commands: Collection<any, any>;

    public constructor() {
        super(options);
        this.commands = new Collection<any, any>();
    }

    async init() {
        this.guild = await this.guilds.fetch(config.guild.id);
        this.logger = new Logger(await this.guild.channels.fetch(config.guild.channels.log) as TextChannel);
        this.database = new Database();

        switch (config.status.type) {
            case "PLAYING": bot.user.setActivity({name: config.status.name, type: ActivityType.Playing}); break;
            case "STREAMING": bot.user.setActivity({name: config.status.name, type: ActivityType.Streaming}); break;
            case "LISTENING": bot.user.setActivity({name: config.status.name, type: ActivityType.Listening}); break;
            case "WATCHING": bot.user.setActivity({name: config.status.name, type: ActivityType.Watching}); break;
            case "COMPETING": bot.user.setActivity({name: config.status.name, type: ActivityType.Competing}); break;
        }

        await this.database.init();
        await this.initializeCommands(config.token);
    }

    async initializeCommands(token: string) {
        const guildCommands = [];
        const globalCommands = [];
        const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
        const rest = new REST({ version: '9' }).setToken(token);
        const id = this.application.id;
        const guild = this.guilds.cache.get(config.guild.id);

        for (const file of commandFiles) {
            const command = require(`./commands/${file}`);
            if (!command.disabled) {
                if (command.global) globalCommands.push(command.data.toJSON());
                else guildCommands.push(command.data.toJSON());
                await this.commands.set(command.data.name, command);
            }
        }

        try {
            await rest.put(Routes.applicationGuildCommands(id, guild.id), {body: guildCommands});
            await rest.put(Routes.applicationCommands(id), {body: globalCommands});
            await this.logger.info("Application commands uploaded");
        } catch (error) {
            await this.logger.error("Error uploading application commands", error);
        }
    }
}