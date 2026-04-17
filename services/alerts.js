async function sendAdminAlert(bot, message, options = {}) {
  const adminId = process.env.ADMIN_ID;
  if (!adminId) return;
  try {
    await bot.api.sendMessage(adminId, message, { parse_mode: 'Markdown', ...options });
  } catch (error) {
    console.error('Alert failed:', error);
  }
}

module.exports = { sendAdminAlert };
