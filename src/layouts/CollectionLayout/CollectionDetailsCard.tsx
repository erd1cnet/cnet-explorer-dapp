import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';

import {
  AccountLink,
  RolesBadges,
  NftBadge,
  TimeAgo,
  SocialIcons,
  SpotlightButton,
  HeroDetailsCard,
  Overlay
} from 'components';
import { formatDate } from 'helpers';
import { useActiveRoute } from 'hooks';
import { faExclamationTriangle, faClock } from 'icons/regular';
import { faHexagonCheck } from 'icons/solid';
import { collectionSelector } from 'redux/selectors';
import { tokensRoutes } from 'routes';
import { NftTypeEnum } from 'types';

export const CollectionDetailsCard = () => {
  const activeRoute = useActiveRoute();
  const { collectionState } = useSelector(collectionSelector);
  const {
    collection,
    assets,
    name,
    ticker,
    type,
    timestamp,
    decimals,
    owner,
    isVerified,
    nftCount,
    holderCount,
    scamInfo
  } = collectionState;

  const mergedAssets = {
    ...(assets?.website
      ? {
          website: assets.website
        }
      : {}),
    ...(assets?.social ? assets.social : {})
  };

  const titleTypeText =
    activeRoute(tokensRoutes.tokensMetaEsdtDetails) ||
    activeRoute(tokensRoutes.tokensMetaEsdtDetailsRoles)
      ? 'Meta-ESDT'
      : 'Collection';

  const title = `${
    assets && !scamInfo
      ? `${name} ${ticker !== name ? `(${ticker})` : ''}`
      : ticker
  } ${titleTypeText}`;

  return (
    <HeroDetailsCard
      title={title}
      description={assets?.description}
      icon={assets?.pngUrl || assets?.svgUrl}
      seoDetails={{ text: '' }}
      className='collection-details'
      titleContent={
        !scamInfo && type !== NftTypeEnum.MetaESDT ? (
          <SpotlightButton path={`/collections/${collection}`} />
        ) : null
      }
      descriptionContent={
        scamInfo ? (
          <span className='text-warning d-flex align-items-center ms-2'>
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              size='sm'
              className='text-warning me-2'
            />
            {scamInfo.info}
          </span>
        ) : null
      }
      isVerified={isVerified}
      verifiedComponent={
        <Overlay title='Verified' className='d-inline-block'>
          <FontAwesomeIcon
            icon={faHexagonCheck}
            size='sm'
            className='text-yellow-spotlight'
          />
        </Overlay>
      }
      detailItems={[
        {
          ...(Object.keys(mergedAssets).length > 0
            ? {
                title: 'Social',
                value: <SocialIcons assets={mergedAssets} />
              }
            : {})
        },
        { title: 'Type', value: <NftBadge type={type} /> },
        { title: 'Collection', value: collection },
        {
          ...(decimals !== undefined
            ? {
                title: 'Decimals',
                value: decimals
              }
            : {})
        },
        {
          ...(timestamp !== undefined
            ? {
                title: 'Created',
                value: (
                  <>
                    <FontAwesomeIcon
                      icon={faClock}
                      className='me-2 text-neutral-400'
                    />
                    <TimeAgo value={timestamp} showAgo />
                    &nbsp;
                    <span className='text-neutral-400'>
                      ({formatDate(timestamp, false, true)})
                    </span>
                  </>
                )
              }
            : {})
        },
        { title: 'Owner', value: <AccountLink address={owner} fetchAssets /> },
        { title: 'Properties', value: <RolesBadges {...collectionState} /> }
      ]}
      statsCards={[
        {
          ...(holderCount !== undefined
            ? {
                title: 'Holders',
                value: new BigNumber(holderCount).toFormat()
              }
            : {})
        },
        {
          ...(nftCount !== undefined
            ? {
                title: 'Items',
                value: new BigNumber(nftCount).toFormat()
              }
            : {})
        }
      ]}
    />
  );
};
