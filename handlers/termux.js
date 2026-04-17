const { termuxKeyboard } = require('../keyboards/inline');

module.exports = async (ctx) => {
  const args = ctx.message.text.split(' ').slice(1);
  const bundle = args[0]?.toLowerCase();
  
  if (bundle === 'devtools') {
    await ctx.reply(
      `📱 *TERMUX DEVTOOLS BUNDLE*\n\n` +
      `\`\`\`bash\n` +
      `pkg update && pkg upgrade -y\n` +
      `pkg install nodejs python git neovim -y\n` +
      `npm install -g npm yarn\n` +
      `pip install requests flask\n` +
      `\`\`\`\n\n` +
      `◈ Run this in Termux.\n` +
      `◈ Full dev environment in 60 seconds.\n\n` +
      `⚡ *The forge is now mobile.* ⚡`,
      { parse_mode: 'Markdown' }
    );
    return;
  }
  
  if (bundle === 'bottools') {
    await ctx.reply(
      `📱 *TERMUX BOT TOOLS BUNDLE*\n\n` +
      `\`\`\`bash\n` +
      `pkg install nodejs redis -y\n` +
      `npm install -g grammy telegraf\n` +
      `npm install -g nodemon pm2\n` +
      `\`\`\`\n\n` +
      `◈ Telegram bot development ready.\n` +
      `◈ Redis included for session storage.\n\n` +
      `⚡ *Build bots from anywhere.* ⚡`,
      { parse_mode: 'Markdown' }
    );
    return;
  }
  
  if (bundle === 'wakelock') {
    await ctx.reply(
      `📱 *TERMUX WAKELOCK SCRIPT*\n\n` +
      `\`\`\`bash\n` +
      `termux-wake-lock\n` +
      `echo "Wakelock acquired. Bot stays alive."\n` +
      `\`\`\`\n\n` +
      `◈ Prevents Android from killing Termux.\n` +
      `◈ Install Termux:API app first.\n\n` +
      `⚡ *Your bot never sleeps.* ⚡`,
      { parse_mode: 'Markdown' }
    );
    return;
  }
  
  if (bundle === 'storage') {
    await ctx.reply(
      `📱 *TERMUX STORAGE SETUP*\n\n` +
      `\`\`\`bash\n` +
      `termux-setup-storage\n` +
      `\`\`\`\n\n` +
      `◈ Grants access to phone storage.\n` +
      `◈ Required for file operations.\n\n` +
      `⚡ *Break the sandbox.* ⚡`,
      { parse_mode: 'Markdown' }
    );
    return;
  }
  
  await ctx.reply(
    `◈ ◈ ◈ TERMUX ARMORY ◈ ◈ ◈\n\n` +
    `Code from your phone. No laptop needed.\n\n` +
    `📱 */termux devtools* — Full dev environment\n` +
    `🤖 */termux bottools* — Bot development setup\n` +
    `🔒 */termux wakelock* — Keep Termux alive\n` +
    `📁 */termux storage* — Access phone files\n\n` +
    `◈ *Your phone is now a weapon.* ◈`,
    {
      parse_mode: 'Markdown',
      reply_markup: termuxKeyboard,
    }
  );
};
