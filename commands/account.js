import { SlashCommandBuilder, AttachmentBuilder, ContainerBuilder, TextDisplayBuilder, MessageFlags, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SeparatorSpacingSize, ComponentType } from "discord.js";
import { getCurrentSkin, getProfile, getProfileInfo, getAccountInfo, getBRInventory, getProfileStats, getBattlePassInfo, getSTWInfo, getExternalAuths, getPaymentInfo, clearFriendsList } from "../epicgames/apiWrapper.js";
import { idPattern, cosmeticType, sortIdsByRarity, convertedMythicIds, filterMythicIdsFunc, createLocker } from "../drawing/lockerBuilder.js";
import { loggedinContainer, basicContainer, epicLogin } from "../utils/containers.js";
import { getRandomError, boolToEmoji, countryToFlag } from "../utils/utils.js";

export default {
    data: new SlashCommandBuilder()
        .setName("account")
        .setDescription("Account commands")
        .addSubcommand((subcommand) => 
            subcommand
                .setName("locker")
                .setDescription("Returns images for the accounts locker")
        )
        .addSubcommand((subcommand) => 
            subcommand
                .setName("info")
                .setDescription("Returns the accounts information")
        )
        .addSubcommand((subcommand) => 
            subcommand
                .setName("clear")
                .setDescription("Clears the accounts friends list")
        ),
    async execute(client, interaction) {
        const command = interaction.options.getSubcommand();
        switch (command) {
            case "locker": {
                const user = await epicLogin(interaction);

                const profile = await getProfile(user);
                if (typeof profile === "string") {
                    await interaction.editReply({
                        components: [basicContainer(`### ${getRandomError()}`, "<:ImpostersCancelIcon:1342766796242948147> Account is banned...")],
                        flags: MessageFlags.IsComponentsV2
                    });

                    return;
                }

                const items = {};
                for (let [itemId, itemData] of Object.entries(profile.profileChanges[0].profile.items)) {
                    const templateId = itemData.templateId.toLowerCase();
                    if (templateId.includes("loadingscreen_character_lineup") || templateId.includes("cid_defaultoutfit")) {
                        continue;
                    }
                
                    if (idPattern.test(templateId)) {
                        const itemType = cosmeticType(templateId);
                        if (!items[itemType]) {
                            items[itemType] = [];
                        }
                
                        items[itemType].push(templateId.split(":")[1]);
                    }
                }

                const lockerData = { unlockedStyles: {}, favorited: {} };
                for (let [itemId, itemData] of Object.entries(profile.profileChanges[0].profile.items)) {
                    const templateId = itemData.templateId || "";
                    if (templateId.startsWith("Athena")) {
                        const lowercaseCosmeticId = templateId.split(":")[1];
                        if (!lockerData.unlockedStyles[lowercaseCosmeticId]) {
                            lockerData.unlockedStyles[lowercaseCosmeticId] = [];
                        }

                        const attributes = itemData.attributes || {};
                        const variants = attributes.variants || [];
                        for (const variant of variants) {
                            lockerData.unlockedStyles[lowercaseCosmeticId].push(...variant.owned);
                        }

                        lockerData.favorited[lowercaseCosmeticId] = attributes.favorite === true;
                    }
                }

                const mythicItems = filterMythicIdsFunc(items, convertedMythicIds);

                const avatar = await getCurrentSkin(user);
                const selectMenu = new StringSelectMenuBuilder()
                    .setCustomId("selectLocker")
                    .setPlaceholder("Make a selection")
                    .addOptions(
                        new StringSelectMenuOptionBuilder().setLabel(`Skins (${items["Skins"]?.length || 0})`).setEmoji("1340884909388206212").setValue("skins"),
                        new StringSelectMenuOptionBuilder().setLabel(`Backblings (${items["Backblings"]?.length || 0})`).setEmoji("1340884902962401300").setValue("backblings"),
                        new StringSelectMenuOptionBuilder().setLabel(`Pickaxes (${items["Pickaxes"]?.length || 0})`).setEmoji("1340884908503072779").setValue("pickaxes"),
                        new StringSelectMenuOptionBuilder().setLabel(`Emotes (${items["Emotes"]?.length || 0})`).setEmoji("1340884904866742385").setValue("emotes"),
                        new StringSelectMenuOptionBuilder().setLabel(`Gliders (${items["Gliders"]?.length || 0})`).setEmoji("1340884907437854810").setValue("gliders"),
                        new StringSelectMenuOptionBuilder().setLabel(`Contrails (${items["Contrails"]?.length || 0})`).setEmoji("1340884904124088380").setValue("contrails"),
                        new StringSelectMenuOptionBuilder().setLabel(`Wraps (${items["Wraps"]?.length || 0})`).setEmoji("1340884982813560914").setValue("wraps"),
                        new StringSelectMenuOptionBuilder().setLabel(`Sprays (${items["Sprays"]?.length || 0})`).setEmoji("1340884910373601402").setValue("sprays"),
                        new StringSelectMenuOptionBuilder().setLabel(`Exclusives (${mythicItems?.length || 0})`).setEmoji("1366962350464438372").setValue("exclusives")
                    );

                const container = loggedinContainer(user.displayName, avatar);
                container.addSeparatorComponents((separator) => separator.setSpacing(SeparatorSpacingSize.Large));
                container.addActionRowComponents((row) => row.addComponents(selectMenu));

                const reply = await interaction.editReply({
                    components: [container],
                    flags: MessageFlags.IsComponentsV2
                });

                const collectorFilter = (i) => i.user.id === interaction.user.id;
                const collector = reply.createMessageComponentCollector({ componentType: ComponentType.StringSelect, filter: collectorFilter });

                collector.on("collect", async (i) => {
                    await i.deferReply();

                    const order = ["Skins", "Backblings", "Pickaxes", "Emotes", "Gliders", "Contrails", "Wraps", "Sprays", "Exclusives"];
                    const itemKeyMap = {
                        skins: "Skins",
                        backblings: "Backblings",
                        pickaxes: "Pickaxes",
                        emotes: "Emotes",
                        gliders: "Gliders",
                        contrails: "Contrails",
                        wraps: "Wraps",
                        sprays: "Sprays",
                        exclusives: "Exclusives",
                    };
                    const key = i.values[0];
                    const capitalizedKey = itemKeyMap[key];
                    const selectedItems = key === "exclusives" ? mythicItems : items[capitalizedKey];

                    if (selectedItems?.length) {
                        const sortedIds = await sortIdsByRarity(selectedItems, order);
                        await createLocker(sortedIds, i.user.username, capitalizedKey, lockerData).then(async (buf) => {
                            const attachment = new AttachmentBuilder(buf, { name: `${capitalizedKey}.png` });

                            await i.followUp({
                                content: "",
                                files: [attachment]
                            });
                    });
                    } else {
                        await i.followUp({
                            content: `You have no ${key}...`,
                        });
                    }
                });

                break;
            }

            case "info": {
                const user = await epicLogin(interaction);

                const profile = await getProfile(user);
                if (typeof profile === "string") {
                    await interaction.editReply({
                        components: [basicContainer(`### ${getRandomError()}`, "<:ImpostersCancelIcon:1342766796242948147> Account is banned...")],
                        flags: MessageFlags.IsComponentsV2
                    });

                    return;
                }

                const avatar = await getCurrentSkin(user);
                const profileInfo = await getProfileInfo(user);
                const accountInfo = await getAccountInfo(user);
                const inventory = await getBRInventory(user);
                const profileStats = await getProfileStats(user);
                const battlePass = await getBattlePassInfo(user);
                const stw = await getSTWInfo(user);
                const externalAuths = await getExternalAuths(user);
                const payment = await getPaymentInfo(user);

                await interaction.editReply({
                    components: [loggedinContainer(user.displayName, avatar)],
                    flags: MessageFlags.IsComponentsV2
                });

                let authsDescription;
                if (externalAuths && externalAuths.length > 0) {
                    externalAuths.forEach((auth) => {
                        const authType = auth.type || "...";
                        const authDisplayName = auth.externalDisplayName || "...";
                        let authAdded = auth.dateAdded || "...";
                        if (authAdded !== "...") {
                            const authParsedDate = new Date(authAdded);
                            authAdded = authParsedDate.toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                            });
                        }

                        authsDescription = `**${authType}**\n` +
                                        `› Display Name: ${authDisplayName}\n` +
                                        `› Added: ${authAdded}\n`;
                    });
                } else {
                    authsDescription = "N/A";
                }

                const infoContainer = new ContainerBuilder();
                const infoText1 = new TextDisplayBuilder().setContent([
                    "### <:ErrorGraphic:1340177472582320158> Information",
                    `<:HashtagGraphic:1343502189154537512> **ID:** ${user.accountId}`,
                    `<:CharacterGraphic:1340175776967954433> **Display Name:** ${user.displayName}`,
                    `<:EmailGraphic:1340175829388496929> **Email:** ${accountInfo.email}`,
                    `<:KeyIcon:1340175772673114246> **Email Verified:** ${boolToEmoji(accountInfo.emailVerified)}`,
                    `<:ModifiedOptionsGraphic:1340175769283854387> **Parental Controls:** ${boolToEmoji(accountInfo.minorVerified)}`,
                    `<:IMG_1036:1340175767514120193> **2FA:** ${boolToEmoji(accountInfo.tfaEnable)}`,
                    `<:IMG_1034:1340175765752381451> **Full Name:** ${accountInfo.name || "..."} ${accountInfo.lastName || "..."}`,
                    `<:MapIcon:1340175762690412607> **Country:** ${countryToFlag(accountInfo.country)}`,
                    `<:ClockStatusGraphic:1340175827559649313> **Registered:** ${profileInfo.creationDate}`,
                    `<:ClockStatusGraphic:1340175827559649313> **Last Display Name Change:** ${accountInfo.lastDisplayNameChange || "..."}`
                ].join("\n"));
                infoContainer.addTextDisplayComponents(infoText1);
                infoContainer.addSeparatorComponents((separator) => separator.setSpacing(SeparatorSpacingSize.Large));
                const infoText2 = new TextDisplayBuilder().setContent([
                    "### <:SpecialMissionIcon:1340177469705162895> Stats",
                    `<:BoltStatusGraphic:1343503044435902525> **Account Level:** ${profileStats.accountLevel}`,
                    `<:CheckMarkStatusGraphic:1340175754746658916> **Level:** ${profileStats.level}`,
                    `<:GoldAccolade:1340175758198571018> **Gold:** ${inventory.stash.globalcash}`,
                    `<:ClipboardIcon:1340175759683358810> **Has Battle Pass:** ${boolToEmoji(battlePass.hasBattlepass)}`,
                    `<:ShoppingSpreeAccoladeIcon:1340175756378112020> **Has Crew Membership:** ${boolToEmoji(battlePass.hasCrewMembership)}`,
                    `<:ScRseE:1353819757438308432> **Has Save The World:** ${boolToEmoji(stw.hasStw)}`,
                    `<:ClockStatusGraphic:1340175827559649313> **Last Match:** ${profileStats.lastPlayedInfo}`
                ].join("\n"));
                infoContainer.addTextDisplayComponents(infoText2);
                infoContainer.addSeparatorComponents((separator) => separator.setSpacing(SeparatorSpacingSize.Large));
                const infoText3 = new TextDisplayBuilder().setContent([
                    "### <:SunshineSoldiersIcon:1342736218810486874> Connected Accounts",
                    authsDescription
                ].join("\n"));
                infoContainer.addTextDisplayComponents(infoText3);
                infoContainer.addSeparatorComponents((separator) => separator.setSpacing(SeparatorSpacingSize.Large));
                const infoText4 = new TextDisplayBuilder().setContent([
                    "### <:SearchGraphic:1340177471210782780> Miscellaneous",
                    `<:VBuckGraphic:1345390033607196814> **Available VBucks:** ${payment.totalVbucks}`,
                    `<:VBuckGraphic:1345390033607196814> **VBucks Spent:** ${payment.totalVbucksSpent}`,
                    `<:TicketGraphic:1345391887523119195> **Refunds Used:** ${payment.refundsUsed}`,
                    `<:TicketGraphic:1345391887523119195> **Refunds Available:** ${payment.refundsAvailable}`,
                    `<:GiftIcon:1340175764313604176> **Gifts Sent:** ${payment.giftsSent}`,
                    `<:GiftIcon:1340175764313604176> **Gifts Received:** ${payment.giftsReceived}`
                ].join("\n"));
                infoContainer.addTextDisplayComponents(infoText4);

                await interaction.editReply({
                    components: [infoContainer],
                    flags: MessageFlags.IsComponentsV2
                });

                break;
            }

            case "clear": {
                const user = await epicLogin(interaction);
        
                const profile = await getProfile(user);
                if (typeof profile === "string") {
                    await interaction.editReply({
                        components: [basicContainer(`### ${getRandomError()}`, "<:ImpostersCancelIcon:1342766796242948147> Account is banned...")],
                        flags: MessageFlags.IsComponentsV2
                    });
        
                    return;
                }
        
                const avatar = await getCurrentSkin(user);
        
                await interaction.editReply({
                    components: [loggedinContainer(user.displayName, avatar)],
                    flags: MessageFlags.IsComponentsV2
                });
                
                await clearFriendsList(user);
        
                await interaction.editReply({
                    components: [basicContainer("### Success!", "<:ImpostersAcceptIcon:1342766794309373972> Cleared your friends list!")],
                    flags: MessageFlags.IsComponentsV2
                });

                break;
            }

            default: {
                break;
            }
        }

        return;
    }
};