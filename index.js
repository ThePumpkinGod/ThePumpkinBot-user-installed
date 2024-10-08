const fs = require('node:fs');
const path = require('node:path');
require("dotenv").config();
const sqlite = require("sqlite3").verbose();


const { REST } = require('@discordjs/rest');
const { PermissionFlagsBits, PermissionsBitField, Client, Collection, GatewayIntentBits, SlashCommandBuilder, Routes, EmbedBuilder } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
}	

client.once('ready', () => {
  console.log('Ready!');

  // updating all the commands
  let clientId = process.env.clientId;
  let token = process.env.DISCORD_BOT_TOKEN;

  let rest = new REST({ version: '10' }).setToken(token);

  let commands = [];
  let commandsPath = path.join(__dirname, 'commands');
  let commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  for (let file of commandFiles) {
    let filePath = path.join(commandsPath, file);
    let command = require(filePath);
    commands.push(command.data.toJSON());
  }

  rest.put(Routes.applicationCommands(clientId), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);
});

// calls the command
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }

});


client.login(process.env.DISCORD_BOT_TOKEN);
