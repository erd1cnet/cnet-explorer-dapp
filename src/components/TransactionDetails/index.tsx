import { faClock, faExchangeAlt, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import { useGlobalState } from 'context';
import { addressIsBech32, dateFormatted } from 'helpers';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import {
  Denominate,
  Loader,
  ScAddressIcon,
  ShardSpan,
  TestnetLink,
  TimeAgo,
  TransactionStatus,
} from 'sharedComponents';
import { TransactionType } from 'sharedComponents/TransactionsTable';
import { getTransaction } from './helpers/asyncRequests';

const getFee = (transaction: TransactionType) => {
  const web3 = new Web3();
  const bNgasPrice = new BigNumber(transaction.gasPrice);
  const bNgasUsed = new BigNumber(transaction.gasUsed);
  const output = web3.utils.toBN(bNgasPrice.times(bNgasUsed) as any).toString(10);
  return output;
};

const TransactionDetails: React.FC = () => {
  const { hash: transactionId } = useParams();
  const ref = React.useRef(null);

  const {
    activeTestnet: { elasticUrl },
    timeout,
  } = useGlobalState();

  const [transaction, setTransaction] = React.useState<TransactionType | undefined>(undefined);
  const [transactionFetched, setTransactionFetched] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (transactionId && ref.current !== null) {
      getTransaction({ elasticUrl, transactionId, timeout }).then(
        ({ data, transactionFetched }) => {
          if (transactionFetched) {
            setTransaction(data);
            setTransactionFetched(true);
          } else {
            if (ref.current !== null) {
              setTransactionFetched(false);
            }
          }
        }
      );
    }
  }, [elasticUrl, transactionId, timeout]); // run the operation only once since the parameter does not change

  const errorMessage =
    transaction &&
    transaction.scResults !== null &&
    transaction.scResults !== undefined &&
    transaction.scResults[0].returnMessage
      ? transaction.scResults[0].returnMessage
      : '';

  return (
    <div ref={ref}>
      <div className="container pt-3 pb-3">
        <div className="row">
          <div className="col-12">
            <h4 data-testid="title">Transaction Details</h4>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            {!transactionFetched ? (
              <div className="card" data-testid="errorScreen">
                <div className="card-body card-details">
                  <div className="empty">
                    <FontAwesomeIcon icon={faExchangeAlt} className="empty-icon" />
                    <span className="h4 empty-heading">Unable to locate this transaction hash</span>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {transaction ? (
                  <div className="card">
                    <div className="card-body card-details">
                      <div className="row">
                        <div className="col-lg-2 card-label">Hash</div>
                        <div className="col-lg-10">
                          <ScAddressIcon
                            initiator={transaction.sender}
                            secondInitiator={transaction.receiver}
                          />
                          {transaction.hash}
                        </div>
                      </div>
                      <hr className="hr-space" />
                      <div className="row">
                        <div className="col-lg-2 card-label">Status</div>
                        <div className="col-lg-10">
                          <TransactionStatus status={transaction.status} />
                        </div>
                      </div>
                      <hr className="hr-space" />
                      <div className="row">
                        <div className="col-lg-2 card-label">Timestamp</div>
                        <div className="col-lg-10">
                          <FontAwesomeIcon icon={faClock} className="mr-2" />
                          <TimeAgo value={transaction.timestamp} />
                          &nbsp;({dateFormatted(transaction.timestamp)})
                        </div>
                      </div>
                      <hr className="hr-space" />
                      <div className="row">
                        <div className="col-lg-2 card-label">Miniblock</div>
                        <div className="col-lg-10">
                          <TestnetLink to={`/miniblocks/${transaction.miniBlockHash}`}>
                            {transaction.miniBlockHash}
                          </TestnetLink>
                        </div>
                      </div>
                      <hr className="hr-space" />
                      <div className="row">
                        <div className="col-lg-2 card-label">From</div>
                        <div className="col-lg-10">
                          <ScAddressIcon initiator={transaction.sender} />
                          {addressIsBech32(transaction.sender) ? (
                            <>
                              <TestnetLink to={`/address/${transaction.sender}`}>
                                {transaction.sender}
                              </TestnetLink>
                              <TestnetLink
                                to={`/transactions/shard-from/${transaction.senderShard}`}
                                className="small-link"
                              >
                                &nbsp;(
                                <ShardSpan shardId={transaction.senderShard} />)
                              </TestnetLink>
                            </>
                          ) : (
                            <ShardSpan shardId={transaction.sender} />
                          )}
                          &nbsp;
                        </div>
                      </div>
                      <hr className="hr-space" />
                      <div className="row">
                        <div className="col-lg-2 card-label">To</div>
                        <div className="col-lg-10">
                          <ScAddressIcon initiator={transaction.receiver} />
                          <TestnetLink to={`/address/${transaction.receiver}`}>
                            {transaction.receiver}
                          </TestnetLink>
                          &nbsp;
                          {!isNaN(transaction.receiverShard) && (
                            <TestnetLink
                              to={`/transactions/shard-to/${transaction.receiverShard}`}
                              className="small-link"
                            >
                              (<ShardSpan shardId={transaction.receiverShard} />)
                            </TestnetLink>
                          )}
                          {errorMessage && (
                            <>
                              <br />
                              <FontAwesomeIcon
                                icon={faExclamationTriangle}
                                className="text-danger"
                                size="xs"
                              />
                              <small className="text-danger"> {errorMessage}</small>
                            </>
                          )}
                        </div>
                      </div>
                      <hr className="hr-space" />
                      <div className="row">
                        <div className="col-lg-2 card-label">Value</div>
                        <div className="col-lg-10">
                          <Denominate value={transaction.value} showLastNonZeroDecimal />
                        </div>
                      </div>
                      <hr className="hr-space" />
                      <div className="row">
                        <div className="col-lg-2 card-label">Transaction Fee</div>
                        <div className="col-lg-10">
                          <Denominate value={getFee(transaction)} showLastNonZeroDecimal />
                        </div>
                      </div>
                      <hr className="hr-space" />
                      <div className="row">
                        <div className="col-lg-2 card-label">Gas Limit</div>
                        <div className="col-lg-10">{transaction.gasLimit.toLocaleString('en')}</div>
                      </div>
                      <hr className="hr-space" />
                      <div className="row">
                        <div className="col-lg-2 card-label">Gas Used</div>
                        <div className="col-lg-10">{transaction.gasUsed.toLocaleString('en')}</div>
                      </div>
                      <hr className="hr-space" />
                      <div className="row">
                        <div className="col-lg-2 card-label">Gas Price</div>
                        <div className="col-lg-10">
                          <Denominate
                            value={transaction.gasPrice.toString()}
                            showLastNonZeroDecimal
                          />
                        </div>
                      </div>
                      <hr className="hr-space" />
                      <div className="row">
                        <div className="col-lg-2 card-label">Nonce</div>
                        <div className="col-lg-10">{transaction.nonce}</div>
                      </div>
                      <hr className="hr-space" />
                      <div className="row">
                        <div className="col-lg-2 card-label">Input Data</div>
                        <div className="col-lg-10">
                          <textarea
                            readOnly
                            className="form-control col-lg-12 cursor-text"
                            rows={2}
                            defaultValue={transaction.data}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Loader />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;
