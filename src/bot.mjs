import {Bot, session} from "grammy";
import {kv as instance} from "@vercel/kv";
import {RedisAdapter} from "@grammyjs/storage-redis";

instance.opts.automaticDeserialization = false;

const storage = new RedisAdapter({instance, ttl: 10});

export const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);

bot.use(
    session({
        initial: () => ({counter: 0}),
        storage,
    }),
);

bot.command('stats', ctx => ctx.reply(`Already got ${ctx.session.counter} photos!`));

bot.on(':photo', ctx => ctx.session.counter++);

bot.on("message:text", async ctx => ctx.reply(ctx.msg.text));

export default bot;
