import { REST, Routes } from "discord.js";
import { readdirSync } from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const commands = [];
const commandPath = path.resolve("./commands");
const commandFiles = readdirSync(commandPath).filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
	const commandModule = await import(`./commands/${file}`);
	const command = commandModule.default;

	commands.push(command.data.toJSON());
}

const rest = new REST().setToken(process.env.TOKEN);
(async () => {
	try {
		console.log("Started refreshing application (/) commands");
        await rest.put(Routes.applicationCommands("854516721385996328"), { body: commands });
	    console.log("Successfully reloaded application (/) commands");
	} catch (err) {
		console.error(err);
	}
})();