import fs from "fs";
import path from "path";
import { createCanvas, loadImage, registerFont } from "canvas";

export const idPattern = /athena(.*?):(.*?)_(.*?)/;

const CACHE_DIR = path.join("./", "cache");
const FONT_PATH = path.join("./", "fonts", "Burbank.ttf");
const HEART_PATH = path.join("./", "images", "heart.png");
const DISCORD_PATH = path.join("./", "images", "discord.png");

registerFont(FONT_PATH, { family: "Burbank Big Rg Bk" });

if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR);
}

const rarityBackgrounds = {
    Common: "Common",
    Uncommon: "Uncommon",
    Rare: "Rare",
    Epic: "Epic",
    Legendary: "Legendary",
    Mythic: "Exclusive",
    "Icon Series": "Icon",
    "DARK SERIES": "Dark",
    "Star Wars Series": "StarWars",
    "MARVEL SERIES": "Marvel",
    "DC SERIES": "DC",
    "Gaming Legends Series": "GamingLegends",
    "Shadow Series": "Shadow",
    "Slurp Series": "Slurp",
    "Lava Series": "Lava",
    "Frozen Series": "Frozen"
};
Object.keys(rarityBackgrounds).forEach(r => {
    rarityBackgrounds[r] = path.join("./", "images/backgrounds", `${rarityBackgrounds[r]}.png`);
});

const rarityOverlay = {
    Common: "Common",
    Uncommon: "Uncommon",
    Rare: "Rare",
    Epic: "Epic",
    Legendary: "Legendary",
    Mythic: "Exclusive",
    "Icon Series": "Icon",
    "DARK SERIES": "Dark",
    "Star Wars Series": "StarWars",
    "MARVEL SERIES": "Marvel",
    "DC SERIES": "DC",
    "Gaming Legends Series": "GamingLegends",
    "Shadow Series": "Shadow",
    "Slurp Series": "Slurp",
    "Lava Series": "Lava",
    "Frozen Series": "Frozen"
};
Object.keys(rarityOverlay).forEach(r =>{
    rarityOverlay[r] = path.join("./", "images/overlays", `${rarityOverlay[r]}.png`);
});

const rarityPriority = {
    Mythic: 1,
    Legendary: 2,
    "Slurp Series": 3,
    "Star Wars Series": 4,
    "MARVEL SERIES": 5,
    "Lava Series": 6,
    "Frozen Series": 7,
    "DARK SERIES": 8,
    "Gaming Legends Series": 9,
    "Shadow Series": 10,
    "Icon Series": 11,
    "DC SERIES": 12,
    Epic: 13,
    Rare: 14,
    Uncommon: 15,
    Common: 16
};
const subOrder = {
    "cid_017_athena_commando_m": 1,
    "cid_028_athena_commando_f": 2,
    "cid_029_athena_commando_f_halloween": 3,
    "cid_030_athena_commando_m_halloween": 4,
    "cid_035_athena_commando_m_medieval": 5,
    "cid_313_athena_commando_m_kpopfashion": 6,
    "cid_757_athena_commando_f_wildcat": 7,
    "cid_039_athena_commando_f_disco": 8,
    "cid_033_athena_commando_f_medieval": 9,
    "cid_032_athena_commando_m_medieval": 10,
    "cid_084_athena_commando_m_assassin": 11,
    "cid_095_athena_commando_m_founder": 12,
    "cid_096_athena_commando_f_founder": 13,
    "cid_113_athena_commando_m_blueace": 14,
    "cid_116_athena_commando_m_carbideblack": 15,
    "cid_175_athena_commando_m_celestial": 16,
    "cid_183_athena_commando_m_modernmilitaryred": 17,
    "cid_342_athena_commando_m_streetracermetallic": 18,
    "cid_371_athena_commando_m_speedymidnight": 19,
    "cid_434_athena_commando_f_stealthhonor": 20,
    "cid_441_athena_commando_f_cyberscavengerblue": 21,
    "cid_479_athena_commando_f_davinci": 22,
    "cid_516_athena_commando_m_blackwidowrogue": 23,
    "cid_703_athena_commando_m_cyclone": 24
};
const mythicIds = [
    "cid_032_athena_commando_m_medieval", "cid_033_athena_commando_f_medieval", "cid_035_athena_commando_m_medieval", "cid_a_256_athena_commando_f_uproarbraids_8iozw",
    "cid_052_athena_commando_f_psblue", "cid_095_athena_commando_m_founder", "cid_096_athena_commando_f_founder", "cid_138_athena_commando_m_psburnou",
    "cid_386_athena_commando_m_streetopsstealth", "bid_249_streetopsstealth", "pickaxe_id_189_streetopsstealth", "glider_id_137_streetopsstealth",
    "cid_a_216_athena_commando_m_sunrisepalace_bbqy0", "pickaxe_id_stw004_tier_5", "pickaxe_id_stw005_tier_6",
    "cid_138_athena_commando_m_psburnout", "pickaxe_id_stw001_tier_1", "pickaxe_id_stw002_tier_3", "pickaxe_id_stw003_tier_4",
    "pickaxe_id_stw007_basic", "pickaxe_id_153_roseleader", "glider_id_211_wildcatblue",
    "cid_113_athena_commando_m_blueace", "cid_114_athena_commando_f_tacticalwoodland", "cid_175_athena_commando_m_celestial", "cid_089_athena_commando_m_retrogrey",
    "cid_174_athena_commando_f_carbidewhite", "cid_183_athena_commando_m_modernmilitaryred", "eid_worm", "cid_240_athena_commando_f_plague", "cid_313_athena_commando_m_kpopfashion",
    "cid_090_athena_commando_m_tactical", "cid_657_athena_commando_f_techopsblue", "cid_371_athena_commando_m_speedymidnight", "cid_085_athena_commando_m_twitch",
    "cid_342_athena_commando_m_streetracermetallic", "cid_434_athena_commando_f_stealthhonor", "cid_441_athena_commando_f_cyberscavengerblue", "cid_479_athena_commando_f_davinci",
    "cid_478_athena_commando_f_worldcup", "cid_516_athena_commando_m_blackwidowrogue", "bid_346_blackwidowrogue", "cid_657_athena_commando_f_techOpsBlue",
    "cid_619_athena_commando_f_techllama", "cid_660_athena_commando_f_bandageninjablue", "cid_703_athena_commando_m_cyclone", "cid_084_athena_commando_m_assassin", "cid_083_athena_commando_f_tactical",
    "cid_761_athena_commando_m_cyclonespace", "cid_783_athena_commando_m_aquajacket", "cid_964_athena_commando_m_historian_869bc", "cid_084_athena_commando_m_assassin", "cid_039_athena_commando_f_disco",
    "eid_ashtonboardwalk", "eid_ashtonsaltlake", "cid_757_athena_commando_f_wildcat", "bid_521_wildcat", "pickaxe_id_398_wildcatfemale", "glider_id_211_wildcatblue",
    "eid_fresh", "eid_hiphop01", "eid_iceking", "eid_kpopdance03",
    "eid_macaroon_45lhe", "eid_ridethepony_athena", "eid_robot",
    "eid_torchsnuffer", "eid_trophycelebrationfncs", "glider_id_001", "glider_id_002_medieval", "glider_id_004_disco",
    "glider_id_090_celestial", "umbrella_snowflake", "glider_warthog",
    "bid_001_bluesquire", "bid_002_royaleknight", "bid_004_blackknight",
    "bid_027_scavenger", "bid_029_retrogrey", "bid_030_tacticalrogue", "bid_055_psburnout",
    "bid_102_buckles", "bid_138_celestial", "bid_468_cyclone", "bid_520_cyclonemale", "eid_floss", "pickaxe_id_013_teslacoil",
    "pickaxe_id_029_assassin", "pickaxe_id_077_carbidewhite", "pickaxe_id_088_psburnout", "pickaxe_id_116_celestial", "pickaxe_id_011_medieval", "eid_takethel",
    "pickaxe_id_294_candycane", "pickaxe_id_359_cyclonemale", "pickaxe_id_376_fncs", "pickaxe_id_508_historianmale_6bqsw",
    "pickaxe_id_804_fncss20male", "cid_259_athena_commando_m_streettops", "pickaxe_id_039_tacticalblack",
    "pickaxe_id_044_tacticalurbanhammer", "bid_049_tacticalwoodland", "eid_wir", "bid_104_yellowzip", "halloweenscythe", "eid_magicman", "glider_id_018_twitch",
    "cid_360_athena_commando_m_techopsblue", "cid_296_athena_commando_m_math", "cid_711_athena_commando_m_longshorts", "bid_482_longshorts", "bid_169_mathmale",
    "bid_224_techopsblue", "bid_448_techopsbluefemale", "bid_033_founderfemale", "glider_id_161_roseleader", "bid_032_foundermale", "glider_id_117_warpaint",
    "pickaxe_id_237_warpaint", "pickaxe_id_464_longshortsmale", "pickaxe_id_256_techopsblue", "glider_id_196_cyclonemale", "eid_cyclone", "glider_id_013_psblue", "glider_id_150_techopsblue",
    "glider_id_067_psburnout", "founderumbrella", "founderglider", "eid_ridetheponytwo",
    "character_snowninjadark", "backpack_snowninjadark", "backpack_frogcabinet_drum", "pickaxe_snowninjadark", "pickaxe_frogcabinet_drum", "wrap_snowninjadark",
    "character_vampirehunter_galaxy", "backpack_vampirehunter_galaxy", "pickaxe_vampirehunter_galaxy", "wrap_vampirehuntergalaxy",
    "character_snowsoldierfashion", "backpack_snowsoldierfashion", "pickaxe_snowsoldierfashion", "glider_snowsoldierfashion", "wrap_snowsoldierfashion",
    "character_masterkeyorder", "pickaxe_masterkeyordermale", "wrap_474_masterkey",
    "cid_a_297_athena_commando_f_network", "pickaxe_id_717_networkfemale", "pickaxe_fncs_s32",
    "cid_850_athena_commando_f_skullbritecube", "bid_604_skullbritecube", "pickaxe_id_461_skullbritecube",
    "cid_a_101_athena_commando_m_tacticalwoodlandblue", "bid_766_tacticalwoodlandblue", "pickaxe_id_560_tacticalwoodlandbluemale", "glider_id_309_tacticalwoodlandblue", "wrap_333_stealthwoodland",
    "eid_groovingsparkle", "eid_potassium", "eid_mic_spinslide", "eid_avian", "eid_drum_pullups", "eid_bass_kylethrowbass", "eid_mic_slipthemic", "eid_hoppin", "eid_playereleven",
    "backpack_fncs24", "backpack_fncs25", "backpack_fncsshield_S30", "backpack_fncsshield_S32", "backpack_fncsshield_S33", "pickaxe_id_376_fncs", "backpack_fncs22", "backpack_fncs23", "backpack_tiltedparrotfrog_custard",
    "backpack_radish", "bid_943_llamaleague", "bid_542_foam", "wrap_unknownnetwork", "wrap_mitosis", "wrap_limejacket", "wrap_alienmaze", "wrap_dyedburst", "wrap_121_techopsblue", "wrap_103_yatter", "wrap_168_eyeballoctopus",
    "wrap_293_phantom", "wrap_301_cosmicpulse", "wrap_447_blizzardbomber", "wrap_459_militaryfashioncamo", "spray_fncswildcard", "spray_mallardvintagefncs", "spray_fallchampionships", "spray_fallchampionships2",
    "spid_450_competitive_catalyst", "spid_451_competitive_fade", "spid_449_competitive_burningwolf", "spray_competitive_peelydrop", "spray_competitive_ctldrop", "spray_s24_fncsdrops", "spray_s23_fncs_drops", "spray_honk",
    "spray_invitational", "spray_purplefootballllama", "spid_432_fncsdrops", "spid_368_littleeggchick", "spid_383_fncsdrops", "spid_382_ueraider", "spid_381_windwalker", "spid_353_fncs_drops", "spid_354_helmetdrops",
    "spid_328_grasshopperhammer_5d0fn", "spid_319_fncs18", "spid_298_console", "spid_289_rifttouracclink_x1fv9", "spid_296_fncs", "spid_282_fncs_allstarsalt2", "spid_281_fncs_allstars", "spid_275_soccer",
    "spid_260_s16_fncs", "spid_242_s15_fncs", "spid_229_s14_fncs", "spid_216_s13_fncs", "spid_204_s12_fncs", "spid_197_carnavalb", "spid_179_s11_fncs", "spid_126_worldcup", "spid_066_llamalaxy", "spid_130_gamejam2019",
    "trails_id_123_tacticalwoodlandblue", "trails_id_091_longshorts", "trails_id_059_sony2", "trails_id_019_psburnout",
    "banner_influencerbanner21", "banner_brseason01", "banner_ot1banner", "banner_ot2banner", "banner_ot3banner", "banner_ot4banner", "banner_ot5banner",
    "banner_influencerbanner54", "banner_influencerbanner38", "banner_ot6banner", "banner_ot7banner", "banner_ot8banner", "banner_ot9banner", "banner_ot10banner", "banner_ot11banner",
    "banner_influencerbanner2", "banner_influencerbanner3", "banner_influencerbanner4", "banner_influencerbanner5", "banner_influencerbanner6", "banner_influencerbanner7",
    "banner_influencerbanner8", "banner_influencerbanner9", "banner_influencerbanner10", "banner_influencerbanner11", "banner_influencerbanner12", "banner_influencerbanner13", "banner_influencerbanner14", "banner_influencerbanner15", "banner_influencerbanner16",
    "banner_influencerbanner17", "banner_influencerbanner18", "banner_influencerbanner19", "banner_influencerbanner20", "banner_influencerbanner21", "banner_influencerbanner22",
    "banner_influencerbanner23", "banner_influencerbanner24", "banner_influencerbanner25", "banner_influencerbanner26", "banner_influencerbanner27", "banner_influencerbanner28",
    "banner_influencerbanner29", "banner_influencerbanner30", "banner_influencerbanner31", "banner_influencerbanner32", "banner_influencerbanner33", "banner_influencerbanner34",
    "banner_influencerbanner35", "banner_influencerbanner36", "banner_influencerbanner37", "banner_influencerbanner39", "banner_influencerbanner40", "banner_influencerbanner41",
    "banner_influencerbanner42", "banner_influencerbanner43", "banner_influencerbanner44", "banner_influencerbanner45", "banner_influencerbanner46", "banner_influencerbanner47",
    "banner_influencerbanner48", "banner_influencerbanner49", "banner_influencerbanner50", "banner_influencerbanner51", "banner_influencerbanner52", "banner_influencerbanner53",
    "banner_foundertier1banner1", "banner_foundertier1banner2", "banner_foundertier1banner3", "banner_foundertier1banner4", "banner_foundertier2banner1", "banner_foundertier2banner2",
    "banner_foundertier2banner3", "banner_foundertier2banner4", "banner_foundertier2banner5", "banner_foundertier2banner6", "banner_foundertier3banner1", "banner_foundertier3banner2",
    "banner_foundertier3banner3", "banner_foundertier3banner4", "banner_foundertier3banner5", "banner_foundertier4banner1", "banner_foundertier4banner2", "banner_foundertier4banner3",
    "banner_foundertier4banner4", "banner_foundertier4banner5", "banner_foundertier5banner1", "banner_foundertier5banner2", "banner_foundertier5banner3", "banner_foundertier5banner4", "banner_foundertier5banner5",
];
export const convertedMythicIds = [];

const substitutionMap = {
    "cid_017_athena_commando_m": {
        stage: "stage3",
        image: "./styles/Renegade.png",
        overrideName: "OG Renegade Raider"
    },
    "cid_028_athena_commando_f": {
        stage: "mat3",
        image: "./styles/Aerial.png",
        overrideName: "OG Aerial Assault Trooper"
    },
    "cid_029_athena_commando_f_halloween": {
        stage: "mat3",
        image: "./styles/Ghoul.png",
        overrideName: "OG Ghoul Trooper"
    },
    "cid_030_athena_commando_m_halloween": {
        stage: "mat1",
        image: "./styles/Skull.png",
        overrideName: "OG Skull Trooper"
    },
    "cid_116_athena_commando_m_carbideblack": {
        stage: "stage5",
        image: "./styles/Omega.png",
        overrideName: "Omega (Lights)"
    },
    "cid_315_athena_commando_m_teriyakifish": {
        stage: "stage3",
        image: "./styles/Fishy.png",
        overrideName: "World Cup Fish Stick"
    },
    "cid_694_athena_commando_m_catburglar": {
        stage: "stage4",
        image: "./styles/GoldMidas.png",
        overrideName: "Gold Midas"
    },
    "cid_692_athena_commando_m_henchmantough": {
        stage: "stage4",
        image: "./styles/GoldBrutus.png",
        overrideName: "Gold Brutus"
    },
    "cid_693_athena_commando_m_buffcat": {
        stage: "stage4",
        image: "./styles/GoldMeowscles.png",
        overrideName: "Gold Meowscles"
    },
    "cid_691_athena_commando_f_tntina": {
        stage: "stage7",
        image: "./styles/GoldTNTina.png",
        overrideName: "Gold TNTina"
    },
    "cid_701_athena_commando_m_bananaagent": {
        stage: "stage4",
        image: "./styles/GoldAgentPeely.png",
        overrideName: "Gold Agent Peely"
    }
};

export function cosmeticType(id) {
    const x = id.toLowerCase();

    if (x.includes("cid") || x.includes("character_")) {
        return "Skins";
    }
    if (x.includes("bid_") || x.includes("backpack")) {
        return "Backblings";
    }
    if (x.includes("pickaxe_") || x.includes("pickaxe_id_") || x.includes("defaultpickaxe") || x.includes("halloweenscythe")) {
        return "Pickaxes";
    }
    if (x.includes("eid") || x.includes("emote")) {
        return "Emotes";
    }
    if (x.includes("glider") || x.includes("solo_umbrella")) {
        return "Gliders";
    }
    if (x.includes("contrail") || x.includes("trail")) {
        return "Contrails";
    }
    if (x.includes("wrap")) {
        return "Wraps";
    }
    if (x.includes("spray") || x.includes("spid")) {
        return "Sprays";
    }
    if (x.startsWith("banner_")) {
        return "Banners";
    }

    return "Other";
};

async function fortniteGet(url) {
    const r = await fetch(url);
    if (!r.ok) {
        throw new Error(`${r.status} ${url}`);
    }

    return r.json();
};

async function getCosmeticMeta(id) {
    try {
        const { data } = await fortniteGet(`https://fortnite-api.com/v2/cosmetics/br/${id}`);

        let rarity = data?.rarity?.displayValue || "Common";
        if (mythicIds.includes(id.toLowerCase())) {
            rarity = "Mythic";
        }

        return {
            id,
            name: data?.name || id,
            rarity
        };
    } catch {
        return {
            id,
            name: id,
            rarity: "Common"
        };
    }
};

async function dlImage(id) {
    const file = path.join(CACHE_DIR, `${id}.png`);
    if (fs.existsSync(file) && fs.statSync(file).size > 0) {
        return file;
    }

    const urls = [
        `https://fortnite-api.com/images/cosmetics/br/${id}/icon.png`,
        `https://fortnite-api.com/images/cosmetics/br/${id}/smallicon.png`
    ];
    for (let u of urls) {
        const r = await fetch(u);
        if (r.ok) {
            const ab = await r.arrayBuffer();
            fs.writeFileSync(file, Buffer.from(ab));
            return file;
        }
    }

    fs.copyFileSync(path.join("./images", "tbd.png"), file);

    return file;
};

export async function sortIdsByRarity(ids, itemOrder) {
    const infoList = await Promise.all(ids.map(id => getCosmeticMeta(id)));

    function getSortKey(info) {
        const rarity = info.rarity || "Common";
        const cosmeticId = info.id || "";
        const itemType = cosmeticType(cosmeticId);
        const itemOrderRank = itemOrder.indexOf(itemType) !== -1 ? itemOrder.indexOf(itemType) : itemOrder.length;
        const rarityRank = rarityPriority[rarity] || 999;
        const subRank = subOrder[cosmeticId] || 9999;

        return [itemOrderRank, rarityRank, subRank];
    }

    infoList.sort((a, b) => {
        const keyA = getSortKey(a);
        const keyB = getSortKey(b);
        for (let i = 0; i < keyA.length; i++) {
            if (keyA[i] !== keyB[i]) {
                return keyA[i] - keyB[i];
            }
        }

        return 0;
    });

    return infoList.map(info => info.id);
};

export function filterMythicIdsFunc(items, convertedMythicIds) {
    const mythicItems = [];
    for (const [itemType, idsList] of Object.entries(items)) {
        for (const cid of idsList) {
            if (mythicIds.includes(cid.toLowerCase()) || convertedMythicIds.includes(cid)) {
                mythicItems.push(cid);
            }
        }
    }

    return mythicItems;
};

function findSubstituteUrl(cosmetic, lockerData) {
    if (!lockerData) {
        return {};
    }

    const cid = cosmetic.id.toLowerCase();
    const override = substitutionMap[cid];
    if (!override) {
        return {};
    }

    const unlocked = lockerData.unlockedStyles?.[cid] || [];
    const matched = unlocked.map(x => x.toLowerCase()).includes(override.stage.toLowerCase());
    if (matched) {
        convertedMythicIds.push(cid);

        return {
            imagePath: override.image,
            name: override.overrideName || cosmetic.name,
            rarity: "Mythic"
        };
    }

    return {};
};

function strokedText(ctx, text, x, y, fz, fill, align) {
    ctx.font = `${fz}px "Burbank Big Rg Bk"`;
    ctx.textAlign = align;
    ctx.fillStyle = fill;
    ctx.strokeStyle = "black";
    ctx.lineWidth = 8;
    ctx.lineJoin = "round";
    ctx.miterLimit = 2;
    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);
};

async function drawTile({ id, name, rarity, overrideImage, lockerData }) {
    const bg = await loadImage(rarityBackgrounds[rarity] || rarityBackgrounds.Common);
    const c = createCanvas(bg.width, bg.height);
    const ctx = c.getContext("2d");
    ctx.drawImage(bg, 0, 0);

    const icon = await loadImage(overrideImage || await dlImage(id));
    ctx.drawImage(icon, 0, 0, bg.width, bg.height);

    const ovPath = rarityOverlay[rarity];
    if (ovPath && fs.existsSync(ovPath)) {
        const overlay = await loadImage(ovPath);
        ctx.drawImage(overlay, 0, 0);
    }

    const isFavorited = lockerData.favorited[id] === true;
    if (isFavorited) {
        const heart = await loadImage(HEART_PATH);
        const paddingTop = 10;
        const paddingRight = 10;
        const desiredWidth = 60;
        const desiredHeight = 60;
        const x = bg.width - desiredWidth - paddingRight;
        const y = paddingTop;

        ctx.drawImage(heart, x, y, desiredWidth, desiredHeight);
    }

    const txt = name.toUpperCase();
    let size = 40;

    ctx.textBaseline = "middle";

    let fz;
    for (; size > 10; size--) {
        fz = size;
        if (ctx.measureText(txt).width <= bg.width - 20) {
            break;
        }
    }

    strokedText(ctx, txt, bg.width / 2, bg.height * 0.88, fz, "white", "center");

    return c;
};

async function combineTiles(tiles, { username = "User", itemType = "Total" }) {
    const maxW = 1848;
    const baseCols = 6;
    const gap = 16;

    let cols = baseCols, rows = Math.ceil(tiles.length / cols);
    while (rows > cols) {
        cols++;
        rows = Math.ceil(tiles.length / cols);
    }

    const itemSize = Math.floor((maxW - (cols - 1) * gap) / cols);
    const headerH = 180;
    const W = cols * itemSize + (cols - 1) * gap;
    const H = headerH + rows * itemSize + (rows - 1) * gap;
    const cnv = createCanvas(W, H);
    const ctx = cnv.getContext("2d");

    ctx.fillStyle = "#0f0c0d";
    ctx.fillRect(0, 0, W, H);

    tiles.forEach((t, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
    
        let x = col * (itemSize + gap);
        let y = headerH + row * (itemSize + gap);
    
        if (row === rows - 1) {
            const tilesInLastRow = tiles.length % cols || cols;
            const emptySlots = cols - tilesInLastRow;
            const offsetX = (itemSize + gap) * (emptySlots / 2);
            x += offsetX;
        }
    
        ctx.drawImage(t, x, y, itemSize, itemSize);
    });

    const paddingX = 40;
    const elementGap = 25;
    const iconSize = headerH * 0.6;
    const fontSize = headerH / 2.5;
    const fontSizeDark = headerH / 4.5;

    const validTypes = ["Skins", "Backblings", "Pickaxes", "Emotes", "Gliders", "Contrails", "Wraps", "Sprays", "Exclusives"];

    let itemImage = null;
    if (validTypes.includes(itemType)) {
        itemImage = await loadImage(path.join("./", "images/items", `${itemType.toLowerCase()}.png`));
    }

    ctx.textBaseline = "middle";

    let xCursor = paddingX;
    const centerY = headerH / 2;

    if (itemImage) {
        const imgY = centerY - iconSize / 2;
        ctx.drawImage(itemImage, xCursor, imgY, iconSize, iconSize);
        xCursor += iconSize + elementGap;
    }

    const barHeight = fontSize * 2;
    const barWidth = 10;
    ctx.save();
    ctx.fillStyle = "#aaaaaa";
    ctx.translate(xCursor + barWidth / 2, centerY);
    ctx.rotate(8 * Math.PI / 180);
    ctx.fillRect(-barWidth / 2, -barHeight / 2, barWidth, barHeight);
    ctx.restore();

    xCursor += barWidth + (elementGap + 25);

    strokedText(ctx, `${tiles.length}`, xCursor, (centerY + 30) - (fontSize / 2) + 2, fontSize, "white", "left");
    strokedText(ctx, itemType, xCursor, (centerY + 30) + (fontSizeDark / 2) + 2, fontSizeDark, "#aaaaaa", "left");

    const submitText = "Submitted By";
    const submitTextWidth = ctx.measureText(submitText).width;
    const usernameText = `${username}`;
    const usernameTextWidth = ctx.measureText(usernameText).width;
    const usernameImageHeight = fontSizeDark;
    const usernameImageWidth = usernameImageHeight * 1.4;
    const totalTextWidth = submitTextWidth + usernameTextWidth + usernameImageWidth + 30;
    const usernameTextRightX = W - paddingX;
    const usernameImageX = usernameTextRightX - totalTextWidth + submitTextWidth + 10;
    const usernameImageY = (centerY + 30) + (fontSizeDark / 2) + 2 - (usernameImageHeight / 2);
    const usernameImage = await loadImage(DISCORD_PATH);

    ctx.drawImage(usernameImage, usernameImageX, usernameImageY, usernameImageWidth, usernameImageHeight);

    strokedText(ctx, submitText, usernameTextRightX, (centerY + 30) - (fontSize / 2) + 2, fontSize, "white", "right");
    strokedText(ctx, usernameText, usernameTextRightX, (centerY + 30) + (fontSizeDark / 2) + 2, fontSizeDark, "#aaaaaa", "right");

    return cnv.toBuffer("image/png");
};

export async function createLocker(ids, username = "User", itemType = "Total", lockerData = null) {
    const metas = await Promise.all(ids.map(id => getCosmeticMeta(id)));
    for (let m of metas) {
        const override = findSubstituteUrl(m, lockerData);
        if (override.imagePath) {
            m.overrideImage = override.imagePath;
            m.name = override.name;
            m.rarity = override.rarity;
        }
    }

    metas.sort((a, b) => {
        const r = rarityPriority[a.rarity] - rarityPriority[b.rarity];
        if (r !== 0) {
            return r;
        }

        return (subOrder[a.id] || 9999) - (subOrder[b.id] || 9999);
    });

    const tiles = [];
    for (let m of metas) {
        tiles.push(await drawTile({
            id: m.id,
            name: m.name,
            rarity: m.rarity,
            overrideImage: m.overrideImage,
            lockerData
        }));
    }

    return combineTiles(tiles, {
        username,
        itemType
    });
};