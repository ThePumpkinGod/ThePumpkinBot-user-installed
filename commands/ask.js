const { SlashCommandBuilder } = require('discord.js');
const { OpenAI } = require("openai");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ask')
    .setDescription('ask pumpkin bot something!')

    .setContexts(1, 2, 0)
    .setIntegrationTypes(1)

    .addStringOption(option =>
      option.setName('input')
        .setDescription('what do you want to ask?')
        .setRequired(true)),

  async execute(interaction) {
    if (interaction.user.id === '216862330724548608') {

      await interaction.deferReply();
      let question = interaction.options.getString('input');

      const openai = new OpenAI({
        apiKey: process.env.aiToken,
        baseURL: 'https://api.theb.ai/v1'
      });

      async function fetchChatCompletion() {
        const result = await openai.chat.completions.create({
          model: 'theb-ai',
          stream: false,
          model_params: {
            temperature: 0.5
          },
          messages: [
            { role: 'system', content: 'You are a helpful assistant named "Pumpkin Bot", all your message will be sent in discord so please use the discord formatting like every other discord user would!' },
            { role: 'user', content: question }
          ],
        });

        let msgTooLong = result.choices[0].message.content;
        if (msgTooLong.length > 1999) {
          await interaction.editReply(`the output is too long, please try something else`);
        } else {
          await interaction.editReply(`${result.choices[0].message.content}`);
        }

      }
      fetchChatCompletion();
    }
  },
};
