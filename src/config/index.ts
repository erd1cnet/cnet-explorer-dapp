import { NetworkType } from 'types/network.types';
import { allApps, schema } from './sharedConfig';
export * from './sharedConfig';

export const networks: NetworkType[] = [
  {
    default: true,
    id: 'testnet',
    name: 'Testnet',
    chainId: 'local-testnet',
    adapter: 'api',
    theme: 'testnet',
    egldLabel: 'xCNET',
    walletAddress: 'https://testnet-wallet.cyber.network',
    explorerAddress: 'https://testnet-explorer.cyber.network',
    nftExplorerAddress: 'https://testnet.xspotlight.com',
    apiAddress: 'https://testnet-api.cyber.network'
  }
];

export const multiversxApps = allApps([
  {
    id: 'wallet',
    url: 'https://testnet-wallet.cyber.network'
  },
  {
    id: 'explorer',
    url: 'https://testnet-explorer.cyber.network'
  },
  {
    id: 'xspotlight',
    url: 'https://testnet.xspotlight.com'
  },
  {
    id: 'bridge',
    url: 'https://testnet-bridge.multiversx.com'
  }
]);

networks.forEach((network) => {
  schema.validate(network, { strict: true }).catch(({ errors }) => {
    console.error(`Config invalid format for ${network.id}`, errors);
  });
});