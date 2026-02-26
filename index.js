const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Events
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
  ]
});

// 🔥 設定
const GUILD_ROLE_ID = "1446152521776369864";
const TARGET_CHANNEL_ID = "1466645408502645021";
const BUTTON_MESSAGE_TAG = "【山賊輸送通知ボタン】"; // 識別用

client.once(Events.ClientReady, async () => {
  console.log("Bot起動成功");

  const channel = await client.channels.fetch(TARGET_CHANNEL_ID);

  // 🔎 直近50件から既存ボタンを探す
  const messages = await channel.messages.fetch({ limit: 50 });
  const existing = messages.find(msg =>
    msg.author.id === client.user.id &&
    msg.content.includes(BUTTON_MESSAGE_TAG)
  );

  if (existing) {
    console.log("既存ボタンあり → 作成しません");
    return;
  }

  // ボタン作成
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("15min")
      .setLabel("山賊輸送15分前")
      .setStyle(ButtonStyle.Danger),

    new ButtonBuilder()
      .setCustomId("10min")
      .setLabel("山賊輸送10分前")
      .setStyle(ButtonStyle.Primary)
  );

  await channel.send({
    content: BUTTON_MESSAGE_TAG,
    components: [row]
  });

  console.log("ボタン新規作成");
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isButton()) return;

  // チャンネル制限
  if (interaction.channel.id !== TARGET_CHANNEL_ID) {
    return interaction.reply({
      content: "このチャンネルでは使えません。",
      ephemeral: true
    });
  }

  if (interaction.customId === "15min") {
    await interaction.reply({
      content: `<@&${GUILD_ROLE_ID}> 山賊輸送15分前です！`,
      allowedMentions: { roles: [GUILD_ROLE_ID] }
    });
  }

  if (interaction.customId === "10min") {
    await interaction.reply({
      content: `<@&${GUILD_ROLE_ID}> 山賊輸送10分前です！`,
      allowedMentions: { roles: [GUILD_ROLE_ID] }
    });
  }
});

client.login(process.env.TOKEN);