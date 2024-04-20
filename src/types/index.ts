export interface Token {
  id: string;
  icon: React.ElementType;
  decimals: number;
  name: string;
  description: string;
  networkType: string;
  emissionAmount: bigint;
  height: number;
  txId: string;
  boxId: string;
}
