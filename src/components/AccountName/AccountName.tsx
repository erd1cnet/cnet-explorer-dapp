import { useEffect, useState } from 'react';
import classNames from 'classnames';

import { HEROTAG_SUFFIX } from 'appConstants';
import { ReactComponent as IdentityLogo } from 'assets/img/logos/identity.svg';
import { Trim, Overlay } from 'components';
import { formatHerotag } from 'helpers';
import { useAdapter } from 'hooks';
import { AccountAssetType, WithClassnameType } from 'types';

export interface AccountNameUIType extends WithClassnameType {
  address: string;
  assets?: AccountAssetType;
  fetchAssets?: boolean;
}

export const AccountName = ({
  address,
  assets,
  fetchAssets = false,
  className,
  'data-testid': dataTestId = ''
}: AccountNameUIType) => {
  const { getAccountAssets } = useAdapter();
  const [fetchedAssets, setFetchedAssets] = useState<AccountAssetType>();

  const fetchAccountAssets = () => {
    getAccountAssets({ address }).then(({ success, data }) => {
      if (success) {
        if (data?.assets) {
          setFetchedAssets(data.assets);
          return;
        }
        if (data?.username) {
          setFetchedAssets({ name: data.username });
          return;
        }
      }
    });
  };

  useEffect(() => {
    if (address && fetchAssets && !assets) {
      fetchAccountAssets();
    }
  }, [address, fetchAssets, assets]);

  const displayAssets = assets || fetchedAssets;

  if (displayAssets?.name) {
    const name = formatHerotag(displayAssets.name);
    const description = `${name} (${address})`;

    return (
      <>
        {displayAssets.name.endsWith(HEROTAG_SUFFIX) && (
          <Overlay
            title='Herotag'
            className='herotag'
            tooltipClassName='account-name'
          >
            <IdentityLogo className='herotag-logo' />
          </Overlay>
        )}
        <Overlay title={description} tooltipClassName='account-name'>
          <div
            className={classNames('text-truncate', className)}
            data-testid={dataTestId}
          >
            {name}
          </div>
        </Overlay>
      </>
    );
  }

  return <Trim text={address} className={className} data-testid={dataTestId} />;
};
