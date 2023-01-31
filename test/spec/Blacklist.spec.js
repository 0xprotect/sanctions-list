const { expect } = require("chai")
const { blacklistFixture } = require("../fixtures")

describe('Blacklist', () => {
    let blacklist
    let admin
    let updater
    let alice
    let bob
    let carlos

    beforeEach(async () => {
      const fix = await blacklistFixture()
      blacklist = fix.blacklist
      admin = fix.admin
      updater = fix.updater
      alice = fix.alice
      bob = fix.bob
      carlos = fix.carlos
    })

    context('constructor', async () => {
      it('initialized correctly', async () => {
        expect(await blacklist.isBlacklisted(alice.address)).to.eq(false)
        expect(await blacklist.isBlacklisted(bob.address)).to.eq(true)
        expect(await blacklist.isBlacklisted(carlos.address)).to.eq(true)
        expect(await blacklist.blacklistLength()).to.eq(2)
      })
    })

    context('addToBlacklist', async () => {
      it('allows adding new addresses to the blacklist by updater', async () => {
        expect(await blacklist.blacklistLength()).to.eq(2)
        await blacklist.connect(updater).addToBlacklist([alice.address])
        expect(await blacklist.blacklistLength()).to.eq(3)
        expect(await blacklist.isBlacklisted(alice.address)).to.eq(true)
      })

      it('does not allow adding new addresses to the blacklist by anyone other than updater', async () => {
        expect(await blacklist.blacklistLength()).to.eq(2)
        await expect(blacklist.connect(admin).addToBlacklist([alice.address])).to.revertedWith('Must be updater')
        expect(await blacklist.blacklistLength()).to.eq(2)
        expect(await blacklist.isBlacklisted(alice.address)).to.eq(false)
      })
    })

    context('removeFromBlacklist', async () => {
      it('allows removing addresses from the blacklist by updater', async () => {
        expect(await blacklist.blacklistLength()).to.eq(2)
        await blacklist.connect(updater).removeFromBlacklist([carlos.address])
        expect(await blacklist.blacklistLength()).to.eq(1)
        expect(await blacklist.isBlacklisted(carlos.address)).to.eq(false)
      })

      it('does not allow removing addresses to the blacklist by anyone other than updater', async () => {
        expect(await blacklist.blacklistLength()).to.eq(2)
        await expect(blacklist.connect(admin).removeFromBlacklist([carlos.address])).to.revertedWith('Must be updater')
        expect(await blacklist.blacklistLength()).to.eq(2)
        expect(await blacklist.isBlacklisted(carlos.address)).to.eq(true)
      })
    })

    context('updateBlacklist', async () => {
      it('allows updating (adding and removing in the same tx) the blacklist by updater', async () => {
        expect(await blacklist.blacklistLength()).to.eq(2)
        await blacklist.connect(updater).updateBlacklist([alice.address], [bob.address])
        expect(await blacklist.blacklistLength()).to.eq(2)
        expect(await blacklist.isBlacklisted(alice.address)).to.eq(true)
        expect(await blacklist.isBlacklisted(bob.address)).to.eq(false)
      })

      it('does not allow updating the blacklist by anyone other than updater', async () => {
        expect(await blacklist.blacklistLength()).to.eq(2)
        await expect(blacklist.connect(admin).updateBlacklist([alice.address], [bob.address])).to.revertedWith('Must be updater')
        expect(await blacklist.blacklistLength()).to.eq(2)
        expect(await blacklist.isBlacklisted(alice.address)).to.eq(false)
        expect(await blacklist.isBlacklisted(bob.address)).to.eq(true)
      })
    })
  })