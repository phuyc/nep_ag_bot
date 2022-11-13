const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Database = require("better-sqlite3");
const { randomColor } = require("../functions/randomColor");
const db = Database("./ag.db");

function createList(rarity) {
    let characters = db.prepare(`SELECT name FROM characters WHERE rarity=? ORDER BY rarity, name;`);
    let field = '';
    for (let character of characters.iterate(rarity)) {
        field += character.name + ', ';
    }
    return field.slice(0, -2);
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
        let rarities = db.prepare(`SELECT DISTINCT rarity FROM characters ORDER BY rarity;`);
        for (let rarity of rarities.iterate()) {
            let field = createList(rarity.rarity);
            list.addFields({ name: `[${rarity.rarity}]`, value: field });
        }

        interaction.reply({ embeds: [list] });
    }
}