const { Events } = require("discord.js");
const { embeds } = require("../commands/artery");
const Mutex = require('async-mutex').Mutex;

// Mutex
const mutex = new Mutex();

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isButton()) return;
        if (!['skills', 'imprints', 'uniqueEquipment', 'design'].includes(interaction.customId)) return;
        if (!interaction.guild.members.me.permissionsIn(interaction.channel).has([PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.UseExternalEmojis])) {
            await interaction.reply("nep does not have permission to send messages here.");
            return;
        }
        await mutex.runExclusive(async () => {
            let profile = embeds[interaction.message.id];
            // if embeds have expired
            if (!profile) {
                interaction.reply({ content: "This button has expired. Please look up the skin again with /character", ephemeral: true });
                return;
            }

            // Defer update
            interaction.deferUpdate();

            // Edit embed
            try {
                interaction.message.editable ? await interaction.message.edit({ embeds: [profile[interaction.customId]] }) : await interaction.reply({ content: "nep doesn't have permission to edit this message", ephemeral: true });
            } catch (error) {
                console.error(error);
                if (!interaction.replied) await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }

        })
    }
}