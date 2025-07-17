import { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ContainerBuilder, TextDisplayBuilder, SeparatorSpacingSize, MessageFlags, version } from "discord.js";
import os from "os";

function formatUptime(ms) {
    const sec = Math.floor(ms / 1000) % 60;
    const min = Math.floor(ms / (1000 * 60)) % 60;
    const hr = Math.floor(ms / (1000 * 60 * 60)) % 24;
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));

    return [
        days ? `${days}d` : null,
        hr ? `${hr}h` : null,
        min ? `${min}m` : null,
        `${sec}s`
    ].filter(Boolean).join(" ");
};

function getSystemStats() {
    const memoryUsage = process.memoryUsage();
    const usedMemMB = (memoryUsage.rss / 1024 / 1024).toFixed(2);
    
    return {
        memory: `${usedMemMB} MB / ${"152.73"} GB`,
        os: `${os.type()} ${os.release()}`,
        arch: os.arch(),
    };
}

export default {
    data: new SlashCommandBuilder()
        .setName("bot_info")
        .setDescription("Bot information"),
    async execute(client, interaction) {
        const reply = await interaction.fetchReply();
        const ping = reply.createdTimestamp - interaction.createdTimestamp;

        const system = getSystemStats();

        const container = new ContainerBuilder();
        const text = new TextDisplayBuilder().setContent([
            "### <:Teo3C5:1350232347362201741> Sparkle Information",
            `**Guilds:** ${client.guilds.cache.size}`,
            `**Uptime:** ${formatUptime(client.uptime)}`,
            `**Library:** Discord.js v${version}`,
            `**API Ping:** ${ping}ms`,
            `**Websocket Ping:** ${client.ws.ping}ms`,
            `**Memory:** ${system.memory}`,
            `**OS:** ${system.os} (${system.arch})\n`,
            "-# Developer: ophx"
        ].join("\n"));
        const support = new ButtonBuilder().setLabel("Support Server").setURL("https://discord.gg/j2JT8QYQyf").setStyle(ButtonStyle.Link);

        container.addTextDisplayComponents(text);
        container.addSeparatorComponents((separator) => separator.setSpacing(SeparatorSpacingSize.Large));
        container.addActionRowComponents((row) => row.addComponents(support));
        
        await interaction.followUp({
            components: [container],
            flags: MessageFlags.IsComponentsV2
        });

        return;
    }
};