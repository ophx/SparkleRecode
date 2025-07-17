import { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ContainerBuilder, TextDisplayBuilder,  SeparatorSpacingSize, MessageFlags } from "discord.js";
import { getServerStatus } from "../epicgames/apiWrapper.js";

export default {
    data: new SlashCommandBuilder()
        .setName("status")
        .setDescription("Epic Games server status"),
    async execute(client, interaction) {
        const serverStatus = await getServerStatus();

        const seenNames = new Set();
        let count = 0;
        let statusDescription = "";

        for (let component of serverStatus.components) {
            const name = component.name || "...";
            if (!seenNames.has(name)) {
                seenNames.add(name);
                statusDescription += `**${name}:** ${component.status || "..."}\n`;
                count++;
                if (count >= 5) {
                    break;
                }
            }
        }

        statusDescription += `\n-# Last Updated: ${serverStatus.lastUpdated}`;

        const container = new ContainerBuilder();
        const text = new TextDisplayBuilder().setContent([
            `### <:rT76vb:1350232349995958407> ${serverStatus.name}`,
            statusDescription,
        ].join("\n"))
        const status = new ButtonBuilder().setLabel("Status Page").setURL(serverStatus.url).setStyle(ButtonStyle.Link);

        container.addTextDisplayComponents(text);
        container.addSeparatorComponents((separator) => separator.setSpacing(SeparatorSpacingSize.Large));
        container.addActionRowComponents((row) => row.addComponents(status));
        
        await interaction.followUp({
            components: [container],
            flags: MessageFlags.IsComponentsV2
        });

        return;
    }
};