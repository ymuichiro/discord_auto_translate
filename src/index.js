var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const translateEnToJP = (text) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `https://api-free.deepl.com/v2/translate?auth_key=${process.env.DEEPL}&text=${text}&target_lang=${LangEnum.jp}`;
    console.log(url);
    const res = yield fetch(url);
    const json = yield res.json();
    console.log(json);
    return json.translations[0].text;
});
client.on("ready", () => {
    var _a;
    console.log(`Logged in as ${(_a = client.user) === null || _a === void 0 ? void 0 : _a.tag}`);
});
client.on("messageCreate", (message) => __awaiter(void 0, void 0, void 0, function* () {
    // 翻訳対象のチャンネルIDを検出
    if (message.channelId !== "971771804282654783") {
        return;
    }
    // 結果を専用チャンネルへ送信
    const channel = client.channels.cache.get("971780283978371114");
    if (channel === undefined) {
        console.log("対象のチャンネル名が見つかりませんでした");
    }
    else {
        const to = yield translateEnToJP(message.content);
        channel.send(`${message.content}\n-------------\n${to}`);
    }
}));
client.login(process.env.TOKEN);
