const { ethers } = require('hardhat')
const hre = require('hardhat')
// get the ether balance of the given address
async function getBalance(address) {
  const balance = await ethers.provider.getBalance(address)
  return hre.ethers.utils.formatEther(balance)
}
// Logs a list of balance for a list of addresses
async function printBalances(addresses) {
  console.log(addresses)

  let idx = 0
  for (const address of addresses) {
    console.log(`Address ${idx} balance: ${await getBalance(address)}`)
    idx++
  }
}

// Logs the memos store on-chain from coffee purches
async function printMemos(memos) {
  for (const memo of memos) {
    const timestamp = memo.timestamp
    const tipper = memo.name
    const tipperAddress = memo.from
    const message = memo.message
    console.log(
      `At ${timestamp}, ${tipper}, ${tipperAddress}, said: ${message}`
    )
  }
}

async function main() {
  // Get example accounts
  const [owner, tripper, tripper2, tripper3] = await hre.ethers.getSigners()
  // Get the contract to deploy & deploy
  const BuyMeACoffe = await hre.ethers.getContractFactory('BuyMeACoffe')
  console.log('Deploying Contract, Please Wait ...')
  const buyMeACoffee = await BuyMeACoffe.deploy()
  await buyMeACoffee.deployed()
  console.log(`Contract deployed on ${buyMeACoffee.address}`)
  //Check balances before the coffee purchase
  const addresses = [owner.address, tripper.address, buyMeACoffee.address]
  console.log('==== start ====')
  await printBalances(addresses)

  // buy a few coffee for the owber
  const tip = { value: hre.ethers.utils.parseEther('1') }
  await buyMeACoffee.connect(tripper).buyCoffee('Med', 'You are the best', tip)
  await buyMeACoffee.connect(tripper2).buyCoffee('Brahim', 'best brother', tip)
  await buyMeACoffee.connect(tripper3).buyCoffee('Anas', 'Youngest best', tip)
  // check balance after coffee purchase
  console.log('==== bought ====')
  await printBalances(addresses)
  // withraw funds
  await buyMeACoffee.connect(owner).withdrawTips()

  // check balance after withdraw
  console.log('==== withdrawTips ====')
  await printBalances(addresses)

  // Read all the memos left from the owner
  console.log('==== All memo s====')
  const memos = await buyMeACoffee.getMemos()
  await printMemos(memos)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
