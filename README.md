## Sanctions list

This repo consists of a simple smart contract with a list of sanctioned addresses on Ethereum that is maintained as a public good for the Ethereum ecosystem. 

Currently, the only sanctioned addresses come from the OFAC SDN list, which is monitored hourly for updates by the sanctions-list-service repo.  When an address is added or removed from this list, the changes will be reflected in this smart contract.

### Interacting with the smart contract using ethers

Set the stage for interacting with the contract:

```
import { ethers } from 'ethers'

const providerUrl = ''
const contractAddress = ''
const chainId = ''

const provider = new ethers.providers.JsonRpcProvider(
    providerUrl,
    chainId
)

const updater = new ethers.Wallet(
    process.env["UPDATER_PK"] as string,
    provider
)

const sanctionListContract = new ethers.Contract(
    contractAddress,
    require('../abis/sanctionsList.json'),
    updater
)
```

#### Read the sanction list:

Note: Updater private key is not required for the following.

```
const _sanctionList: string[] = await sanctionListContract.blacklist()
const sanctionList = _sanctionList.map((entry) => entry.toLowerCase())
console.log([...sanctionList].sort())
```

#### Modifying state in the smart contract:

Note: to make updates to the sanction list you will need to have the private key of the EOA defined in the UPDATER role. This is set a contract deployment time but can also be updated later by the EOA set as the ADMIN role.

Update sanctions list with both additions and removals:

```
const newAddresses = ["0x....., 0x....."]
const deletedAddresses = ["0x....., 0x....."]
const feeData = await provider.getFeeData()
const nonce = await updater.getTransactionCount()
const estGasLimit = await sanctionListContract.estimateGas.updateBlacklist(newAddresses, deletedAddresses, { maxFeePerGas: feeData.maxFeePerGas, maxPriorityFeePerGas: feeData.maxPriorityFeePerGas, nonce: nonce })
const gasLimit = estGasLimit.add(estGasLimit.div(10))
const tx = await sanctionListContract.populateTransaction.updateBlacklist(newAddresses, deletedAddresses, {
    type: 2,
    nonce: nonce,
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
    maxFeePerGas: feeData.maxFeePerGas,
    gasLimit: gasLimit
})
const sentTx = await updater.sendTransaction(tx)
const receipt = await sentTx.wait()
console.log(JSON.stringify({        
    newAddresses: newAddresses,
    blockHash: receipt.blockHash,
    transactionHash: receipt.transactionHash
}))
```

Add addresses to sanctions list:

```
const newAddresses = ["0x....., 0x....."]
const feeData = await provider.getFeeData()
const nonce = await updater.getTransactionCount()
const estGasLimit = await sanctionListContract.estimateGas.addToBlacklist(newAddresses, { maxFeePerGas: feeData.maxFeePerGas, maxPriorityFeePerGas: feeData.maxPriorityFeePerGas, nonce: nonce })
const gasLimit = estGasLimit.add(estGasLimit.div(10))
const tx = await sanctionListContract.populateTransaction.addToBlacklist(newAddresses, {
    type: 2,
    nonce: nonce,
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
    maxFeePerGas: feeData.maxFeePerGas,
    gasLimit: gasLimit
})
const sentTx = await updater.sendTransaction(tx)
const receipt = await sentTx.wait()
console.log(JSON.stringify({
    newAddresses: newAddresses,
    blockHash: receipt.blockHash,
    transactionHash: receipt.transactionHash
}))
```

Remove addresses from sanctions list:

```
const deletedAddresses = ["0x....., 0x....."]
const feeData = await provider.getFeeData()
const nonce = await updater.getTransactionCount()
const estGasLimit = await sanctionListContract.estimateGas.removeFromBlacklist(deletedAddresses, { maxFeePerGas: feeData.maxFeePerGas, maxPriorityFeePerGas: feeData.maxPriorityFeePerGas, nonce: nonce })
const gasLimit = estGasLimit.add(estGasLimit.div(10))
const tx = await sanctionListContract.populateTransaction.removeFromBlacklist(deletedAddresses, {
    type: 2,
    nonce: nonce,
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
    maxFeePerGas: feeData.maxFeePerGas,
    gasLimit: gasLimit
})
const sentTx = await updater.sendTransaction(tx)
const receipt = await sentTx.wait()
console.log(JSON.stringify({        
    deletedAddresses: deletedAddresses,
    blockHash: receipt.blockHash,
    transactionHash: receipt.transactionHash
}))
```