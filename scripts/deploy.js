const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Deploying PricePad to:", hre.network.name);

  const [deployer] = await hre.ethers.getSigners();
  if (deployer) {
    console.log("Deployer address:", deployer.address);
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("Account balance:", hre.ethers.formatEther(balance), "BHR/ETH");
  }

  const PricePad = await hre.ethers.getContractFactory("PricePad");
  const pricePad = await PricePad.deploy();

  await pricePad.waitForDeployment();
  const contractAddress = await pricePad.getAddress();

  console.log("PricePad deployed successfully to:", contractAddress);

  // Update or create .env.local with deployed contract address
  const envPath = path.join(__dirname, "..", ".env.local");
  let envContent = "";
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, "utf-8");
  }

  if (envContent.includes("NEXT_PUBLIC_CONTRACT_ADDRESS=")) {
    envContent = envContent.replace(
      /NEXT_PUBLIC_CONTRACT_ADDRESS=.*/,
      `NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`
    );
  } else {
    envContent += `\nNEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}\nNEXT_PUBLIC_CHAIN_ID=968\nNEXT_PUBLIC_RPC_URL=https://rpc.bohr.life\n`;
  }

  fs.writeFileSync(envPath, envContent.trim() + "\n");
  console.log("Updated .env.local with NEXT_PUBLIC_CONTRACT_ADDRESS=" + contractAddress);

  // Also write deployment info JSON
  const deploymentInfo = {
    address: contractAddress,
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    deployedAt: new Date().toISOString(),
  };
  fs.writeFileSync(
    path.join(__dirname, "..", "deployment.json"),
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("Saved deployment info to deployment.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

