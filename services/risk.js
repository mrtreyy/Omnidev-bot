function scanRepo(fileTree) {
  return { riskScore: 0, flags: [], requiresApproval: false };
}

module.exports = { scanRepo };
