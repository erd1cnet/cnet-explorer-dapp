import axios from 'axios';

interface GetTransactionsType {
  elasticUrl?: string;
  nodeUrl?: string;
  timeout: number;
  transactionId: string;
}

export async function getTransaction({ elasticUrl, transactionId, timeout }: GetTransactionsType) {
  const { data } = await axios.get(`${elasticUrl}/transactions/${transactionId}`, { timeout });

  return {
    data: { hash: data.id, ...data },
    transactionFetched: true,
  };
}

export async function getPendingTransaction({
  transactionId,
  timeout,
  nodeUrl,
}: GetTransactionsType) {
  try {
    const {
      data: { transaction },
    } = await axios.get(`${nodeUrl}/transaction/${transactionId}`, { timeout });

    return {
      data: { hash: transactionId, ...transaction },
      transactionFetched: true,
    };
  } catch {
    return {
      data: {},
      transactionFetched: false,
    };
  }
}
