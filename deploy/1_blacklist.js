module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer, admin, updater } = await getNamedAccounts();
  const fs = require('fs')
  const blacklistFile = fs.readFileSync("./blacklist.json");
  const blacklist = JSON.parse(blacklistFile)

  log(`1) Blacklist`)
  // Deploy Blacklist contract
  const deployResult = await deploy("Blacklist", {
    from: deployer,
    contract: "Blacklist",
    gas: 4000000,
    args: [admin, updater, blacklist],
    skipIfAlreadyDeployed: true
  });

  if (deployResult.newlyDeployed) {
    log(`- ${deployResult.contractName} deployed at ${deployResult.address} using ${deployResult.receipt.gasUsed} gas`);
  } else {
    log(`- Deployment skipped, using previous deployment at: ${deployResult.address}`)
  }
};

module.exports.tags = ["1", "Blacklist"]