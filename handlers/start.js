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
