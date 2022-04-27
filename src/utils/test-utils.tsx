import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import 'jest-canvas-mock';
import { render } from '@testing-library/react';
import { GlobalProvider } from 'context';
import { ConfigType } from 'context/state';
import { createMemoryHistory, History } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';
import { App } from '../App';
import defaultConfig from './config';
import * as rawData from './rawData';

const customRender = (ui: any, options: any = {}) => render(ui, { wrapper: App, ...options });

const renderWithRouter = ({
  route = '/',
  history = createMemoryHistory({ initialEntries: ['/'] }),
  optionalConfig,
}: {
  route: string;
  history?: History;
  optionalConfig?: ConfigType;
}) => {
  history = createMemoryHistory({ initialEntries: [route] });

  return {
    ...render(
      <GlobalProvider optionalConfig={optionalConfig}>
        <Router history={history}>
          <App optionalConfig={optionalConfig || defaultConfig} />
        </Router>
      </GlobalProvider>
    ),
    // adding `history` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    history,
  };
};

interface MockImplementationType {
  networkRequests?: { [key: string]: () => Promise<any> };
}

const mockImplementation = ({ networkRequests }: MockImplementationType) => {
  const requests = {
    stats: () => Promise.resolve({ data: rawData.stats }),
    validators: () => Promise.resolve({ data: rawData.validators }),
    transactionsCount: () => Promise.resolve({ data: 14253408 }),
    transactions: () => Promise.resolve({ data: rawData.transactionsSearch }),
    transaction: () => Promise.resolve({ data: rawData.transactions }),
    blocksCount: () => Promise.resolve({ data: 239890 }),
    blocks: () => Promise.resolve({ data: rawData.blocks }),
    block: () => {
      return Promise.resolve({ data: rawData.block });
    },
    miniblock: () => Promise.resolve({ data: rawData.miniblock }),
    networkStatus: () => Promise.resolve({ data: { data: rawData.epoch, code: 'successful' } }),
    accountsCount: () => Promise.resolve({ data: 1933 }),
    accounts: () => Promise.resolve({ data: rawData.accounts }),
    account: () => Promise.resolve({ data: rawData.account }),
    accountTokens: () => Promise.resolve({ data: rawData.accountTokens }),
    accountTokensCount: () => Promise.resolve({ data: rawData.accountTokens.length }),
    delegation: () => Promise.resolve({ data: rawData.delegation }),
    node: () => Promise.resolve({ data: rawData.node }),
    identity: () => Promise.resolve({ data: rawData.identity }),
    identities: () => Promise.resolve({ data: rawData.identities }),
    tokens: () => Promise.resolve({ data: rawData.tokens }),
    tokenDetails: () => Promise.resolve({ data: rawData.tokenDetails }),
    providers: () => Promise.resolve({ data: rawData.providers }),
    provider: () => Promise.resolve({ data: rawData.provider }),
    price: () => Promise.resolve({ data: 161.4137347617252 }),
    blacklist: () => Promise.resolve({ data: {} }),
    ...networkRequests,
  };

  return (url: string): any => {
    switch (true) {
      // --- page load ---
      case url.includes('/stats'):
        return requests.stats();
      // --- page load ---
      case url.includes('network/status'):
        return requests.networkStatus();
      case url.includes('/validators'): // TODO: check
        return requests.validators();
      case url.includes('/transactions/c'):
        return requests.transactionsCount();
      case url.includes('/transactions/'):
        return requests.transaction();
      case url.includes('/transactions'):
        return requests.transactions();
      case url.includes('/delegation'):
        return requests.delegation();
      case url.includes('/accounts/') && url.includes('/tokens/c'):
        return requests.accountTokensCount();
      case url.includes('/accounts/') && url.includes('/tokens'):
        return requests.accountTokens();
      case url.includes('/accounts/c'):
        return requests.accountsCount();
      case url.includes('/accounts/'):
        return requests.account();
      case url.includes('/accounts'):
        return requests.accounts();
      case url.includes('/blocks/c'):
        return requests.blocksCount();
      case url.includes('/blocks/'):
        return requests.block();
      case url.includes('/blocks'):
        return requests.blocks();
      case url.includes('/miniblocks/'):
        return requests.miniblock();
      case url.includes('/nodes/'):
        return requests.node();
      case url.includes('/identities'):
        return requests.identities();
      case url.includes('/identities/'):
        return requests.identity();
      case url.includes('/tokens/'):
        return requests.tokenDetails();
      case url.includes('/tokens'):
        return requests.tokens();
      case url.includes('/providers/'):
        return requests.provider();
      case url.includes('/providers'):
        return requests.providers();
      case url.includes('/price'):
        return requests.price();
      case url.endsWith('/permissions/deny/terms'):
        return requests.blacklist();
    }
  };
};

const beforeAll = ({
  route,
  networkRequests,
  optionalConfig = defaultConfig,
}: {
  route: string;
  networkRequests?: MockImplementationType['networkRequests'];
  optionalConfig?: ConfigType;
}) => {
  const mockGet = jest.spyOn(axios, 'get');

  mockGet.mockImplementation(mockImplementation({ networkRequests }));

  return renderWithRouter({
    route,
    optionalConfig,
  });
};

// re-export everything
export * from '@testing-library/react';
// override render method
export { customRender as render, renderWithRouter, beforeAll };
