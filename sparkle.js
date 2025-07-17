import { Client, GatewayIntentBits, Collection } from "discord.js";
import { readdirSync } from "fs";
import path from "path";
import dotenv from "dotenv";
import * as logger from "./utils/logger.js";

dotenv.config();

export default class Sparkle extends Client {
    constructor() {
        super({
            disableEveryone: true,
            intents: GatewayIntentBits.Guilds
        });

        this.commands = new Collection();
    }

    async _createCommands() {
        const commandPath = path.resolve("./commands");
        const commandFiles = readdirSync(commandPath).filter((file) => file.endsWith(".js"));
        for (let file of commandFiles) {
            const commandModule = await import(`./commands/${file}`);
            const command = commandModule.default;

            this.commands.set(command.data.name, command);
        }
    }

    async _createEvents() {
        const eventPath = path.resolve("./events");
        const eventFiles = readdirSync(eventPath).filter((file) => file.endsWith(".js"));
        for (let file of eventFiles) {
            const eventModule = await import(`./events/${file}`);
            const event = eventModule.default;
            if (event.once) {
                this.once(event.name, (...args) => event.execute(this, ...args));
            } else {
                this.on(event.name, (...args) => event.execute(this, ...args));
            }
        }
    }

    async _init() {
        logger.info("Starting Sparkle")

        await this._createCommands();
        await this._createEvents();
        await this.login(process.env.TOKEN);
    }
};