```javascript
const { SlashCommandBuilder } = require('discord.js');
const {  MusicService } = require('../services/musicService');
const { QueueService } = require('../services/queueService');
const yargs = require('yargs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Plays a song')
    .addStringOption(option =>
      option
        .setName('query')
        .setDescription('The song you want to play')
        .setRequired(true)
    ),
  async execute(interaction) {
    const query = interaction.options.getString('query');
    const musicService = new MusicService();
    const queueService = new QueueService(interaction);

    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      await interaction.reply('You need to be in a voice channel to play music!');
      return;
    }

    try {
      // Fetch song information from supported platforms
      const songInfo = await musicService.searchAndSelectSong(query, interaction);

      // Add song to the queue
      const queue = await queueService.addToQueue(songInfo);

      // If the queue is empty, play the song immediately
      if (queue.length === 1) {
        queueService.playSong(queue[0]);
      }

      await interaction.reply(`Added ${songInfo.title} to the queue!`);
    } catch (error) {
      console.error(error);
      await interaction.reply('An error occurred while playing the song!');
    }
  },
};

```