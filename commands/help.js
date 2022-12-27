const { EmbedBuilder } = require("@discordjs/builders");
const { SlashCommandBuilder } = require("discord.js");
const { randomColor } = require("../functions/randomColor");

const help = new EmbedBuilder()
.setTitle('List of commands')
.setDescription('/help')
.setThumbnail('https://img-10.stickers.cloud/packs/977bc206-85d3-4882-bd71-a8ab12956a4e/webp/c8bf8419-c2e4-4810-ab71-862dfb67614e.webp')
.addFields(
    { name: '/artery', value: 'Looks up a mech girl\'s profile. The returned embeds can be used within 30 minutes.\n**Example: /artery 04**' },
    { name: '/list', value: 'Displays a list of characters.'},
    { name: '/ping', value: 'Return latency.' },
    { name: '/help', value: 'Displays this message' },
    { name: '/info', value: 'Displays bot info.' }
)
.setImage('https://gamek.mediacdn.vn/133514250583805952/2022/6/16/photo-1-1655352416947989026795.jpg')
.setTimestamp()
.setFooter({ text: 'nepnep#1358', iconURL: 'https://store.playstation.com/store/api/chihiro/00_09_000/container/BE/nl/19/EP0031-CUSA03124_00-AV00000000000037/image?w=320&h=320&bg_color=000000&opacity=100&_version=00_09_000' });


module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Displays list of commands'),
    async execute(interaction) {
        await interaction.reply({ embeds: [help.setColor(randomColor())] });
    }
}