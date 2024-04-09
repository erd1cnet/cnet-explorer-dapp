import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { MultilayerPercentageBar, Led, InfoTooltip } from 'components';
import { formatBigNumber } from 'helpers';
import { stakeSelector } from 'redux/selectors';
import { WithClassnameType } from 'types';

export const NodesEligibilityPercentageBar = ({
  className
}: WithClassnameType) => {
  const {
    isFetched: isStakeFetched,
    qualifiedAuctionValidators,
    notQualifiedAuctionValidators,
    dangerZoneValidators,
    unprocessed
  } = useSelector(stakeSelector);

  if (!isStakeFetched || !unprocessed?.auctionValidators) {
    return null;
  }

  const totalValidators = new BigNumber(unprocessed.auctionValidators);

  const percentageNotQualified = new BigNumber(
    notQualifiedAuctionValidators ?? 0
  )
    .dividedBy(totalValidators)
    .times(100);
  const percentageDangerZone = new BigNumber(
    unprocessed.dangerZoneValidators ?? 0
  )
    .dividedBy(totalValidators)
    .times(100);
  const percentageQualified = new BigNumber(
    unprocessed.qualifiedAuctionValidators ?? 0
  )
    .dividedBy(totalValidators)
    .times(100);
  const percentageQualifiedNoDangerZone = new BigNumber(
    unprocessed.qualifiedAuctionValidators ?? 0
  )
    .minus(unprocessed.dangerZoneValidators ?? 0)
    .dividedBy(totalValidators)
    .times(100);

  return (
    <MultilayerPercentageBar
      steps={[
        {
          name: 'Not Qualified',
          value: percentageNotQualified.toFixed(2),
          className: 'bg-red-400',
          legend: (
            <div
              className='legend'
              style={{ width: `${percentageNotQualified.toFixed(2)}%` }}
            >
              <div className='name'>Not Qualified</div>
              <div className='description'>{notQualifiedAuctionValidators}</div>
              <div className='value'>
                {formatBigNumber({ value: percentageNotQualified })}%
              </div>
            </div>
          )
        },
        {
          name: 'Danger Zone',
          value: percentageDangerZone.toFixed(2),
          className: 'bg-orange-400',
          legend: (
            <div
              className='legend'
              style={{ width: `${percentageDangerZone.toFixed(2)}%` }}
            >
              <div className='name'>
                Danger Zone
                <InfoTooltip
                  title={
                    <>
                      <p className='mb-2 h6'>
                        Danger Zone <Led color='bg-red-400 ms-1' />
                      </p>
                      <p className='text-neutral-400 mb-0'>
                        {dangerZoneValidators} nodes are under the 5% threshold
                        level. Increase the staked amount / node to exit the
                        danger zone and move up in the auction list.
                      </p>
                    </>
                  }
                  tooltipClassName='tooltip-text-start tooltip-lg'
                />
              </div>
              <div className='description'>{dangerZoneValidators}</div>
            </div>
          )
        },
        {
          name: 'Qualified',
          value: percentageQualifiedNoDangerZone.toFixed(2),
          className: 'bg-green-400',
          legend: (
            <div
              className='legend'
              style={{
                width: `${percentageQualifiedNoDangerZone.toFixed(2)}%`
              }}
            >
              <div className='name'>Qualified</div>
              <div className='description'>{qualifiedAuctionValidators}</div>
              <div className='value'>
                {formatBigNumber({ value: percentageQualified })}%
              </div>
            </div>
          )
        }
      ]}
      className={classNames('nodes-eligibility-percentage-bar', className)}
      legendClassName='eligibility-legend-container'
    />
  );
};
