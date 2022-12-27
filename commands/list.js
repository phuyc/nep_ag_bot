const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Database = require("better-sqlite3");
const { randomColor } = require("../functions/randomColor");
const db = Database("./ag.db");

function createList(rarity) {
    let fields = [];
    let characters = db.prepare(`SELECT name FROM characters WHERE rarity=? ORDER BY name;`);
    let field = '';
    for (let character of characters.iterate(rarity)) {
        if (field.length <= 1024) { 
            field += character.name + ', ';
        } else {
            fields.push(field.slice(0, -2));
            field = character.name;
        }
    }
    fields.push(field.slice(0, -2))

    return fields;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('list')
        .setDescription('Returns a list of characters'),
    execute(interaction) {
        // TODO: handle list
        // List embed
        let list = new EmbedBuilder()
            .setTitle(`Character list`)
            .setColor(randomColor())
            .setThumbnail('https://i.pinimg.com/originals/89/9a/1d/899a1d0225823422518cdb38a81bd290.png')
            .setTimestamp()
            .setFooter({ text: 'nepnep#1358', iconURL: 'https://store.playstation.com/store/api/chihiro/00_09_000/container/BE/nl/19/EP0031-CUSA03124_00-AV00000000000037/image?w=320&h=320&bg_color=000000&opacity=100&_version=00_09_000' })
        

        // Create field for each rarity
        let rarities = db.prepare(`SELECT DISTINCT rarity FROM characters ORDER BY CASE rarity WHEN 'Rare' THEN 0 WHEN 'Epic' THEN 1 WHEN 'Legend' THEN 2 END;`);
        for (let rarity of rarities.iterate()) {
            let fields = createList(rarity.rarity);
            for (let field of fields) {
                if (fields.indexOf(field) == 0) list.addFields({ name: `[${RARITIES[rarity.rarity]}]`, value: field });
                else list.addFields({ name: `~~~~~~`, value: field });
            }
        }

        interaction.reply({ embeds: [list] });
    }
}

const RARITIES = {
    'Rare': '★★★',
    'Epic': '★★★★',
    'Legend': '★★★★★'
}