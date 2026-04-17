const { templateKeyboard, templateCategoriesKeyboard } = require('../keyboards/inline');
const { redis } = require('../services/redis');

module.exports = async (ctx) => {
  const args = ctx.message.text.split(' ').slice(1);
  const subcommand = args[0]?.toLowerCase();
  
  if (subcommand === 'free') {
    const templates = [
      { name: 'Telegram Echo Bot', description: 'Basic reply bot template', downloads: 156 },
      { name: 'Web Scraper Bot', description: 'Cheerio + Axios scraper', downloads: 89 },
      { name: 'File Converter Bot', description: 'Convert images and documents', downloads: 67 },
      { name: 'QR Code Generator', description: 'Generate QR codes from text', downloads: 134 },
      { name: 'URL Shortener Bot', description: 'Shorten URLs via API', downloads: 92 },
    ];
    
    let message = `📦 *FREE TEMPLATES*\n\n`;
    message += `Claim these and forge your first weapon.\n\n`;
    
    for (const t of templates) {
      message += `◈ *${t.name}*\n`;
      message += `  _${t.description}_\n`;
      message += `  ⬇️ ${t.downloads} downloads\n\n`;
    }
    
    message += `◈ *Premium templates available.*\n`;
    message += `Type /template premium to ascend.`;
    
    await ctx.reply(message, {
      parse_mode: 'Markdown',
      reply_markup: templateKeyboard,
    });
    return;
  }
  
  if (subcommand === 'premium') {
    await ctx.reply(
      `💎 *PREMIUM ARMORY*\n\n` +
      `These weapons require tribute.\n\n` +
      `◈ *Telegram Echo Master* — ₦2,500\n` +
      `  Full bot with database, menus, payments\n\n` +
      `◈ *WhatsApp Gateway* — ₦5,000\n` +
      `  Baileys-based automation suite\n\n` +
      `◈ *Crypto Sniper Bot* — ₦10,000\n` +
      `  DEX monitoring, auto-buy, alerts\n\n` +
      `◈ *Termux Automation Pack* — ₦1,500\n` +
      `  50+ scripts for phone dominance\n\n` +
      `Contact @omnidev_admin to acquire.`,
      { parse_mode: 'Markdown' }
    );
    return;
  }
  
  await ctx.reply(
    `◈ ◈ ◈ TEMPLATE ARMORY ◈ ◈ ◈\n\n` +
    `Choose your weapon class:\n\n` +
    `📦 */template free* — Free templates\n` +
    `💎 */template premium* — Premium arsenal\n\n` +
    `◈ *Forge begins with a choice.* ◈`,
    {
      parse_mode: 'Markdown',
      reply_markup: templateCategoriesKeyboard,
    }
  );
};
