const { InlineKeyboard } = require('grammy');

const startKeyboard = new InlineKeyboard()
  .text('🚀 Deploy', 'deploy').row()
  .text('📦 Templates', 'templates')
  .text('📚 Learn', 'learn').row()
  .text('📱 Termux', 'termux')
  .text('🛡️ Admin', 'admin');

const helpKeyboard = new InlineKeyboard()
  .text('🚀 Deploy', 'deploy')
  .text('📦 Templates', 'templates').row()
  .text('📚 Learn', 'learn')
  .text('📱 Termux', 'termux');

const templateKeyboard = new InlineKeyboard()
  .text('📦 Free Templates', 'template_free')
  .text('💎 Premium', 'template_premium');

const templateCategoriesKeyboard = new InlineKeyboard()
  .text('📦 Free', 'template_free')
  .text('💎 Premium', 'template_premium');

const learnKeyboard = new InlineKeyboard()
  .text('📚 Telegram', 'learn_telegram')
  .text('📱 WhatsApp', 'learn_whatsapp').row()
  .text('🖥️ Termux', 'learn_termux');

const termuxKeyboard = new InlineKeyboard()
  .text('🛠️ DevTools', 'termux_devtools')
  .text('🤖 BotTools', 'termux_bottools').row()
  .text('🔒 Wakelock', 'termux_wakelock')
  .text('📁 Storage', 'termux_storage');

const historyKeyboard = new InlineKeyboard()
  .text('🔄 Refresh', 'history_refresh');

const adminPanelKeyboard = new InlineKeyboard()
  .text('📊 Stats', 'admin_stats')
  .text('📋 Queue', 'admin_queue').row()
  .text('📢 Broadcast', 'admin_broadcast')
  .text('🔨 Ban', 'admin_ban');

function approvalKeyboard(page, total) {
  return new InlineKeyboard()
    .text('✅ Approve', 'approve_1')
    .text('❌ Reject', 'reject_1').row()
    .text('◀️ Prev', 'prev_page')
    .text('Next ▶️', 'next_page');
}

module.exports = {
  startKeyboard,
  helpKeyboard,
  templateKeyboard,
  templateCategoriesKeyboard,
  learnKeyboard,
  termuxKeyboard,
  historyKeyboard,
  adminPanelKeyboard,
  approvalKeyboard,
};
