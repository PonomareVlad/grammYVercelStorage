import {Bot, session} from "grammy";
import {createClient} from "@vercel/postgres";
import {PsqlAdapter} from "@grammyjs/storage-psql";

const client = createClient();
await client.connect();

export const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);

bot.use(
    session({
        initial: () => ({counter: 0}),
        storage: await PsqlAdapter.create({tableName: "sessions", client}),
    })
);

bot.command("stats", ctx => ctx.reply(`Already got ${ctx.session.counter} photos!`));

bot.on(":photo", ctx => ctx.session.counter++);

bot.on("message:text", async ctx => ctx.reply(ctx.msg.text));

export default bot;
