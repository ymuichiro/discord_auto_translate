import { Client, Intents, TextChannel, MessageEmbed } from "discord.js";
import dotenv from "dotenv";
import fetch from "node-fetch";
dotenv.config();

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
  ]
});

const LangEnum = {
  jp: "JA",
  en: "EN"
};

/**
 * @param {string} text
 * @returns {string}
 */
const translateEnToJP = async (text: string): Promise<string> => {
  const url = `https://api-free.deepl.com/v2/translate?auth_key=${process.env.DEEPL}&text=${text}&target_lang=${LangEnum.jp}`;
  const res = await fetch(url);
  const json = await res.json() as any;
  return json.translations[0].text;
};


client.on("ready", () => {
  console.log(`Logged in as ${client.user?.tag}`);
});


client.on("messageCreate", async (message) => {

  if (message.channelId !== process.env.TARGET_CHANNEL_ID) {
    return;
  }

  const channel = client.channels.cache.get(process.env.RESULT_CHANNEL_ID!);

  if (channel === undefined) {
    console.log("対象のチャンネル名が見つかりませんでした");

  } else {

    const translated = await translateEnToJP(message.content);
    const embed = new MessageEmbed()
      .setAuthor({ name: message.author.username, iconURL: message.author.avatarURL()! })
      .setFields({ name: translated, value: message.content });

    (channel as TextChannel).send({ embeds: [embed] });

  }
});


client.login(process.env.TOKEN);
