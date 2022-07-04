import { ethers } from "ethers";
import { BlockWithTransactions } from "@ethersproject/abstract-provider";
import { Oracle__factory } from "../types/ethers-contracts/factories";
import util from "util";
import fs from "fs";
const writeFileAsync = util.promisify(fs.writeFile);

export const rpcMap: { [networkName: string]: string } = {
  homestead: "https://eth-mainnet.alchemyapi.io/v2",
  localhost: "http://localhost:8545/",
};

export const oracleAddresses: { [networkName: string]: string } = {
  localhost: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
};

const exists = (expr: any, msg?: string) => {
  if (expr) {
    return expr;
  } else {
    throw new ReferenceError(msg || "found an undefined");
  }
};

export const getProvider = (network: string | undefined) => {
  const base = exists(rpcMap[network!]);
  if (network === "localhost") {
    return new ethers.providers.JsonRpcProvider(base);
  } else {
    const key = exists(process.env.API_KEY);
    const finalUrl = `${base}/${key}`; // alchemy fmt
    return new ethers.providers.JsonRpcProvider(finalUrl);
  }
};

export const getSigner = (network: string | undefined, privKey: string) => {
  const provider = getProvider(network);
  return new ethers.Wallet(privKey, provider);
};

const postBlock = async (
  blocksProvider: ethers.providers.Provider,
  oracleSigner: ethers.Signer,
  oracleAddress: string,
  blockNumber: number
) => {
  const oracle = Oracle__factory.connect(oracleAddress, oracleSigner);

  const block: BlockWithTransactions =
    await blocksProvider.getBlockWithTransactions(blockNumber);
  // wait() throws error on revert
  const settledReceipts: PromiseSettledResult<ethers.providers.TransactionReceipt>[] =
    await Promise.allSettled(block.transactions.map((tx) => tx.wait()));
  const receipts = settledReceipts.map((settledReceipt) => {
    if (settledReceipt.status == "fulfilled") {
      return settledReceipt.value;
    } else {
      return settledReceipt.reason.receipt;
    }
  });

  let txHashArr: string[] = [];
  let didSucceedArr: boolean[] = [];
  for (let receipt of receipts) {
    txHashArr.push(receipt.transactionHash);
    didSucceedArr.push(Boolean(receipt.status!)); //block must be post byzantium
  }

  // todo: handle retries, failure, gas etc
  try {
    await oracle.storeBlock(
      txHashArr,
      didSucceedArr,
      blockNumber,
      block.miner,
      {}
    );
  } catch (e) {
    throw `Failed to store block ${blockNumber} w/ error: ${e}`;
  }
  console.log(
    `posted ${txHashArr.length} from block ${blockNumber} and coinbase ${block.miner}`
  );
};

const main = async () => {
  const blockNetwork = exists(process.env.BLOCK_NETWORK, "missing bn env");
  const oracleNetwork = exists(process.env.ORACLE_NETWORK, "missing on env");
  const key = exists(process.env.PRIV_KEY, "missing pk env");

  const blocksProvider = getProvider(blockNetwork);
  const oracleSigner = getSigner(oracleNetwork, key);
  const oracleAddress = oracleAddresses[oracleNetwork];
  try {
    blocksProvider.on("block", async (blockNumber: number) => {
      await postBlock(blocksProvider, oracleSigner, oracleAddress, blockNumber);
    });
  } catch (e) {
    throw e;
  }
};

(async () => {
  await main();
})();
