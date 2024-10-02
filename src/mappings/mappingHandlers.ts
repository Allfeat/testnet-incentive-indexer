import { FaucetTransfer, PassMint } from "../types";
import { SubstrateEvent } from "@subql/types";
import { Balance } from "@polkadot/types/interfaces";
import {
  FrontierEvmEvent,
} from "@subql/frontier-evm-processor";
import { BigNumber } from "ethers";
import assert from "assert";

// Setup types from ABI
type MintedEventArgs = [string, BigNumber] & {
  to: string;
  tokenId: BigNumber;
};

const faucet_address: string = "0xFe50094e366802c9d0aa0b47fC19B275e92F0b7F";

export async function handleMintEvent(event: FrontierEvmEvent<MintedEventArgs>): Promise<void> {
  logger.info(
    `New pass mint event found.`
  );

  assert(event.args, "Missing event.args");
  assert(event.transactionHash, "Missing Tx Hash");

  const mint = PassMint.create({
    id: event.transactionHash,
    to: event.args.to
  })

  await mint.save();
}

export async function handleEvent(event: SubstrateEvent): Promise<void> {

  logger.info(
    `New transfer event found at block ${event.block.block.header.number.toString()}`
  );
  const {
    event: {
      data: [from, to, amount],
    },
  } = event;

  if (from.toString() !== faucet_address) {
    logger.info("Not a faucet transfer, ignoring.");
    return;
  }

  const blockNumber: number = event.block.block.header.number.toNumber();
  const transfer = FaucetTransfer.create({
    id: `${event.block.block.header.number.toNumber()}-${event.idx}`,
    blockNumber,
    date: event.block.timestamp,
    to: to.toString(),
    amount: (amount as Balance).toBigInt(),
  });

  await transfer.save();
}
