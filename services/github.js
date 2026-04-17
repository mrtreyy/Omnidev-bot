const axios = require('axios');

function parseGitHubUrl(url) {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/\s]+)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2].replace('.git', ''), fullName: `${match[1]}/${match[2].replace('.git', '')}` };
}

async function validateRepo(owner, repo) {
  try {
    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'OmniDev-Bot' },
    });
    return { exists: true, isPrivate: response.data.private, defaultBranch: response.data.default_branch };
  } catch (error) {
    if (error.response?.status === 404) return { exists: false, isPrivate: false };
    throw error;
  }
}

async function getFileTree(owner, repo, branch = 'main') {
  try {
    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`, {
      headers: { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'OmniDev-Bot' },
    });
    return response.data.tree.map(item => item.path);
  } catch (error) {
    return [];
  }
}

function checkRequiredFiles(fileTree) {
  const hasPackageJson = fileTree.some(f => f === 'package.json' || f.endsWith('/package.json'));
  const hasIndexHtml = fileTree.some(f => f === 'index.html' || f.endsWith('/index.html'));
  return { hasPackageJson, hasIndexHtml, isValid: hasPackageJson || hasIndexHtml };
}

module.exports = { parseGitHubUrl, validateRepo, getFileTree, checkRequiredFiles };
