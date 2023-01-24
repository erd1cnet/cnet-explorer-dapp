import React, { useEffect } from 'react';
import { faLeaf } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BigNumber from 'bignumber.js';

import { useSelector } from 'react-redux';
import { ReactComponent as MultiversXSymbol } from 'assets/img/multiversx-legacy-delegation.svg';

import { Denominate } from 'components';
import { activeNetworkSelector, economicsSelector } from 'redux/selectors';
import { DelegationLegacyType, IdentityType } from 'types';

import { DetailsBlock } from '../DetailsBlock';

export const AccountLegacyDelegation = ({
  delegationLegacy,
  identity
}: {
  delegationLegacy: DelegationLegacyType;
  identity?: IdentityType;
}) => {
  const { economicsFetched, baseApr, topUpApr } =
    useSelector(economicsSelector);
  const { egldLabel } = useSelector(activeNetworkSelector);

  const {
    userActiveStake,
    claimableRewards,
    userUnstakedStake,
    userWaitingStake
  } = delegationLegacy;

  const [legacyDelegationApr, setLegacyDelegationApr] =
    React.useState<string>('...');

  const getLegacyDelegationApr = () => {
    if (
      economicsFetched &&
      identity?.stake &&
      identity?.topUp &&
      identity?.locked
    ) {
      const legacyDelegationBN = new BigNumber(identity.stake)
        .times(new BigNumber(baseApr))
        .plus(new BigNumber(identity.topUp).times(topUpApr))
        .dividedBy(new BigNumber(identity.locked))
        .times(new BigNumber(100));

      setLegacyDelegationApr(`${legacyDelegationBN.toNumber().toFixed(2)}%`);
    } else {
      setLegacyDelegationApr('N/A');
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(getLegacyDelegationApr, [economicsFetched, identity]);

  return (
    <div className='delegation-row d-flex flex-wrap align-items-center justify-content-between p-3 px-md-4'>
      <div className='provider-details'>
        <div className='d-flex flex-row align-items-center'>
          <div className='multiversx-icon provider-image has-avatar rounded-circle d-flex me-3'>
            <MultiversXSymbol />
          </div>
          <div className='d-flex flex-column w-100'>
            <div className='provider-title d-flex align-items-center'>
              MultiversX Legacy Delegation
            </div>

            <div className='d-flex flex-wrap provider-metrics'>
              <div>
                <FontAwesomeIcon size='xs' icon={faLeaf} className='me-1' />
                Up to {legacyDelegationApr}
                <span className='text-secondary ms-1'>APY</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {userActiveStake && userActiveStake !== '0' && (
        <DetailsBlock>
          <strong>
            <Denominate value={new BigNumber(userActiveStake).toString(10)} />
          </strong>
          <small>Amount Delegated</small>
        </DetailsBlock>
      )}

      {userUnstakedStake && userUnstakedStake !== '0' && (
        <DetailsBlock>
          <strong>
            <Denominate value={new BigNumber(userUnstakedStake).toString(10)} />
          </strong>
          <small>Undelegated</small>
        </DetailsBlock>
      )}

      {userWaitingStake && userWaitingStake !== '0' && (
        <DetailsBlock>
          <strong>
            <Denominate value={new BigNumber(userWaitingStake).toString(10)} />
          </strong>
          <small>Waiting</small>
        </DetailsBlock>
      )}

      <DetailsBlock>
        <strong>
          {claimableRewards ? (
            <Denominate value={new BigNumber(claimableRewards).toString(10)} />
          ) : (
            <>0 {egldLabel}</>
          )}
        </strong>
        <small>Rewards</small>
      </DetailsBlock>
    </div>
  );
};
