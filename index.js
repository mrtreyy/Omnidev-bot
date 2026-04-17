require('dotenv').config();
const { Bot, session } = require('grammy');
const { conversations, createConversation } = require('@grammyjs/conversations');
const { saveUser, isBanned, isAdmin } = require('./services/redis');

// Handlers
const startHandler = require('./handlers/start');
const deployHandler = require('./handlers/deploy');
const templateHandler = require('./handlers/template');
const learnHandler = require('./handlers/learn');
const termuxHandler = require('./handlers/termux');
const historyHandler = require('./handlers/history');
const settokenHandler = require('./handlers/settoken');
const adminHandler = require('./handlers/admin');

// Conversations
const deployConversation = require('./conversations/deployConversation');

// Keyboards
const { helpKeyboard } = require('./keyboards/inline');

const bot = new Bot(process.env.BOT_TOKEN);

// Maintenance mode middleware
bot.use(async (ctx, next) => {
  const maintenance = await require('./services/redis').redis.hget('bot_settings', 'maintenance_mode');
  if (maintenance === 'true' && !(await isAdmin(ctx.from?.id))) {
    const msg = await require('./services/redis').redis.hget('bot_settings', 'maintenance_message');
    await ctx.reply(`🛑 *MAINTENANCE MODE*\n\n${msg || 'OmniDev is under maintenance.'}`, { parse_mode: 'Markdown' });
    return;
  }
  await next();
});

// Ban check middleware
bot.use(async (ctx, next) => {
  if (ctx.from && await isBanned(ctx.from.id)) {
    await ctx.reply('🚫 *ACCESS DENIED*\n\nYou are banned from using OmniDev.', { parse_mode: 'Markdown' });
    return;
  }
  await next();
});

// Session middleware
bot.use(session({ initial: () => ({}) }));
bot.use(conversations());
bot.use(createConversation(deployConversation));

// User tracking middleware
bot.use(async (ctx, next) => {
  if (ctx.from) {
    await saveUser(ctx.from.id, {
      username: ctx.from.username,
      first_name: ctx.from.first_name,
    });
  }
  await next();
});

// Command registration
bot.command('start', startHandler);
bot.command('deploy', deployHandler);
bot.command('template', templateHandler);
bot.command('learn', learnHandler);
bot.command('termux', termuxHandler);
bot.command('history', historyHandler);
bot.command('settoken', settokenHandler);
bot.command('admin', adminHandler);

// Help command
bot.command('help', async (ctx) => {
  const name = ctx.from.first_name || 'Dev';
  
  await ctx.reply(
    `◈ ◈ ◈ OMNIDEV HELP ◈ ◈ ◈\n\n` +
    `⚔️ *${name}*, the arsenal awaits.\n\n` +
    `🚀 */deploy* — Unleash code to Vercel\n` +
    `📦 */template* — Claim bot templates\n` +
    `📚 */learn* — Master bot creation\n` +
    `📱 */termux* — Phone dev tools\n` +
    `📋 */history* — Your conquests\n` +
    `🔐 */settoken* — Bind Vercel token\n` +
    `🛡️ */admin* — Command the realm\n\n` +
    `◈ *The forge is yours.* ◈`,
    {
      parse_mode: 'Markdown',
      reply_markup: helpKeyboard,
    }
  );
});

// Catch-all
bot.on('message', async (ctx) => {
  const text = ctx.message.text;
  
  if (text && (text.includes('github.com') || text.includes('github.com/'))) {
    await ctx.reply(
      `🔍 *GitHub link detected.*\n\n` +
      `Use */deploy* to unleash this project.`,
      { parse_mode: 'Markdown' }
    );
    return;
  }
  
  await ctx.reply(
    `◈ ◈ ◈ OMNIDEV ◈ ◈ ◈\n\n` +
    `Type */help* to see commands.`,
    { parse_mode: 'Markdown' }
  );
});

bot.catch((err) => console.error('Bot error:', err));

bot.start({
  onStart: () => console.log('◈ OMNIDEV ONLINE ◈'),
  drop_pending_updates: true,
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
