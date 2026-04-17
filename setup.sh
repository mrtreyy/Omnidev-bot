#!/bin/bash

echo "◈ ◈ ◈ OMNIDEV STRUCTURE SETUP ◈ ◈ ◈"
echo "Creating folder structure..."

# Create all folders
mkdir -p handlers
mkdir -p services
mkdir -p utils
mkdir -p conversations
mkdir -p keyboards

echo "✓ Folders created"

# Create .env file with credentials
cat > .env << 'EOF'
BOT_TOKEN=8698494440:AAHA_f-dBW-kCN0UM8ilYO3QV729z8yud5A
REDIS_URL=https://worthy-cheetah-99648.upstash.io
REDIS_TOKEN=gQAAAAAAAYVAAAIncDI0ZThmZTg0NzcwOTM0NjYxOGU5YTBiMzRjYTVmM2UwY3AyOTk2NDg
ADMIN_ID=8494006322
VERCEL_TOKEN=vcp_4ERHJEw93YKJiBP4FRacenJoC8kP4mH7YAGzOvaBIncvoqX3JZ2H04R0
ENCRYPTION_KEY=OmnidevXforge2024securekey32543
SENDGRID_API_KEY=
ALERT_EMAIL=peacechloe96@gmail.com
EOF

echo "✓ .env file created"

# Create .env.example
cat > .env.example << 'EOF'
BOT_TOKEN=
REDIS_URL=
REDIS_TOKEN=
ADMIN_ID=
VERCEL_TOKEN=
ENCRYPTION_KEY=
SENDGRID_API_KEY=
ALERT_EMAIL=
EOF

# Create .gitignore
cat > .gitignore << 'EOF'
node_modules/
.env
*.log
.DS_Store
EOF

# Create package.json
cat > package.json << 'EOF'
{
  "name": "omnidev-bot",
  "version": "1.0.0",
  "description": "◈ OMNIDEV ◈ All-in-one dev assistant for Telegram",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "grammy": "^1.20.0",
    "@grammyjs/conversations": "^1.2.0",
    "@upstash/redis": "^1.28.0",
    "dotenv": "^16.3.1",
    "axios": "^1.6.0",
    "nodemailer": "^6.9.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
EOF

echo "✓ Root files created"

# Create index.js
cat > index.js << 'EOF'
require('dotenv').config();
const { Bot, session } = require('grammy');
const { conversations, createConversation } = require('@grammyjs/conversations');
const { saveUser, isBanned, isAdmin } = require('./services/redis');

// Handlers
const startHandler = require('./handlers/start');
const deployHandler = require('./handlers/deploy');
const templateHandler = require('./handlers/template');
const learnHandler = require('./handlers/learn');
const termuxHandler = require('./handlers/termux');
const historyHandler = require('./handlers/history');
const settokenHandler = require('./handlers/settoken');
const adminHandler = require('./handlers/admin');

// Conversations
const deployConversation = require('./conversations/deployConversation');

// Keyboards
const { helpKeyboard } = require('./keyboards/inline');

const bot = new Bot(process.env.BOT_TOKEN);

// Maintenance mode middleware
bot.use(async (ctx, next) => {
  const maintenance = await require('./services/redis').redis.hget('bot_settings', 'maintenance_mode');
  if (maintenance === 'true' && !(await isAdmin(ctx.from?.id))) {
    const msg = await require('./services/redis').redis.hget('bot_settings', 'maintenance_message');
    await ctx.reply(`🛑 *MAINTENANCE MODE*\n\n${msg || 'OmniDev is under maintenance.'}`, { parse_mode: 'Markdown' });
    return;
  }
  await next();
});

// Ban check middleware
bot.use(async (ctx, next) => {
  if (ctx.from && await isBanned(ctx.from.id)) {
    await ctx.reply('🚫 *ACCESS DENIED*\n\nYou are banned from using OmniDev.', { parse_mode: 'Markdown' });
    return;
  }
  await next();
});

// Session middleware
bot.use(session({ initial: () => ({}) }));
bot.use(conversations());
bot.use(createConversation(deployConversation));

// User tracking middleware
bot.use(async (ctx, next) => {
  if (ctx.from) {
    await saveUser(ctx.from.id, {
      username: ctx.from.username,
      first_name: ctx.from.first_name,
    });
  }
  await next();
});

// Command registration
bot.command('start', startHandler);
bot.command('deploy', deployHandler);
bot.command('template', templateHandler);
bot.command('learn', learnHandler);
bot.command('termux', termuxHandler);
bot.command('history', historyHandler);
bot.command('settoken', settokenHandler);
bot.command('admin', adminHandler);

// Help command
bot.command('help', async (ctx) => {
  const name = ctx.from.first_name || 'Dev';
  
  await ctx.reply(
    `◈ ◈ ◈ OMNIDEV HELP ◈ ◈ ◈\n\n` +
    `⚔️ *${name}*, the arsenal awaits.\n\n` +
    `🚀 */deploy* — Unleash code to Vercel\n` +
    `📦 */template* — Claim bot templates\n` +
    `📚 */learn* — Master bot creation\n` +
    `📱 */termux* — Phone dev tools\n` +
    `📋 */history* — Your conquests\n` +
    `🔐 */settoken* — Bind Vercel token\n` +
    `🛡️ */admin* — Command the realm\n\n` +
    `◈ *The forge is yours.* ◈`,
    {
      parse_mode: 'Markdown',
      reply_markup: helpKeyboard,
    }
  );
});

// Catch-all
bot.on('message', async (ctx) => {
  const text = ctx.message.text;
  
  if (text && (text.includes('github.com') || text.includes('github.com/'))) {
    await ctx.reply(
      `🔍 *GitHub link detected.*\n\n` +
      `Use */deploy* to unleash this project.`,
      { parse_mode: 'Markdown' }
    );
    return;
  }
  
  await ctx.reply(
    `◈ ◈ ◈ OMNIDEV ◈ ◈ ◈\n\n` +
    `Type */help* to see commands.`,
    { parse_mode: 'Markdown' }
  );
});

bot.catch((err) => console.error('Bot error:', err));

bot.start({
  onStart: () => console.log('◈ OMNIDEV ONLINE ◈'),
  drop_pending_updates: true,
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
EOF

echo "✓ index.js created"

# Create handlers/start.js
cat > handlers/start.js << 'EOF'
const { startKeyboard } = require('../keyboards/inline');

module.exports = async (ctx) => {
  const name = ctx.from.first_name || 'Dev';
  
  const welcomeMessage = `
┌────────────────────────────────────┐
│                                    │
│         ◈ ◈ ◈ OMNIDEV ◈ ◈ ◈        │
│                                    │
│     ⚔️  WELCOME, ${name.toUpperCase()}  ⚔️      │
│                                    │
│    The forge awaits your command.  │
│    Build. Deploy. Dominate.        │
│                                    │
├────────────────────────────────────┤
│                                    │
│         ⚡ YOUR ARSENAL ⚡          │
│                                    │
│    🚀 /deploy    — Deploy to Vercel│
│    📦 /template  — Bot templates   │
│    📚 /learn     — Master the craft│
│    📱 /termux    — Phone dev tools │
│    📋 /history   — Your conquests  │
│    🔐 /settoken  — Bind your token │
│    🛡️ /admin     — Command realm   │
│                                    │
├────────────────────────────────────┤
│                                    │
│    To begin your first conquest:   │
│                                    │
│    1. Type /deploy                 │
│    2. Send your GitHub repo link   │
│    3. Watch it go live             │
│                                    │
│    [SYS] Only public repos.        │
│                                    │
├────────────────────────────────────┤
│                                    │
│    ▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰   │
│    STATUS: ONLINE                  │
│    DEPLOYS TODAY: Calculating...   │
│    USERS: Growing                  │
│    ▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰   │
│                                    │
└────────────────────────────────────┘

         ◈ OMNIDEV v1.0.0 ◈
         ⚡ Forge your legacy ⚡
`;

  await ctx.reply(welcomeMessage, {
    parse_mode: 'Markdown',
    reply_markup: startKeyboard,
  });
};
EOF

# Create handlers/deploy.js
cat > handlers/deploy.js << 'EOF'
module.exports = async (ctx) => {
  await ctx.conversation.enter('deployConversation');
};
EOF

# Create handlers/template.js
cat > handlers/template.js << 'EOF'
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
EOF

# Create handlers/learn.js
cat > handlers/learn.js << 'EOF'
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
EOF

# Create handlers/termux.js
cat > handlers/termux.js << 'EOF'
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
EOF

# Create handlers/history.js
cat > handlers/history.js << 'EOF'
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
EOF

# Create handlers/settoken.js
cat > handlers/settoken.js << 'EOF'
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
EOF

# Create handlers/admin.js
cat > handlers/admin.js << 'EOF'
const { isAdmin, redis } = require('../services/redis');
const { adminPanelKeyboard, approvalKeyboard } = require('../keyboards/inline');

module.exports = async (ctx) => {
  const userId = ctx.from.id;
  
  if (!(await isAdmin(userId))) {
    await ctx.reply(`🛡️ *ACCESS DENIED*\n\nYou are not worthy.`, { parse_mode: 'Markdown' });
    return;
  }
  
  const args = ctx.message.text.split(' ').slice(1);
  const subcommand = args[0]?.toLowerCase();
  
  switch (subcommand) {
    case 'stats':
      const totalUsers = (await redis.keys('user:*')).length;
      const totalDeploys = parseInt(await redis.get('stats:total_deploys') || '0');
      const successDeploys = parseInt(await redis.get('stats:success_deploys') || '0');
      const failDeploys = parseInt(await redis.get('stats:fail_deploys') || '0');
      const successRate = totalDeploys > 0 ? ((successDeploys / totalDeploys) * 100).toFixed(1) : '0.0';
      
      await ctx.reply(
        `📊 *REALM STATISTICS*\n\n` +
        `👥 Total Users: ${totalUsers}\n` +
        `🚀 Total Deploys: ${totalDeploys}\n` +
        `✅ Successful: ${successDeploys}\n` +
        `❌ Failed: ${failDeploys}\n` +
        `📊 Success Rate: ${successRate}%`,
        { parse_mode: 'Markdown' }
      );
      break;
      
    case 'queue':
      const queue = await redis.lrange('pending_approvals', 0, -1);
      if (queue.length === 0) {
        await ctx.reply(`📋 Queue is empty.`, { parse_mode: 'Markdown' });
        return;
      }
      
      let msg = `🚨 *PENDING APPROVALS* (${queue.length})\n\n`;
      for (let i = 0; i < Math.min(queue.length, 5); i++) {
        const item = JSON.parse(queue[i]);
        msg += `#${item.id}\n👤 ${item.user_id}\n📦 ${item.repo_name}\n⚠️ Risk: ${item.risk_score}/10\n\n`;
      }
      await ctx.reply(msg, { parse_mode: 'Markdown', reply_markup: approvalKeyboard(1, queue.length) });
      break;
      
    case 'approve':
      if (!args[1]) { await ctx.reply('Specify ID: /admin approve [id]'); return; }
      await ctx.reply(`✅ Approved #${args[1]}`, { parse_mode: 'Markdown' });
      break;
      
    case 'reject':
      if (!args[1]) { await ctx.reply('Specify ID: /admin reject [id]'); return; }
      await ctx.reply(`❌ Rejected #${args[1]}`, { parse_mode: 'Markdown' });
      break;
      
    case 'broadcast':
      const msg2 = args.slice(1).join(' ');
      if (!msg2) { await ctx.reply('Specify message: /admin broadcast [msg]'); return; }
      const users = await redis.keys('user:*');
      let sent = 0;
      for (const key of users) {
        try {
          await ctx.api.sendMessage(key.split(':')[1], `📢 *BROADCAST*\n\n${msg2}`, { parse_mode: 'Markdown' });
          sent++;
        } catch (e) {}
      }
      await ctx.reply(`📢 Broadcast sent to ${sent} users.`);
      break;
      
    case 'ban':
      if (!args[1]) { await ctx.reply('Specify ID: /admin ban [id]'); return; }
      await redis.sadd('banned_users', args[1]);
      await ctx.reply(`🔨 Banned ${args[1]}`);
      break;
      
    case 'unban':
      if (!args[1]) { await ctx.reply('Specify ID: /admin unban [id]'); return; }
      await redis.srem('banned_users', args[1]);
      await ctx.reply(`🔓 Unbanned ${args[1]}`
