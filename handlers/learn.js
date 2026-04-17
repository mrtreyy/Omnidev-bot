const { learnKeyboard } = require('../keyboards/inline');

module.exports = async (ctx) => {
  const args = ctx.message.text.split(' ').slice(1);
  const course = args[0]?.toLowerCase();
  
  if (course === 'telegram') {
    await ctx.reply(
      `📚 *TELEGRAM BOT MASTERY*\n\n` +
      `◈ Module 1: BotFather & Setup\n` +
      `◈ Module 2: Grammy/Telegraf Basics\n` +
      `◈ Module 3: Inline Keyboards & Menus\n` +
      `◈ Module 4: Database Integration\n` +
      `◈ Module 5: Payment Processing\n` +
      `◈ Module 6: Deployment & Scaling\n\n` +
      `🎓 *Duration:* 2 weeks\n` +
      `💰 *Tribute:* Free\n\n` +
      `Type /learn start telegram to begin.`,
      { parse_mode: 'Markdown' }
    );
    return;
  }
  
  if (course === 'whatsapp') {
    await ctx.reply(
      `📚 *WHATSAPP AUTOMATION*\n\n` +
      `◈ Module 1: Baileys Library Setup\n` +
      `◈ Module 2: Message Handling\n` +
      `◈ Module 3: Media & Buttons\n` +
      `◈ Module 4: Multi-Device Sessions\n` +
      `◈ Module 5: Anti-Ban Strategies\n\n` +
      `🎓 *Duration:* 3 weeks\n` +
      `💰 *Tribute:* ₦5,000\n\n` +
      `Contact @omnidev_admin to enroll.`,
      { parse_mode: 'Markdown' }
    );
    return;
  }
  
  if (course === 'termux') {
    await ctx.reply(
      `📚 *TERMUX MOBILE DEV*\n\n` +
      `◈ Module 1: Termux Setup & Packages\n` +
      `◈ Module 2: Node.js on Android\n` +
      `◈ Module 3: Python on Android\n` +
      `◈ Module 4: Git & GitHub Workflow\n` +
      `◈ Module 5: Building Bots on Phone\n` +
      `◈ Module 6: Deployment from Mobile\n\n` +
      `🎓 *Duration:* 1 week\n` +
      `💰 *Tribute:* Free\n\n` +
      `Type /learn start termux to begin.`,
      { parse_mode: 'Markdown' }
    );
    return;
  }
  
  await ctx.reply(
    `◈ ◈ ◈ OMNIDEV ACADEMY ◈ ◈ ◈\n\n` +
    `Master the craft. Forge your destiny.\n\n` +
    `📚 */learn telegram* — Telegram Bot Mastery\n` +
    `📱 */learn whatsapp* — WhatsApp Automation\n` +
    `🖥️ */learn termux* — Mobile Development\n\n` +
    `◈ *Knowledge is the sharpest blade.* ◈`,
    {
      parse_mode: 'Markdown',
      reply_markup: learnKeyboard,
    }
  );
};
