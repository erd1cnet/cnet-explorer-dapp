import { faCode } from '@fortawesome/pro-regular-svg-icons/faCode';
import { faUser } from '@fortawesome/pro-regular-svg-icons/faUser';
import * as React from 'react';
import { SC_INIT_CHARACTERS_LENGTH } from 'appConstants';
import { PageState } from 'components';

export const FailedAccount = ({ address }: { address: string | undefined }) => {
  const showIcon =
    SC_INIT_CHARACTERS_LENGTH > 0 &&
    String(address).startsWith('0'.repeat(SC_INIT_CHARACTERS_LENGTH));

  return (
    <PageState
      icon={showIcon ? faCode : faUser}
      title="Unable to locate this account"
      description={
        <div className="px-spacer">
          <span className="text-break-all">{address}</span>
        </div>
      }
      className="py-spacer my-auto"
      dataTestId="errorScreen"
    />
  );
};
