import { SVGProps } from 'react';
import { useSelector } from 'react-redux';

import { ReactComponent as EgldSymbol } from 'assets/img/tokens/egld-symbol.svg';
import { ReactComponent as CnetLogo } from 'assets/img/tokens/cnet-logo.svg';
import { isEgldToken } from 'helpers';
import { activeNetworkSelector } from 'redux/selectors';

// temporary?
export const NativeTokenSymbol = (props: SVGProps<SVGSVGElement>) => {
  const { egldLabel } = useSelector(activeNetworkSelector);

  if (isEgldToken(egldLabel)) {
    return <EgldSymbol {...props} />;
  }

  switch (egldLabel?.toLowerCase()) {
    case 'xcnet':
      return <CnetLogo {...props} />;
    default:
      return null;
  }
};
