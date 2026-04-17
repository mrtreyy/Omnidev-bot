const { Redis } = require('@upstash/redis');

const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
});

async function saveUser(telegramId, userData) {
  const key = `user:${telegramId}`;
  const existing = await redis.get(key);
  const user = {
    username: userData.username || null,
    first_name: userData.first_name || null,
    first_seen: existing?.first_seen || Date.now(),
    last_seen: Date.now(),
    is_premium: existing?.is_premium || false,
    deployments_count: existing?.deployments_count || 0,
  };
  await redis.set(key, user);
  return user;
}

async function getUser(telegramId) {
  return await redis.get(`user:${telegramId}`);
}

async function isAdmin(telegramId) {
  return String(telegramId) === process.env.ADMIN_ID;
}

async function isBanned(telegramId) {
  return await redis.sismember('banned_users', String(telegramId));
}

async function isFlagged(telegramId) {
  return await redis.sismember('flagged_users', String(telegramId));
}

async function saveDeployment(telegramId, deploymentData) {
  const data = { ...deploymentData, created_at: Date.now() };
  await redis.lpush(`user_deployments:${telegramId}`, JSON.stringify(data));
  await redis.ltrim(`user_deployments:${telegramId}`, 0, 49);
  const user = await getUser(telegramId);
  if (user) {
    user.deployments_count = (user.deployments_count || 0) + 1;
    await redis.set(`user:${telegramId}`, user);
  }
  const total = parseInt(await redis.get('stats:total_deploys') || '0');
  await redis.set('stats:total_deploys', total + 1);
  return data;
}

async function updateDeploymentStatus(telegramId, deploymentId, status, url = null, error = null) {
  const deployments = await redis.lrange(`user_deployments:${telegramId}`, 0, -1);
  for (let i = 0; i < deployments.length; i++) {
    const dep = JSON.parse(deployments[i]);
    if (dep.id === deploymentId) {
      dep.status = status;
      if (url) dep.url = url;
      if (error) dep.error = error;
      await redis.lset(`user_deployments:${telegramId}`, i, JSON.stringify(dep));
      if (status === 'ready') {
        const success = parseInt(await redis.get('stats:success_deploys') || '0');
        await redis.set('stats:success_deploys', success + 1);
      } else if (status === 'failed') {
        const fail = parseInt(await redis.get('stats:fail_deploys') || '0');
        await redis.set('stats:fail_deploys', fail + 1);
      }
      return dep;
    }
  }
  return null;
}

async function addToModerationQueue(item) {
  const id = `APPROVAL-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  const queueItem = { id, ...item, created_at: Date.now() };
  await redis.lpush('pending_approvals', JSON.stringify(queueItem));
  return queueItem;
}

module.exports = { redis, saveUser, getUser, isAdmin, isBanned, isFlagged, saveDeployment, updateDeploymentStatus, addToModerationQueue };
