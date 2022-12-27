const { SlashCommandBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require("discord.js");
const { bestMatch } = require("../functions/bestMatch");
const { createCharacterEmbed } = require("../functions/createCharacterSkillEmbed");

const embeds = {};

// TODO: ADD emojis for substats

let actionRow = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('skills')
            .setLabel('Skills')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId('imprints')
            .setLabel('Imprints')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId('uniqueEquipment')
            .setLabel('UE')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId('design')
            .setLabel('Design')
            .setStyle(ButtonStyle.Primary),
    )

module.exports = {
    data: new SlashCommandBuilder()
        .setName('artery')
        .setDescription('Displays the information of a mech girl')
        .addStringOption(option => 
            option.setName('name')
                .setDescription('name of the character')
                .setRequired(true)),
    async execute(interaction) {
        try {
            // * Parse name and create embeds with said name
            const name = interaction.options.getString('name').toLowerCase().trim();
            let profile = await createCharacterEmbed(name);
    
            if (profile) {
                await interaction.reply({ embeds: [profile.skills], components: [actionRow] });

            // * Find the closest name instead and return if can't find one
            } else {
                let match = bestMatch(name, 'character');
                if (match) {
                    profile = await createCharacterEmbed(match);
                    await interaction.reply({ embeds: [profile.skills], components: [actionRow] });
                } else {
                    await interaction.reply({ content: "Couldn't find the character!", ephemeral: true });
                    return;
                }
            }

            // * Store the embeds and delete it after 30 minutes
            let rep = await interaction.fetchReply();
            embeds[rep.id] = profile;
            setTimeout(() => { delete embeds[rep.id] }, 1800000);
        } catch (error) {
            console.error(error);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }

    },
    embeds
}