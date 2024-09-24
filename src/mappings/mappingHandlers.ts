import { SubstrateTransfer } from "../types";
import { SubstrateEvent } from "@subql/types";
import { Balance } from "@polkadot/types/interfaces";

export async function handleEvent(event: SubstrateEvent): Promise<void> {
  logger.info(
    `New transfer event found at block ${event.block.block.header.number.toString()}`
  );
  const {
    event: {
      data: [from, to, amount],
    },
  } = event;

  const blockNumber: number = event.block.block.header.number.toNumber();
  const transfer = SubstrateTransfer.create({
    id: `${event.block.block.header.number.toNumber()}-${event.idx}`,
    blockNumber,
    date: event.block.timestamp,
    from: from.toString(),
    to: to.toString(),
    amount: (amount as Balance).toBigInt(),
  });

  await transfer.save();
}
