import * as React from 'react';
import { faClock } from '@fortawesome/pro-regular-svg-icons/faClock';
import { faExclamationTriangle } from '@fortawesome/pro-regular-svg-icons/faExclamationTriangle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BigNumber from 'bignumber.js';
import { addressIsBech32, dateFormatted, urlBuilder } from 'helpers';
import {
  Denominate,
  ScAddressIcon,
  ShardSpan,
  TestnetLink,
  TimeAgo,
  TransactionStatus,
} from 'sharedComponents';
import { TransactionType } from 'sharedComponents/TransactionsTable';
import TransactionDetail from './TransactionDetail';

const getFee = (transaction: TransactionType) => {
  const bNgasPrice = new BigNumber(transaction.gasPrice);
  const bNgasUsed = new BigNumber(transaction.gasUsed);
  const output = bNgasPrice.times(bNgasUsed).toString();
  return output;
};

const Details = ({ transaction }: { transaction: TransactionType }) => {
  const errorMessage =
    transaction &&
    transaction.scResults !== null &&
    transaction.scResults !== undefined &&
    transaction.scResults[0].returnMessage
      ? transaction.scResults[0].returnMessage
      : '';

  return (
    <div className="card">
      <div className="card-body card-details">
        <TransactionDetail label="Hash">
          <ScAddressIcon initiator={transaction.sender} secondInitiator={transaction.receiver} />
          {transaction.txHash}
        </TransactionDetail>

        <TransactionDetail label="Status">
          <TransactionStatus status={transaction.status} />
        </TransactionDetail>

        <TransactionDetail label="Timestamp">
          {transaction.timestamp !== undefined ? (
            <>
              <FontAwesomeIcon icon={faClock} className="mr-2" />
              <TimeAgo value={transaction.timestamp} />
              &nbsp;({dateFormatted(transaction.timestamp)})
            </>
          ) : (
            <span className="text-muted">N/A</span>
          )}
        </TransactionDetail>

        <TransactionDetail label="Miniblock">
          {transaction.miniBlockHash ? (
            <TestnetLink to={`/miniblocks/${transaction.miniBlockHash}`}>
              {transaction.miniBlockHash}
            </TestnetLink>
          ) : (
            <span className="text-muted">N/A</span>
          )}
        </TransactionDetail>

        <TransactionDetail label="From">
          <ScAddressIcon initiator={transaction.sender} />
          {addressIsBech32(transaction.sender) ? (
            <>
              <TestnetLink to={`/address/${transaction.sender}`}>{transaction.sender}</TestnetLink>
              <TestnetLink
                to={urlBuilder.senderShard(transaction.senderShard)}
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
        </TransactionDetail>

        <TransactionDetail label="To">
          <ScAddressIcon initiator={transaction.receiver} />
          <TestnetLink to={`/address/${transaction.receiver}`}>{transaction.receiver}</TestnetLink>
          &nbsp;
          {!isNaN(transaction.receiverShard) && (
            <TestnetLink
              to={urlBuilder.receiverShard(transaction.receiverShard)}
              className="small-link"
            >
              (<ShardSpan shardId={transaction.receiverShard} />)
            </TestnetLink>
          )}
          {errorMessage && (
            <>
              <br />
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-danger" size="xs" />
              <small className="text-danger"> {errorMessage}</small>
            </>
          )}
        </TransactionDetail>

        <TransactionDetail label="Value">
          <Denominate value={transaction.value} showLastNonZeroDecimal />
        </TransactionDetail>

        <TransactionDetail label="Transaction Fee">
          {transaction.gasUsed !== undefined ? (
            <Denominate value={getFee(transaction)} showLastNonZeroDecimal />
          ) : (
            <span className="text-muted">N/A</span>
          )}
        </TransactionDetail>

        <TransactionDetail label="Gas Limit">
          {transaction.gasLimit.toLocaleString('en')}
        </TransactionDetail>

        <TransactionDetail label="Gas Used" disabled={!transaction.gasUsed}>
          {transaction.gasUsed ? transaction.gasUsed.toLocaleString('en') : ''}
        </TransactionDetail>

        <TransactionDetail label="Gas Price">
          <Denominate value={transaction.gasPrice.toString()} showLastNonZeroDecimal />
        </TransactionDetail>

        <TransactionDetail label="Nonce">{transaction.nonce}</TransactionDetail>

        <TransactionDetail label="Input Data">
          <textarea
            readOnly
            className="form-control col-lg-12 cursor-text"
            rows={2}
            defaultValue={
              transaction.data
                ? Buffer.from(transaction.data, 'base64').toString()
                : transaction.data
            }
          />
        </TransactionDetail>
      </div>
    </div>
  );
};

export default Details;
