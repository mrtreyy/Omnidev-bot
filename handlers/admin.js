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
