const { EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");
const { randomColor } = require("./randomColor");


async function createCharacterEmbed(name) {
    const response = await fetch(`https://www.prydwen.gg/page-data/artery-gear/characters/${name.replace(/ /g, "-").trim().toLowerCase()}/page-data.json`);
    
    // Send suggestion if can't find the character
    if (response.status != 200) return false;

    // JSONify
    let json = await response.json();
    json = json.result.data.currentUnit.nodes[0];

    let skill1 = json.skill1Details;
    let skill2 = json.skill2Details;
    let skill3 = json.skill3Details;

    skill1.cooldown ? skill1.cooldown = `[${skill1.cooldown} turns]` : skill1.cooldown = '' ;
    skill2.cooldown ? skill2.cooldown = `[${skill2.cooldown} turns]` : skill2.cooldown = '' ;
    skill3.cooldown ? skill3.cooldown = `[${skill3.cooldown} turns]` : skill3.cooldown = '' ;

    skill1.description = skill1.description.replace(/<strong class=".{1,8}">/g, "**").replace(/<\/strong>/g, "**").replace(/<br \/>/g, '\n');;
    skill2.description = skill2.description.replace(/<strong class=".{1,8}">/g, "**").replace(/<\/strong>/g, "**").replace(/<br \/>/g, '\n');;
    skill3.description = skill3.description.replace(/<strong class=".{1,8}">/g, "**").replace(/<\/strong>/g, "**").replace(/<br \/>/g, '\n');;

    // * Create skills embed
    let skills = new EmbedBuilder()
        .setTitle(`[${RARITIES[json.rarity] ?? json.rarity}] ${json.fullName}`)
        .setDescription(`[Check out our detailed ratings and reviews](https://www.prydwen.gg/artery-gear/characters/${name.trim().replace(/ /g, "-").toLowerCase()})`)
        .setThumbnail(`https://prydwen.gg${json.smallAvatar.localFile.childImageSharp.gatsbyImageData.images.fallback.src}`)
        .setColor(randomColor())
        .setTimestamp()
        .setFooter({ text: 'nepnep#1358', iconURL: 'https://store.playstation.com/store/api/chihiro/00_09_000/container/BE/nl/19/EP0031-CUSA03124_00-AV00000000000037/image?w=320&h=320&bg_color=000000&opacity=100&_version=00_09_000' })
        .addFields(
            // Field 1.1 (Details left)
            { name: 'DETAILS & STATS', value: `**Class**: ${CLASSES[json.class] ?? json.class}\n<:attribute_hp:1040980534123298826>**HP**: ${json.attributes.hp}\n<:attribute_def:1040980532458168421>**DEF**: ${json.attributes.def}`, inline: true },        
            
            // Field 1.2 (Details right)                            
            { name: '\u200b', value: `**Weapon**: ${COLORS[json.color] ?? json.color}\n<:attribute_atk:1040980530629447680>**ATK**: ${json.attributes.atk}\n<:attribute_spd:1040980535914274876>**SPD**: ${json.attributes.spd}`, inline: true },

            // Field 3 (Ratings)               
            { name: 'RATINGS', value: `**PVE**: ${RATINGS[json.ratings.pve] ?? '?'}` + ' ' + `**PVP**: ${RATINGS[json.ratings.pvp] ?? '?'}` + ' ' + `**Red**: ${RATINGS[json.ratings.raidRed] ?? '?'}` + ' ' + `**Green**: ${RATINGS[json.ratings.raidGreen] ?? '?'}` + ' ' + `**Blue**: ${RATINGS[json.ratings.raidBlue] ?? '?'}` },

            // Skill 1
            { name: 'SKILLS', value: `**${skill1.name} ${skill1.cooldown}**\n${skill1.description}`},

            // Skill 2
            { name: '\u200b', value: `**${skill2.name} ${skill2.cooldown}**\n${skill2.description}`},

            // Skill 3
            { name: '\u200b', value: `**${skill3.name} ${skill3.cooldown}**\n${skill3.description}`},
        );

    // Create imprints embed
    let imprints = json.imprints;
    let value = '';
    if (!imprints) {
        value = '**The imprints are not available for this character yet**\nWe will add them soon as it is possible!';
    } else {
        let selfBuff = Object.keys(imprints).filter((key) => /rank.Self/.test(key));
        let partyBuff = Object.keys(imprints).filter((key) => /rank.Party/.test(key));
        
        for (let i = 0; i < selfBuff.length; i++) {
            value += `**Rank ${i + 1}**: ${ATTRIBUTES[imprints.selfStat] ?? imprints.selfStat} +${imprints[selfBuff[i]]}`;
            if (imprints[partyBuff[i]]) {
                value += ` and ${ATTRIBUTES[imprints.partyStat] ?? imprints.partyStat} +${imprints[partyBuff[i]]} (Party, excluding self)`;
            }
            value += '\n';
        }
    }

    // * Imprints
    let imprintsField = new EmbedBuilder()
        .setTitle(`[${RARITIES[json.rarity] ?? json.rarity}] ${json.fullName}`)
        .setDescription(`[Check out our detailed ratings and reviews](https://www.prydwen.gg/artery-gear/characters/${name.trim().replace(/ /g, "-").toLowerCase()})`)
        .setThumbnail(`https://prydwen.gg${json.smallAvatar.localFile.childImageSharp.gatsbyImageData.images.fallback.src}`)
        .setColor(randomColor())
        .setTimestamp()
        .setFooter({ text: 'nepnep#1358', iconURL: 'https://store.playstation.com/store/api/chihiro/00_09_000/container/BE/nl/19/EP0031-CUSA03124_00-AV00000000000037/image?w=320&h=320&bg_color=000000&opacity=100&_version=00_09_000' })
        .addFields(
            // Field 1.1 (Details left)
            { name: 'DETAILS & STATS', value: `**Class**: ${CLASSES[json.class] ?? json.class}\n<:attribute_hp:1040980534123298826>**HP**: ${json.attributes.hp}\n<:attribute_def:1040980532458168421>**DEF**: ${json.attributes.def}`, inline: true },        
            
            // Field 1.2 (Details right)                            
            { name: '\u200b', value: `**Weapon**: ${COLORS[json.color] ?? json.color}\n<:attribute_atk:1040980530629447680>**ATK**: ${json.attributes.atk}\n<:attribute_spd:1040980535914274876>**SPD**: ${json.attributes.spd}`, inline: true },

            // Field 3 (Ratings)               
            { name: 'RATINGS', value: `**PVE**: ${RATINGS[json.ratings.pve] ?? '?'}` + ' ' + `**PVP**: ${RATINGS[json.ratings.pvp] ?? '?'}` + ' ' + `**Red**: ${RATINGS[json.ratings.raidRed] ?? '?'}` + ' ' + `**Green**: ${RATINGS[json.ratings.raidGreen] ?? '?'}` + ' ' + `**Blue**: ${RATINGS[json.ratings.raidBlue] ?? '?'}` },

            // Imprints
            { name: 'IMPRINTS' , value: value }
        );

    // * Unique Equipment
    let ueInfo = json.uniqueEquipmentInfo;
    let ueSkill = ueInfo.skill.replace(/<strong class=".{1,8}">/g, "**").replace(/<\/strong>/g, "**").replace(/<br \/>/g, '\n');

    let ue = new EmbedBuilder()
        .setTitle(`[${RARITIES[json.rarity] ?? json.rarity}] ${json.fullName}`)
        .setDescription(`[Check out our detailed ratings and reviews](https://www.prydwen.gg/artery-gear/characters/${name.trim().replace(/ /g, "-").toLowerCase()})`)
        .setThumbnail(`https://prydwen.gg${json.smallAvatar.localFile.childImageSharp.gatsbyImageData.images.fallback.src}`)
        .setColor(randomColor())
        .setTimestamp()
        .setFooter({ text: 'nepnep#1358', iconURL: 'https://store.playstation.com/store/api/chihiro/00_09_000/container/BE/nl/19/EP0031-CUSA03124_00-AV00000000000037/image?w=320&h=320&bg_color=000000&opacity=100&_version=00_09_000' })
        .addFields(
            // Field 1.1 (Details left)
            { name: 'DETAILS & STATS', value: `**Class**: ${CLASSES[json.class] ?? json.class}\n<:attribute_hp:1040980534123298826>**HP**: ${json.attributes.hp}\n<:attribute_def:1040980532458168421>**DEF**: ${json.attributes.def}`, inline: true },        
            
            // Field 1.2 (Details right)                            
            { name: '\u200b', value: `**Weapon**: ${COLORS[json.color] ?? json.color}\n<:attribute_atk:1040980530629447680>**ATK**: ${json.attributes.atk}\n<:attribute_spd:1040980535914274876>**SPD**: ${json.attributes.spd}`, inline: true },

            // Field 3 (Ratings)               
            { name: 'RATINGS', value: `**PVE**: ${RATINGS[json.ratings.pve] ?? '?'}` + ' ' + `**PVP**: ${RATINGS[json.ratings.pvp] ?? '?'}` + ' ' + `**Red**: ${RATINGS[json.ratings.raidRed] ?? '?'}` + ' ' + `**Green**: ${RATINGS[json.ratings.raidGreen] ?? '?'}` + ' ' + `**Blue**: ${RATINGS[json.ratings.raidBlue] ?? '?'}` },
        );
    
    //
    if (!ueInfo.name) {
        ue.addFields({ name: 'UNIQUE EQUIPMENT', value: "**This character currently doesn't have Unique Equipment**"})
    } else {
        ue.addFields({ name: 'UNIQUE EQUIPMENT', value: `**${ueInfo.name}**\n**Bonus stats (based on level 30 UE)**:\n -${ueInfo.stats.stat1}\n -${ueInfo.stats.stat2}\n -${ueInfo.stats.stat3}\n**Bonus skill effect**:\n${ueSkill}`})
          .setImage(`https://prydwen.gg/${json.uniqueEquipmentImage.localFile.childImageSharp.gatsbyImageData.images.fallback.src}`);
    }

    // * Design
    let design = new EmbedBuilder()
        .setTitle(`[${RARITIES[json.rarity] ?? json.rarity}] ${json.fullName}`)
        .setDescription(`[Check out our detailed ratings and reviews](https://www.prydwen.gg/artery-gear/characters/${name.trim().replace(/ /g, "-").toLowerCase()})`)
        .setColor(randomColor())
        .setTimestamp()
        .setImage(`https://prydwen.gg${json.fullImage.localFile.childImageSharp.gatsbyImageData.images.fallback.src}`)
        .setFooter({ text: 'nepnep#1358', iconURL: 'https://store.playstation.com/store/api/chihiro/00_09_000/container/BE/nl/19/EP0031-CUSA03124_00-AV00000000000037/image?w=320&h=320&bg_color=000000&opacity=100&_version=00_09_000' })

    return {
        skills: skills,
        imprints: imprintsField,
        uniqueEquipment: ue,
        design: design,
    };
}


module.exports = { createCharacterEmbed };


const RATINGS = {
    "4": "<:F_:1037311733833928704>",
    "5": "<:D_:1024285330217640038>",
    "6": "<:C_:1024285328246313041>",
    "7": "<:B_:1024285326270808094>",
    "8": "<:A_:1024285324345622529>",
    "9": "<:S_:1024285317643108383>",
    "10": "<:SS:1024285320268746762>",
    "11": "<:SSS:1024285322433015858>"
};

const COLORS = {
    'Blue': 'Thunder',
    'Red': 'Molten',
    'Green': 'Crystal',
};

const CLASSES = {
    'Assault': '<:class_assault:1040927600094220319> Assault',
    'Balanced': '<:class_balanced:1040927602015215686> Balanced',
    'Healer': '<:class_healer:1040927593538519040> Healer',
    'Tactics': '<:class_tactics:1040927595346284677> Tactics',
    'Tank': '<:class_tank:1040927597942554624> Tank',
}

const ATTRIBUTES = {
    'ATK': '<:attribute_atk:1040980530629447680> ATK',
    'DEF': '<:attribute_def:1040980532458168421> DEF',
    'HP': '<:attribute_hp:1040980534123298826> HP',
    'SPD': '<:attribute_spd:1040980535914274876> SPD',
    'CRIT': '<:attribute_critchance:1041358246637748256> Critical Chance',
    'CRIT DMG': '<:attribute_critdmg:1041358248076398613> Critical Damage',
    'DUAL': '<:attribute_dual:1041359677855903804> DUAL Attack Chance',
    'HIT': '<:attribute_hit:1041358270096478208> Status ACC',
    'RES': '<:attribute_res:1041358287599317083> Resistance'
}

const RARITIES = {
    'Rare': '★★★',
    'Epic': '★★★★',
    'Legend': '★★★★★'
}