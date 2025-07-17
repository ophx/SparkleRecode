import { Events, MessageFlags } from "discord.js";

export default {
    name: Events.InteractionCreate,
    once: false,
    async execute(client, interaction) {
        if (!interaction.isChatInputCommand()) {
            return
        }
    
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    
        const command = client.commands.get(interaction.commandName);
    
        try {
            await command.execute(client, interaction);
        } catch (e) {
            throw new Error(e);
        }
    }
};