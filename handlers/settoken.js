const { redis } = require('../services/redis');
const { encryptToken } = require('../utils/encrypt');
const { isValidVercelToken } = require('../utils/validator');

module.exports = async (ctx) => {
  const args = ctx.message.text.split(' ').slice(1);
  const token = args[0];
  
  if (!token) {
    await ctx.reply(
      `🔐 *BIND YOUR VERCEL TOKEN*\n\n` +
      `1. Go to vercel.com/account/tokens\n` +
      `2. Create token (Full Account scope)\n` +
      `3. Copy it\n\n` +
      `Then: /settoken YOUR_TOKEN`,
      { parse_mode: 'Markdown' }
    );
    return;
  }
  
  const isValid = await isValidVercelToken(token);
  
  if (!isValid) {
    await ctx.reply(`❌ *INVALID TOKEN*\n\nCheck it and try again.`, { parse_mode: 'Markdown' });
    return;
  }
  
  const encrypted = encryptToken(token);
  await redis.set(`vercel_token:${ctx.from.id}`, encrypted);
  
  await ctx.reply(
    `✅ *TOKEN BOUND*\n\n` +
    `You may now deploy without limits.\n` +
    `Type */deploy* to begin forging.`,
    { parse_mode: 'Markdown' }
  );
};
