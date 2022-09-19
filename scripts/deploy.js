const { run, network } = require('hardhat')
const hre = require('hardhat')

async function main() {
  // Get the contract to deploy & deploy
  const BuyMeACoffeFactory = await hre.ethers.getContractFactory('BuyMeACoffe')
  console.log('Deploying Contract, Please Wait ...')
  const buyMeACoffee = await BuyMeACoffeFactory.deploy()
  await buyMeACoffee.deployed()
  console.log(`Contract deployed on ${buyMeACoffee.address}`)
  if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
    console.log('Waiting for block confirmations...')
    await buyMeACoffee.deployTransaction.wait(6)
    await verify(buyMeACoffee.address, [])
  }
}

async function verify(contractAddress, args) {
  console.log('Verifying contract...')
  try {
    await run('verify:verify', {
      address: contractAddress,
      constructorArguments: args,
    })
  } catch (err) {
    if (err.message.toLowerCase().includes('already verified')) {
      console.log('Already Verified')
    } else {
      console.error(err)
    }
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
