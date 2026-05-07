const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '../.env' });

const prisma = new PrismaClient();
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands = [
  {
    name: 'set-tier',
    description: 'Actualiza el tier de un usuario en la página',
    options: [
      {
        name: 'discord_user',
        type: 6, // USER type
        description: 'El usuario al que se le asignará el tier',
        required: true,
      },
      {
        name: 'category',
        type: 3, // STRING type
        description: 'Categoría (ej: Pot, NethOP, Overall)',
        required: true,
        choices: [
          { name: 'Pot', value: 'Pot' },
          { name: 'NethOP', value: 'NethOP' },
          { name: 'Overall', value: 'Overall' },
          { name: 'Vanilla', value: 'Vanilla' }
        ]
      },
      {
        name: 'tier',
        type: 3, // STRING type
        description: 'Nivel del tier (ej: HT1, T1, T2)',
        required: true,
      }
    ]
  }
];

client.once('ready', async () => {
  console.log(`Bot conectado como ${client.user.tag}`);
  
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);
  try {
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands }
    );
    console.log('Comandos slash registrados.');
  } catch (error) {
    console.error(error);
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'set-tier') {
    // Only allow admins or testers (you should add role checks here)
    const targetUser = interaction.options.getUser('discord_user');
    const category = interaction.options.getString('category');
    const tier = interaction.options.getString('tier');

    try {
      // Find the user in DB
      const dbUser = await prisma.user.findUnique({
        where: { id: targetUser.id } // Requires NextAuth to use Discord IDs as User IDs
      });

      if (!dbUser) {
        return interaction.reply({ content: 'Este usuario no ha iniciado sesión en la web de Bedrock Hub aún.', ephemeral: true });
      }

      // Upsert the tier ranking
      await prisma.tierRanking.upsert({
        where: {
          userId_category: {
            userId: dbUser.id,
            category: category
          }
        },
        update: { tier: tier },
        create: {
          userId: dbUser.id,
          category: category,
          tier: tier
        }
      });

      await interaction.reply(`✅ El tier de **${targetUser.username}** ha sido actualizado a **${tier}** en la categoría **${category}**.`);
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: 'Hubo un error al actualizar la base de datos.', ephemeral: true });
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
