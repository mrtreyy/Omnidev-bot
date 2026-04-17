const axios = require('axios');

async function isValidVercelToken(token) {
  try {
    const response = await axios.get('https://api.vercel.com/v2/user', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.status === 200;
  } catch (error) {
    return false;
  }
}

module.exports = { isValidVercelToken };
