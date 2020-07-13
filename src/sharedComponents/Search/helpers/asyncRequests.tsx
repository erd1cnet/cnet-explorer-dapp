import axios from 'axios';

interface ElasticParamsType {
  elasticUrl?: string;
  hash: string;
  timeout: number;
}

export async function isBlock({ elasticUrl, hash, timeout }: ElasticParamsType) {
  try {
    const { data } = await axios.get(`${elasticUrl}/blocks/_doc/${hash}`, { timeout });
    return data.found;
  } catch (e) {
    return false;
  }
}

interface NodeParamsType {
  nodeUrl: string;
  hash: string;
  timeout: number;
}

export async function isAddress({ nodeUrl, hash, timeout }: NodeParamsType) {
  try {
    await axios.get(`${nodeUrl}/address/${hash}`, { timeout });
    return true;
  } catch (e) {
    return false;
  }
}

export async function isTransaction({
  elasticUrl,
  nodeUrl,
  hash,
  timeout,
}: ElasticParamsType & { nodeUrl: string }) {
  try {
    const { data } = await axios.get(`${elasticUrl}/transactions/_doc/${hash}`, { timeout });

    return data.found;
  } catch (e) {
    try {
      const {
        data: { code },
      } = await axios.get(`${nodeUrl}/transaction/${hash}`, { timeout });

      if (code === 'successful') {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }
}
