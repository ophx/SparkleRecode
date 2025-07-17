import { ButtonBuilder, ButtonStyle, ContainerBuilder, SectionBuilder, TextDisplayBuilder, SeparatorSpacingSize, ThumbnailBuilder, MessageFlags } from "discord.js";
import { EpicGenerator } from "../epicgames/apiWrapper.js";
import { getRandomError } from "../utils/utils.js";

export function loginContainer(uri) {
    const container = new ContainerBuilder();
    const text = new TextDisplayBuilder().setContent([
        "### 🔗 Log In",
        `Please login to your account by clicking the button below or copying the link.\n\`${uri}\``,
    ].join("\n"))
    const button = new ButtonBuilder().setLabel("Open In Browser").setURL(uri).setStyle(ButtonStyle.Link);
    container.addTextDisplayComponents(text);
    container.addSeparatorComponents((separator) => separator.setSpacing(SeparatorSpacingSize.Large));
    container.addActionRowComponents((row) => row.addComponents(button));

    return container;
};

export function loggedinContainer(displayName, avatar) {
    const a = new ThumbnailBuilder().setURL(avatar ? avatar : "https://fortnite-api.com/images/cosmetics/br/cid_defaultoutfit/icon.png");
    const container = new ContainerBuilder();

    let text;
    text = new TextDisplayBuilder().setContent(`### <:ImpostersAcceptIcon:1342766794309373972> Logged in as ${displayName}!`);

    const section = new SectionBuilder().addTextDisplayComponents(text).setThumbnailAccessory(a);
    container.addSectionComponents(section);

    return container;
};

export function basicContainer(title, content) {
    const container = new ContainerBuilder();
    const text = new TextDisplayBuilder().setContent([
        title,
        content
    ].join("\n"));
    container.addTextDisplayComponents(text);

    return container;
};

export async function epicLogin(interaction) {
    const epicGenerator = new EpicGenerator();
    await epicGenerator.start();
    const [verificationUriComplete, deviceCode] = await epicGenerator.createDeviceCode();

    await interaction.followUp({
        components: [loginContainer(verificationUriComplete)],
        flags: MessageFlags.IsComponentsV2
    });

    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 5 * 60 * 1000));
    let user;
    try {
        user = await Promise.race([
            epicGenerator.waitForDeviceCodeCompletion(deviceCode),
            timeoutPromise
        ]);
    } catch (err) {
        if (err.message === "timeout") {
            await interaction.editReply({
                components: [basicContainer(`### ${getRandomError()}`, "<:ImpostersCancelIcon:1342766796242948147> Link has expired...")],
                flags: MessageFlags.IsComponentsV2
            });

            return;
        }
    }

    return user;
};