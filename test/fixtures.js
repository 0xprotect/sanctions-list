const { deployments } = require("hardhat");

const blacklistFixture = deployments.createFixture(async ({ethers}, options) => {
    const accounts = await ethers.getSigners();
    const admin = accounts[0]
    const updater = accounts[1]
    const alice = accounts[2]
    const bob = accounts[3]
    const carlos = accounts[4]
    const BlacklistFactory = await ethers.getContractFactory("Blacklist");
    const Blacklist = await BlacklistFactory.deploy(admin.address, updater.address, [bob.address, carlos.address]);
    return {
        blacklist: Blacklist,
        admin: admin,
        updater: updater,
        alice: alice,
        bob: bob,
        carlos: carlos
    };
})

module.exports.blacklistFixture = blacklistFixture;