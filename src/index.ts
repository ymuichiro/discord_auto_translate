import { Client, Intents } from "discord.js";
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
  console.log(json);
  return json.translations[0].text;
};

client.on("ready", () => {
  console.log(`Logged in as ${client.user?.tag}`);
});

client.on("messageCreate", async (message) => {

  // 翻訳対象のチャンネルIDを検出
  if (message.channelId !== "971771804282654783") {
    return;
  }

  // 結果を専用チャンネルへ送信
  const channel = client.channels.cache.get("971780283978371114");

  if (channel === undefined) {
    console.log("対象のチャンネル名が見つかりませんでした");

  } else {

    const to = await translateEnToJP(message.content);
    (channel as any).send(`${message.content}\n-------------\n${to}`);

  }
});

client.login(process.env.TOKEN);
