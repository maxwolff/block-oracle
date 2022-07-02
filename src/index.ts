import { ethers } from "ethers";
import { BlockWithTransactions } from "@ethersproject/abstract-provider";
import assert from "assert";
import { Oracle__factory } from "../types/ethers-contracts/factories";
import yargs from "yargs/yargs";
import util from "util";
import fs from "fs";

const writeFileAsync = util.promisify(fs.writeFile);

export const rpcMap: { [networkName: string]: string } = {
  homestead: "https://eth-mainnet.alchemyapi.io/v2",
  localhost: "http://localhost:8545/",
};

export const oracleAddress: { [networkName: string]: string } = {
  localhost: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
};

const exists = (expr: any) => {
  if (expr) {
    return expr;
  } else {
    throw new ReferenceError("found an undefined");
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

export const getSigner = (network: string | undefined) => {
  const provider = getProvider(network);
  const key = exists(process.env.PRIV_KEY);
  return new ethers.Wallet(key, provider);
};

const postBlocks = async (
  blocksProvider: ethers.providers.Provider,
  oracleSigner: ethers.Signer,
  oracleAddress: string
) => {
  const oracle = Oracle__factory.connect(oracleAddress, oracleSigner);

  blocksProvider.on("block", async (blockNumber) => {
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

    let txHashes: string[] = [];
    let didSucceed: boolean[] = [];
    for (let receipt of receipts) {
      txHashes.push(receipt.transactionHash);
      didSucceed.push(Boolean(receipt.status!)); //block must be post byzantium
    }
    // todo: handle retries, failure, gas etc
    try {
      await oracle.storeBlock(
        txHashes,
        didSucceed,
        blockNumber,
        block.miner,
        {}
      );
    } catch (e) {
      throw `Failed to store block ${blockNumber} w/ error: ${e}`;
    }
    console.log(
      `posted ${blockNumber}, coinbase ${block.miner}, hashes: ${txHashes}, didSucceed${didSucceed}`
    );
  });
};

yargs(process.argv.slice(2))
  .command(
    "post",
    "post blocks to oracle contract",
    (yargs) =>
      yargs.options({
        blockNetwork: {
          alias: "b",
          describe: "network name for source of the blocks",
          default: "homestead",
          type: "string",
        },
        oracleNetwork: {
          alias: "o",
          describe: "network name for oracle contract",
          demandOption: true,
          type: "string",
        },
        fill: {
          // todo
          alias: "f",
          describe: "fill since this block?",
          demandOption: false,
        },
      }),
    async (argv) => {
      const blocksProvider = getProvider(argv.blockNetwork);
      const oracleSigner = getSigner(argv.oracleNetwork);
      const oracleAddr = oracleAddress[exists(argv.oracleNetwork)];
      try {
        await postBlocks(blocksProvider, oracleSigner, oracleAddr);
      } catch (e) {
        throw e;
      }
    }
  )
  .usage("ts-node -T src/index.ts post -b homestead -o localhost")
  .help().argv;
