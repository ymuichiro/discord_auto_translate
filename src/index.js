var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Client, Intents, MessageEmbed } from "discord.js";
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
const translateEnToJP = (text) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `https://api-free.deepl.com/v2/translate?auth_key=${process.env.DEEPL}&text=${text}&target_lang=${LangEnum.jp}`;
    const res = yield fetch(url);
    const json = yield res.json();
    return json.translations[0].text;
});
client.on("ready", () => {
    var _a;
    console.log(`Logged in as ${(_a = client.user) === null || _a === void 0 ? void 0 : _a.tag}`);
});
client.on("messageCreate", (message) => __awaiter(void 0, void 0, void 0, function* () {
    if (message.channelId !== process.env.TARGET_CHANNEL_ID) {
        return;
    }
    const channel = client.channels.cache.get(process.env.RESULT_CHANNEL_ID);
    if (channel === undefined) {
        console.log("対象のチャンネル名が見つかりませんでした");
    }
    else {
        const translated = yield translateEnToJP(message.content);
        const embed = new MessageEmbed()
            .setAuthor({ name: message.author.username, iconURL: message.author.avatarURL() })
            .setFields({ name: translated, value: message.content });
        channel.send({ embeds: [embed] });
    }
}));
client.login(process.env.TOKEN);
