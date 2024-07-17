```javascript
const { SlashCommandBuilder } = require('discord.js');
const { Queue } = require('discord-music-player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pauses the currently playing song'),
  async execute(interaction) {
    const queue = interaction.client.player.getQueue(interaction.guildId);

    if (!queue || !queue.playing) {
      await interaction.reply({ content: 'There is no music playing right now!', ephemeral: true });
      return;
    }

    queue.setPaused(true);
    await interaction.reply({ content: 'Music paused!' });
  },
};

```