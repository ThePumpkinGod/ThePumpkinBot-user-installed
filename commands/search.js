const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lookup')
    .setDescription('ask pumpkin bot to search something online!')

    .setContexts(1, 2, 0)
    .setIntegrationTypes(1)

    .addStringOption(option =>
      option.setName('input')
        .setDescription('what do you want to look up?')
        .setRequired(true)),

  async execute(interaction) {
    if (interaction.user.id === '216862330724548608') {

      await interaction.deferReply();
      let question = interaction.options.getString('input');

      let data = JSON.stringify({
        "messages": [
          { "role": 'user', "content": question }
        ],
        "stream": false
      });

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.theb.ai/v1/search/completions',
        headers: {
          'Authorization': `Bearer ${process.env.aiToken}`,
          'Content-Type': 'application/json'
        },
        data: data
      };

      axios.request(config)
        .then((response) => {
          let msgTooLong = response.data.choices[0].message.content;
          if (msgTooLong.length > 1999) {
            interaction.editReply(`the output is too long, please try something else`);
          } else {
            interaction.editReply(`${response.data.choices[0].message.content}`);
          }
        })
        .catch((error) => {
          console.log(error);
        });

    }
  },
};
