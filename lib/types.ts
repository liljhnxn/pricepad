export enum RecordStatus {
  Available = 0,
  Accepted = 1,
  Rejected = 2,
}

export interface PriceRecord {
  id: bigint;
  creator: `0x${string}`;
  name: string;
  description: string;
  price: bigint;
  status: RecordStatus;
  createdAt: bigint;
}

