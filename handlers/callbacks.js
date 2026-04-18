// Import command handlers so buttons behave exactly like commands
const templateHandler = require('./template');
const learnHandler = require('./learn');
const termuxHandler = require('./termux');
const historyHandler = require('./history');
const adminHandler = require('./admin');

module.exports = async (ctx) => {
  const data = ctx.callbackQuery.data;
  
  // Always answer the callback first to stop the loading spinner
  await ctx.answerCallbackQuery();
  
  // Create a fake message object to trick handlers into thinking it's a command
  const fakeMessage = {
    text: '',
    from: ctx.from,
    chat: ctx.chat,
    reply: ctx.reply.bind(ctx),
    api: ctx.api,
  };
  
  // Route based on button data
  if (data === 'deploy') {
    await ctx.reply('🚀 Type /deploy and send your GitHub repo link to begin.', { parse_mode: 'Markdown' });
    
  } else if (data === 'templates' || data === 'template_free' || data === 'template_premium') {
    fakeMessage.text = '/template';
    await templateHandler({ ...ctx, message: fakeMessage });
    
  } else if (data === 'learn' || data === 'learn_telegram' || data === 'learn_whatsapp' || data === 'learn_termux') {
    fakeMessage.text = '/learn';
    await learnHandler({ ...ctx, message: fakeMessage });
    
  } else if (data === 'termux' || data === 'termux_devtools' || data === 'termux_bottools' || data === 'termux_wakelock' || data === 'termux_storage') {
    fakeMessage.text = '/termux';
    await termuxHandler({ ...ctx, message: fakeMessage });
    
  } else if (data === 'history_refresh') {
    fakeMessage.text = '/history';
    await historyHandler({ ...ctx, message: fakeMessage });
    
  } else if (data === 'admin' || data === 'admin_stats' || data === 'admin_queue' || data === 'admin_broadcast' || data === 'admin_ban') {
    fakeMessage.text = '/admin';
    await adminHandler({ ...ctx, message: fakeMessage });
    
  } else {
    await ctx.reply('⚡ This button is not yet configured.', { parse_mode: 'Markdown' });
  }
};