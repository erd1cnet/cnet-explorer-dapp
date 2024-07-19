import { SVGProps } from 'react';
import { useSelector } from 'react-redux';

import { ReactComponent as CnetLogo } from 'assets/img/tokens/cnet-logo.svg';
import { ReactComponent as EgldLogo } from 'assets/img/tokens/egld-logo.svg';
import { isEgldToken } from 'helpers';
import { activeNetworkSelector } from 'redux/selectors';

// temporary?
export const NativeTokenLogo = (props: SVGProps<SVGSVGElement>) => {
  const { egldLabel } = useSelector(activeNetworkSelector);

  if (isEgldToken(egldLabel)) {
    return <EgldLogo {...props} />;
  }

  switch (egldLabel?.toLowerCase()) {
    case 'xcnet':
      return <CnetLogo {...props} />;
    default:
      return null;
  }
};
