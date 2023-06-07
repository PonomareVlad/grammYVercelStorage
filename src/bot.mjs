import {Bot, session} from "grammy";
import {MongoClient} from "mongodb";
import {MongoDBAdapter} from "@grammyjs/storage-mongodb";

const {TELEGRAM_BOT_TOKEN, MONGODB_URI} = process.env;

export const bot = new Bot(TELEGRAM_BOT_TOKEN);
export const client = await MongoClient.connect(MONGODB_URI);
export const collection = client.db("grammY").collection("users");

bot.use(
    session({
        initial: () => ({counter: 0}),
        storage: new MongoDBAdapter({collection}),
    })
);

bot.command("stats", ctx => ctx.reply(`Already got ${ctx.session.counter} photos!`));

bot.on(":photo", ctx => ctx.session.counter++);

bot.on("message:text", async ctx => ctx.reply(ctx.msg.text));

export default bot;
