const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("--------------------------------------------------");
  console.log("Deploying PricePad to:", hre.network.name);

  const [deployer] = await hre.ethers.getSigners();
  if (!deployer) {
    throw new Error("No deployer signer found. Check PRIVATE_KEY in .env.local");
  }

  const deployerAddress = await deployer.getAddress();
  console.log("Deployer address:", deployerAddress);

  const balance = await hre.ethers.provider.getBalance(deployerAddress);
  console.log("Account balance:", hre.ethers.formatEther(balance), "BOT");

  if (balance === 0n) {
    throw new Error("Deployer account has zero balance. Please fund the wallet with BOT.");
  }

  const PricePad = await hre.ethers.getContractFactory("PricePad");

  // Gas estimation to ensure minimum gas is spent
  const deployTx = await PricePad.getDeployTransaction();
  const estimatedGas = await hre.ethers.provider.estimateGas(deployTx);
  const feeData = await hre.ethers.provider.getFeeData();
  const gasPrice = feeData.gasPrice || 20000000000n; // fallback 20 gwei
  const estimatedCost = estimatedGas * gasPrice;

  console.log("Estimated Gas Units:", estimatedGas.toString());
  console.log("Gas Price:", hre.ethers.formatUnits(gasPrice, "gwei"), "gwei");
  console.log("Estimated Deployment Cost:", hre.ethers.formatEther(estimatedCost), "BOT");

  console.log("Submitting deployment transaction with standard gas...");
  const pricePad = await PricePad.deploy({
    gasPrice: gasPrice,
  });

  console.log("Waiting for block confirmation...");
  await pricePad.waitForDeployment();
  const contractAddress = await pricePad.getAddress();

  const deploymentReceipt = await pricePad.deploymentTransaction()?.wait();
  if (deploymentReceipt) {
    const actualGasUsed = deploymentReceipt.gasUsed;
    const actualCost = actualGasUsed * (deploymentReceipt.gasPrice || gasPrice);
    console.log("Actual Gas Used:", actualGasUsed.toString());
    console.log("Actual Total Fee Paid:", hre.ethers.formatEther(actualCost), "BOT");
  }

  console.log("--------------------------------------------------");
  console.log("PricePad deployed successfully to:", contractAddress);
  console.log("--------------------------------------------------");

  // Update or create .env.local with deployed contract address & Mainnet details
  const envPath = path.join(__dirname, "..", ".env.local");
  let envContent = "";
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, "utf-8");
  }

  const chainId = hre.network.config.chainId || 677;
  const rpcUrl = hre.network.config.url || "https://rpc.botchain.ai";
  const explorerUrl =
    chainId === 677 ? "https://scan.botchain.ai" : "https://scan.bohr.life";

  // Update NEXT_PUBLIC_CONTRACT_ADDRESS
  if (envContent.includes("NEXT_PUBLIC_CONTRACT_ADDRESS=")) {
    envContent = envContent.replace(
      /NEXT_PUBLIC_CONTRACT_ADDRESS=.*/,
      `NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`
    );
  } else {
    envContent += `\nNEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}\n`;
  }

  // Update NEXT_PUBLIC_CHAIN_ID
  if (envContent.includes("NEXT_PUBLIC_CHAIN_ID=")) {
    envContent = envContent.replace(
      /NEXT_PUBLIC_CHAIN_ID=.*/,
      `NEXT_PUBLIC_CHAIN_ID=${chainId}`
    );
  } else {
    envContent += `\nNEXT_PUBLIC_CHAIN_ID=${chainId}\n`;
  }

  // Update NEXT_PUBLIC_RPC_URL
  if (envContent.includes("NEXT_PUBLIC_RPC_URL=")) {
    envContent = envContent.replace(
      /NEXT_PUBLIC_RPC_URL=.*/,
      `NEXT_PUBLIC_RPC_URL=${rpcUrl}`
    );
  } else {
    envContent += `\nNEXT_PUBLIC_RPC_URL=${rpcUrl}\n`;
  }

  // Update NEXT_PUBLIC_EXPLORER_URL
  if (envContent.includes("NEXT_PUBLIC_EXPLORER_URL=")) {
    envContent = envContent.replace(
      /NEXT_PUBLIC_EXPLORER_URL=.*/,
      `NEXT_PUBLIC_EXPLORER_URL=${explorerUrl}`
    );
  } else {
    envContent += `\nNEXT_PUBLIC_EXPLORER_URL=${explorerUrl}\n`;
  }

  fs.writeFileSync(envPath, envContent.trim() + "\n");
  console.log("Updated .env.local for network chain ID " + chainId);

  // Also write deployment info JSON
  const deploymentInfo = {
    address: contractAddress,
    network: hre.network.name,
    chainId: chainId,
    rpcUrl: rpcUrl,
    explorerUrl: explorerUrl,
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
