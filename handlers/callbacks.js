const { isAdmin, redis } = require('../services/redis');
const { adminPanelKeyboard } = require('../keyboards/inline');

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
    // Show full admin panel directly
    const userId = ctx.from.id;
    
    if (!(await isAdmin(userId))) {
      await ctx.reply('🛡️ *ACCESS DENIED*\n\nYou are not worthy.', { parse_mode: 'Markdown' });
      return;
    }
    
    const totalUsers = (await redis.keys('user:*')).length;
    const pendingQueue = await redis.llen('pending_approvals');
    const bannedUsers = await redis.llen('banned_users');
    
    const panel = `
┌────────────────────────────────────┐
│                                    │
│         ◈ ◈ ◈ OMNIDEV ◈ ◈ ◈        │
│              ADMIN CMD              │
│                                    │
│    ⚡ SYSTEM ONLINE ⚡               │
│    🟢 Redis    🟢 Vercel    🟢 GH   │
│                                    │
├────────────────────────────────────┤
│                                    │
│         📊 REALM STATS              │
│                                    │
│    👥 Total Users: ${totalUsers}                 │
│    🚨 Pending Queue: ${pendingQueue}              │
│    🚫 Banned: ${bannedUsers}                      │
│                                    │
│    [████████░░] Realm Stable        │
│                                    │
│         ⚡ COMMAND ARSENAL ⚡        │
│                                    │
│    📊 /admin stats                  │
│    📋 /admin queue                  │
│    ✅ /admin approve [id]           │
│    ❌ /admin reject [id] [reason]   │
│    📢 /admin broadcast [msg]        │
│    💎 /admin premium [msg]          │
│    🔥 /admin active [days] [msg]    │
│    🔨 /admin ban [id] [reason]      │
│    🔓 /admin unban [id]             │
│                                    │
└────────────────────────────────────┘

         ◈ OMNIDEV v1.0.0 ◈
         ⚡ Command the realm ⚡
    `;
    
    await ctx.reply(panel, {
      parse_mode: 'Markdown',
      reply_markup: adminPanelKeyboard,
    });
    
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
    // Show stats directly
    const userId = ctx.from.id;
    if (!(await isAdmin(userId))) {
      await ctx.reply('🛡️ *ACCESS DENIED*', { parse_mode: 'Markdown' });
      return;
    }
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
    
  } else if (data === 'admin_queue') {
    const userId = ctx.from.id;
    if (!(await isAdmin(userId))) {
      await ctx.reply('🛡️ *ACCESS DENIED*', { parse_mode: 'Markdown' });
      return;
    }
    const queue = await redis.lrange('pending_approvals', 0, -1);
    if (queue.length === 0) {
      await ctx.reply('📋 Queue is empty.', { parse_mode: 'Markdown' });
    } else {
      await ctx.reply(`📋 Pending approvals: ${queue.length}`, { parse_mode: 'Markdown' });
    }
    
  } else if (data === 'admin_broadcast') {
    await ctx.reply('📢 Use /admin broadcast [message] to send to all users.', { parse_mode: 'Markdown' });
    
  } else if (data === 'admin_ban') {
    await ctx.reply('🔨 Use /admin ban [user_id] to ban a user.', { parse_mode: 'Markdown' });
    
  } else {
    await ctx.reply('⚡ This button is not yet configured.', { parse_mode: 'Markdown' });
  }
};