module.exports = async (ctx) => {
  const data = ctx.callbackQuery.data;
  
  // Always answer the callback first to stop the loading spinner
  await ctx.answerCallbackQuery();
  
  // Handle each button by its data value
  if (data === 'deploy') {
    await ctx.reply('🚀 Type /deploy and send your GitHub repo link to begin.', { parse_mode: 'Markdown' });
  } else if (data === 'templates') {
    await ctx.reply('📦 Use /template free for free templates or /template premium for premium ones.', { parse_mode: 'Markdown' });
  } else if (data === 'learn') {
    await ctx.reply('📚 Use /learn to see all available courses.', { parse_mode: 'Markdown' });
  } else if (data === 'termux') {
    await ctx.reply('📱 Use /termux to see all Termux bundles.', { parse_mode: 'Markdown' });
  } else if (data === 'admin') {
    await ctx.reply('🛡️ Use /admin to access the admin panel.', { parse_mode: 'Markdown' });
  } else if (data === 'template_free') {
    await ctx.reply('📦 Use /template free to browse free templates.', { parse_mode: 'Markdown' });
  } else if (data === 'template_premium') {
    await ctx.reply('💎 Use /template premium to see premium offerings.', { parse_mode: 'Markdown' });
  } else if (data === 'learn_telegram') {
    await ctx.reply('📚 Use /learn telegram for Telegram Bot Mastery details.', { parse_mode: 'Markdown' });
  } else if (data === 'learn_whatsapp') {
    await ctx.reply('📱 Use /learn whatsapp for WhatsApp Automation details.', { parse_mode: 'Markdown' });
  } else if (data === 'learn_termux') {
    await ctx.reply('🖥️ Use /learn termux for Termux Mobile Dev details.', { parse_mode: 'Markdown' });
  } else if (data === 'termux_devtools') {
    await ctx.reply('🛠️ Use /termux devtools for the full dev environment bundle.', { parse_mode: 'Markdown' });
  } else if (data === 'termux_bottools') {
    await ctx.reply('🤖 Use /termux bottools for bot development setup.', { parse_mode: 'Markdown' });
  } else if (data === 'termux_wakelock') {
    await ctx.reply('🔒 Use /termux wakelock for the wakelock script.', { parse_mode: 'Markdown' });
  } else if (data === 'termux_storage') {
    await ctx.reply('📁 Use /termux storage for storage setup instructions.', { parse_mode: 'Markdown' });
  } else if (data === 'history_refresh') {
    await ctx.reply('📋 Use /history to refresh your deployment history.', { parse_mode: 'Markdown' });
  } else if (data === 'admin_stats') {
    await ctx.reply('📊 Use /admin stats to view realm statistics.', { parse_mode: 'Markdown' });
  } else if (data === 'admin_queue') {
    await ctx.reply('📋 Use /admin queue to view pending approvals.', { parse_mode: 'Markdown' });
  } else if (data === 'admin_broadcast') {
    await ctx.reply('📢 Use /admin broadcast [message] to send to all users.', { parse_mode: 'Markdown' });
  } else if (data === 'admin_ban') {
    await ctx.reply('🔨 Use /admin ban [user_id] to ban a user.', { parse_mode: 'Markdown' });
  } else {
    await ctx.reply('⚡ This button is not yet configured.', { parse_mode: 'Markdown' });
  }
};