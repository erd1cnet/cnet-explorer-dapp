import { PAGE_SIZE, TRANSACTIONS_TABLE_FIELDS } from 'appConstants';
import {
  AdapterProviderPropsType,
  GetTransactionsType,
  GetNodesType,
  GetProvidersType,
  GetTokensType,
  GetCollectionsType,
  GetNftsType
} from 'types/adapter.types';

export const getAccountParams = (address?: string) =>
  address
    ? {
        sender: address,
        receiver: address,
        condition: 'should'
      }
    : {};

export function getTransactionsParams({
  page = 1,
  size = PAGE_SIZE,
  senderShard,
  receiverShard,
  sender,
  receiver,
  senderOrReceiver,
  method,
  before,
  after,
  status,
  miniBlockHash,
  search,
  token,
  hashes,
  order,
  fields = TRANSACTIONS_TABLE_FIELDS.join(','),
  withScResults = false,
  withOperations = false,
  withLogs = false,
  withScamInfo = false,
  withUsername = true,
  withBlockInfo = false,
  isRelayed = false,
  // not on api
  isCount = false
}: GetTransactionsType) {
  const params: AdapterProviderPropsType['params'] = {
    ...(isCount
      ? {}
      : {
          from: (page - 1) * size,
          size,
          fields,
          ...(order ? { order } : {}),
          ...(withScResults ? { withScResults } : {}),
          ...(withOperations ? { withOperations } : {}),
          ...(withLogs ? { withLogs } : {}),
          ...(withScamInfo ? { withScamInfo } : {}),
          ...(withUsername ? { withUsername } : {}),
          ...(withBlockInfo ? { withBlockInfo } : {}),
          ...(isRelayed ? { isRelayed } : {})
        }),
    ...(senderShard !== undefined ? { senderShard } : {}),
    ...(receiverShard !== undefined ? { receiverShard } : {}),
    ...(sender ? { sender } : {}),
    ...(receiver ? { receiver } : {}),
    ...(senderOrReceiver ? { senderOrReceiver } : {}),
    ...(method ? { function: method } : {}),
    ...(before ? { before } : {}),
    ...(after ? { after } : {}),
    ...(status ? { status } : {}),
    ...(miniBlockHash ? { miniBlockHash } : {}),
    ...(search ? { search } : {}),
    ...(token ? { token } : {}),
    ...(hashes ? { hashes } : {})
  };

  return params;
}

export function getNodeParams({
  type,
  status,
  issues,
  search,
  shard,
  online,
  page,
  from,
  size = PAGE_SIZE,
  identity,
  sort,
  order,
  provider,
  fullHistory,
  isQualified,
  isAuctioned,
  isAuctionDangerZone,
  // not on api
  isCount = false
}: GetNodesType) {
  const params: AdapterProviderPropsType['params'] = {
    ...(isCount
      ? {}
      : {
          ...(page !== undefined && from === undefined
            ? { from: (page - 1) * size }
            : {}),
          ...(from !== undefined ? { from } : {}),
          ...(size !== undefined ? { size } : {}),
          ...(sort !== undefined ? { sort } : {}),
          ...(order !== undefined ? { order } : {})
        }),
    ...(search !== undefined ? { search } : {}),
    ...(type !== undefined ? { type } : {}),
    ...(status !== undefined ? { status } : {}),
    ...(issues !== undefined ? { issues } : {}),
    ...(shard !== undefined ? { shard: parseInt(shard) } : {}),
    ...(online !== undefined ? { online } : {}),
    ...(identity !== undefined ? { identity } : {}),
    ...(provider !== undefined ? { provider } : {}),
    ...(fullHistory !== undefined ? { fullHistory } : {}),
    ...(isQualified !== undefined ? { isQualified } : {}),
    ...(isAuctioned !== undefined ? { isAuctioned } : {}),
    ...(isAuctionDangerZone !== undefined ? { isAuctionDangerZone } : {})
  };

  return params;
}

export function getProviderParams({ identity, providers }: GetProvidersType) {
  const params: AdapterProviderPropsType['params'] = {
    ...(identity !== undefined ? { identity } : {}),
    ...(providers !== undefined ? { providers } : {})
  };
  return params;
}

export function getTokensParams({
  fields,
  page,
  size = PAGE_SIZE,
  type,
  search,
  name,
  identifier,
  sort,
  order,
  withUsername = true,
  includeMetaESDT
}: GetTokensType) {
  const params: AdapterProviderPropsType['params'] = {
    withUsername,
    ...(fields !== undefined ? { fields } : {}),
    ...(type !== undefined ? { type } : {}),
    ...(search !== undefined ? { search } : {}),
    ...(name !== undefined ? { name } : {}),
    ...(identifier !== undefined ? { identifier } : {}),
    ...(sort !== undefined ? { sort } : {}),
    ...(order !== undefined ? { order } : {}),
    ...(includeMetaESDT !== undefined ? { includeMetaESDT } : {}),
    ...(page !== undefined ? { from: (page - 1) * size } : {}),
    ...(size !== undefined ? { size } : {})
  };

  return params;
}

export function getCollectionsParams({
  fields,
  page,
  size = PAGE_SIZE,
  search,
  identifiers,
  type,
  sort,
  excludeMetaESDT,
  withOwner
}: GetCollectionsType) {
  const params: AdapterProviderPropsType['params'] = {
    ...(fields !== undefined ? { fields } : {}),
    ...(search !== undefined ? { search } : {}),
    ...(identifiers !== undefined ? { identifiers } : {}),
    ...(type !== undefined ? { type } : {}),
    ...(sort !== undefined ? { sort } : {}),
    ...(excludeMetaESDT !== undefined ? { excludeMetaESDT } : {}),
    ...(page !== undefined ? { from: (page - 1) * size } : {}),
    ...(size !== undefined ? { size } : {}),
    ...(withOwner !== undefined ? { withOwner } : {})
  };

  return params;
}

export function getNftsParams({
  page,
  size = PAGE_SIZE,
  search,
  identifiers,
  type,
  collections,
  name,
  tags,
  creator,
  hasUris,
  includeFlagged,
  withSupply,
  withScamInfo,
  excludeMetaESDT,
  source
}: GetNftsType) {
  const params: AdapterProviderPropsType['params'] = {
    ...(search !== undefined ? { search } : {}),
    ...(identifiers !== undefined ? { identifiers } : {}),
    ...(type !== undefined ? { type } : {}),
    ...(collections !== undefined ? { collections } : {}),
    ...(name !== undefined ? { name } : {}),
    ...(tags !== undefined ? { tags } : {}),
    ...(creator !== undefined ? { creator } : {}),
    ...(source !== undefined ? { source } : {}),
    ...(hasUris !== undefined ? { hasUris } : {}),
    ...(includeFlagged !== undefined ? { includeFlagged } : {}),
    ...(withSupply !== undefined ? { withSupply } : {}),
    ...(withScamInfo !== undefined ? { withScamInfo } : {}),
    ...(excludeMetaESDT !== undefined ? { excludeMetaESDT } : {}),
    ...(page !== undefined ? { from: (page - 1) * size } : {}),
    ...(size !== undefined ? { size } : {})
  };

  return params;
}

export const getShardAndEpochParams = (
  shard: number | undefined,
  epoch: number | undefined
) => {
  let result = {};

  if (shard !== undefined) {
    result = { ...result, shard };
  }

  if (epoch !== undefined) {
    result = { ...result, epoch };
  }

  return result;
};

export function processBlocks(blocks: any[]) {
  let min = blocks && blocks.length > 0 ? blocks[0].nonce : 0;
  let max = min;
  for (const block in blocks) {
    // tslint:disable-line
    if (blocks[block].nonce < min) {
      min = blocks[block].nonce;
    }

    if (blocks[block].nonce > max) {
      max = blocks[block].nonce;
    }
  }

  const startBlockNr = min;
  const endBlockNr = max;

  return {
    blocks,
    startBlockNr,
    endBlockNr
  };
}
