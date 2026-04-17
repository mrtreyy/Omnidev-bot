const { redis } = require('../services/redis');
const { historyKeyboard } = require('../keyboards/inline');

module.exports = async (ctx) => {
  const userId = ctx.from.id;
  const deployments = await redis.lrange(`user_deployments:${userId}`, 0, 9);
  
  if (!deployments || deployments.length === 0) {
    await ctx.reply(
      `📋 *DEPLOYMENT HISTORY*\n\n` +
      `You have not yet forged anything.\n\n` +
      `Type */deploy* to begin your legacy.`,
      { parse_mode: 'Markdown' }
    );
    return;
  }
  
  let message = `◈ ◈ ◈ YOUR CONQUESTS ◈ ◈ ◈\n\n`;
  
  for (let i = 0; i < deployments.length; i++) {
    const dep = JSON.parse(deployments[i]);
    const statusEmoji = dep.status === 'ready' ? '✅' : dep.status === 'failed' ? '❌' : '🟡';
    const date = new Date(dep.created_at).toLocaleDateString();
    
    message += `${statusEmoji} *${dep.repo_name || 'Unknown'}*\n`;
    message += `  📅 ${date} | Status: ${dep.status}\n`;
    if (dep.url) message += `  🔗 ${dep.url}\n`;
    message += `\n`;
  }
  
  message += `◈ *Each deployment sharpens your blade.* ◈`;
  
  await ctx.reply(message, {
    parse_mode: 'Markdown',
    disable_web_page_preview: true,
    reply_markup: historyKeyboard,
  });
};
