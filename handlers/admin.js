const { isAdmin, redis } = require('../services/redis');
const { adminPanelKeyboard } = require('../keyboards/inline');

module.exports = async (ctx) => {
  const userId = ctx.from.id;
  
  if (!(await isAdmin(userId))) {
    await ctx.reply('🛡️ *ACCESS DENIED*', { parse_mode: 'Markdown' });
    return;
  }
  
  const args = ctx.message.text.split(' ').slice(1);
  const subcommand = args[0]?.toLowerCase();
  
  if (subcommand === 'stats') {
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
  } else if (subcommand === 'queue') {
    const queue = await redis.lrange('pending_approvals', 0, -1);
    await ctx.reply(`📋 Queue: ${queue.length} items`, { parse_mode: 'Markdown' });
  } else if (subcommand === 'ban') {
    if (!args[1]) {
      await ctx.reply('Specify ID: /admin ban [id]', { parse_mode: 'Markdown' });
    } else {
      await redis.sadd('banned_users', args[1]);
      await ctx.reply(`🔨 Banned ${args[1]}`, { parse_mode: 'Markdown' });
    }
  } else if (subcommand === 'unban') {
    if (!args[1]) {
      await ctx.reply('Specify ID: /admin unban [id]', { parse_mode: 'Markdown' });
    } else {
      await redis.srem('banned_users', args[1]);
      await ctx.reply(`🔓 Unbanned ${args[1]}`, { parse_mode: 'Markdown' });
    }
  } else if (subcommand === 'broadcast') {
    const msg = args.slice(1).join(' ');
    if (!msg) {
      await ctx.reply('Specify message: /admin broadcast [msg]', { parse_mode: 'Markdown' });
    } else {
      const users = await redis.keys('user:*');
      let sent = 0;
      for (const key of users) {
        try {
          await ctx.api.sendMessage(key.split(':')[1], `📢 ${msg}`, { parse_mode: 'Markdown' });
          sent++;
        } catch (e) {}
      }
      await ctx.reply(`📢 Sent to ${sent} users`, { parse_mode: 'Markdown' });
    }
  } else {
    const panel = `
┌────────────────────────────────────┐
│         ◈ ◈ ◈ OMNIDEV ◈ ◈ ◈        │
│              ADMIN CMD              │
├────────────────────────────────────┤
│    📊 /admin stats                  │
│    📋 /admin queue                  │
│    🔨 /admin ban [id]               │
│    🔓 /admin unban [id]             │
│    📢 /admin broadcast [msg]        │
└────────────────────────────────────┘
         ⚡ Command the realm ⚡`;
    await ctx.reply(panel, { parse_mode: 'Markdown', reply_markup: adminPanelKeyboard });
  }
};
