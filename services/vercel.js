const axios = require('axios');
const VERCEL_API = 'https://api.vercel.com';

async function triggerDeploy({ token, repoUrl, repoName }) {
  try {
    const response = await axios.post(`${VERCEL_API}/v13/deployments`, {
      name: repoName,
      gitSource: { type: 'github', repo: repoUrl },
      target: 'production',
    }, { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } });
    return { success: true, deploymentId: response.data.id, url: response.data.url };
  } catch (error) {
    return { success: false, error: error.response?.data?.error?.message || error.message };
  }
}

async function pollDeploymentStatus(token, deploymentId) {
  try {
    const response = await axios.get(`${VERCEL_API}/v13/deployments/${deploymentId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return { status: response.data.state, url: response.data.alias?.[0] || response.data.url, ready: response.data.ready };
  } catch (error) {
    return { status: 'ERROR', error: error.message };
  }
}

module.exports = { triggerDeploy, pollDeploymentStatus };
