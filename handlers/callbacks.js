// Import command handlers
const templateHandler = require('./template');
const learnHandler = require('./learn');
const termuxHandler = require('./termux');
const historyHandler = require('./history');
const adminHandler = require('./admin');

module.exports = async (ctx) => {
  const data = ctx.callbackQuery.data;
  
  // Always answer the callback first to stop loading spinner
  await ctx.answerCallbackQuery();
  
  // Save original message properties
  const originalMessage = ctx.message;
  const originalChat = ctx.chat;
  
  // Route based on button data
  if (data === 'deploy') {
    await ctx.reply('🚀 Type /deploy and send your GitHub repo link to begin.', { parse_mode: 'Markdown' });
    
  } else if (data === 'templates' || data === 'template_free' || data === 'template_premium') {
    // Temporarily set message.text to simulate /template command
    ctx.message = { text: '/template', from: ctx.from, chat: ctx.chat };
    await templateHandler(ctx);
    
  } else if (data === 'learn' || data === 'learn_telegram' || data === 'learn_whatsapp' || data === 'learn_termux') {
    ctx.message = { text: '/learn', from: ctx.from, chat: ctx.chat };
    await learnHandler(ctx);
    
  } else if (data === 'termux' || data === 'termux_devtools' || data === 'termux_bottools' || data === 'termux_wakelock' || data === 'termux_storage') {
    ctx.message = { text: '/termux', from: ctx.from, chat: ctx.chat };
    await termuxHandler(ctx);
    
  } else if (data === 'history_refresh') {
    ctx.message = { text: '/history', from: ctx.from, chat: ctx.chat };
    await historyHandler(ctx);
    
  } else if (data === 'admin' || data === 'admin_stats' || data === 'admin_queue' || data === 'admin_broadcast' || data === 'admin_ban') {
    ctx.message = { text: '/admin', from: ctx.from, chat: ctx.chat };
    await adminHandler(ctx);
    
  } else {
    await ctx.reply('⚡ This button is not yet configured.', { parse_mode: 'Markdown' });
  }
  
  // Restore original message (optional but good practice)
  ctx.message = originalMessage;
  ctx.chat = originalChat;
};