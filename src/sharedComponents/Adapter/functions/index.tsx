import { GetNodesType as GetNodesInterface } from './getNodes';
import { processBlocks, GetBlocksParamsType, getShardOrEpochParam } from './getBlocks';
import {
  getTransactionsParams,
  getAccountParams,
  TransactionsParamsType as TransactionsInterface,
} from './getTransactions';

export interface ProviderPropsType {
  baseUrl: string;
  proxyUrl?: string;
  metaChainShardId?: number;
  url?: string;
  params?: {
    nonce?: number;
    shard?: number;
    epoch?: number;
    proposer?: string;
    miniBlockHash?: string;
    sender?: string;
    receiver?: string;
    condition?: 'should' | 'must';
    senderShard?: number;
    receiverShard?: number;
    signersIndexes?: number;
    round?: number;
    from?: number;
    size?: number;
    search?: string;
    issues?: string;
    peerType?: string;
    nodeType?: string;
    status?: string;
    validator?: string;
    fields?: any;
    identity?: string;
    sort?: string;
    order?: string;
  };
  timeout: number;
}

// export type ProviderType = (props: ProviderPropsType & { url: string }) => Promise<AxiosResponse>;
export type ProviderType = (props: ProviderPropsType & { url: string }) => Promise<any>; // TODO: back

export type AdapterFunctionType = ProviderPropsType & { provider: ProviderType };

export type GetBlocksType = GetBlocksParamsType;

export type TransactionsParamsType = TransactionsInterface;

export type GetNodesType = GetNodesInterface;

export { processBlocks, getShardOrEpochParam, getTransactionsParams, getAccountParams };
