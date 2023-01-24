import React from 'react';
import { NftType, NftEnumType } from 'types';

export const NftBadge = ({
  type,
  className
}: {
  type: NftType['type'] | 'FungibleESDT';
  className?: string;
}) => {
  switch (type) {
    case NftEnumType.SemiFungibleESDT:
      return (
        <div
          className={`badge badge-outline badge-outline-orange ${
            className ? className : ''
          }`}
        >
          SFT
        </div>
      );
    case NftEnumType.NonFungibleESDT:
      return (
        <div
          className={`badge badge-outline badge-outline-yellow ${
            className ? className : ''
          }`}
        >
          NFT
        </div>
      );
    case NftEnumType.MetaESDT:
      return (
        <div
          className={`badge badge-outline badge-outline-green ${
            className ? className : ''
          }`}
        >
          Meta-ESDT
        </div>
      );
    default:
      return null;
  }
};
