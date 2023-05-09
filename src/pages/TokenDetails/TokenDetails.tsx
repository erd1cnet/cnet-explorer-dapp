import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';

import { Loader, TransactionsTable } from 'components';
import { FailedTransactions } from 'components/TransactionsTable/components/FailedTransactions';
import { useAdapter, useFetchTransactions } from 'hooks';
import { activeNetworkSelector, tokenSelector } from 'redux/selectors';
import { TransactionFiltersEnum } from 'types';

import { TokenTabs } from '../../layouts/TokenLayout/TokenTabs';

export const TokenDetails = () => {
  const ref = useRef(null);
  const [searchParams] = useSearchParams();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { token } = useSelector(tokenSelector);
  const { transactions: transactionsCount } = token;

  const { getTokenTransfers, getTokenTransfersCount } = useAdapter();
  const { hash: tokenId } = useParams();

  const {
    fetchTransactions,
    transactions,
    totalTransactions,
    isDataReady,
    dataChanged
  } = useFetchTransactions(getTokenTransfers, getTokenTransfersCount, {
    tokenId
  });

  useEffect(() => {
    if (ref.current !== null) {
      fetchTransactions();
    }
  }, [activeNetworkId, tokenId, transactionsCount]);

  useEffect(() => {
    fetchTransactions(Boolean(searchParams.toString()));
  }, [searchParams]);

  return (
    <>
      {isDataReady === undefined && <Loader />}
      {isDataReady === false && <FailedTransactions />}

      <div ref={ref}>
        {isDataReady === true && (
          <div className='row'>
            <div className='col-12'>
              <TransactionsTable
                transactions={transactions}
                totalTransactions={totalTransactions}
                showDirectionCol={false}
                title={<TokenTabs />}
                dataChanged={dataChanged}
                inactiveFilters={[TransactionFiltersEnum.token]}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};
