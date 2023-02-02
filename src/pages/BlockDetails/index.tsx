import React, { useEffect, useRef, useState } from 'react';
import { faCube } from '@fortawesome/pro-regular-svg-icons/faCube';
import { useNavigate, useParams } from 'react-router-dom';

import { Loader, PageState } from 'components';
import { isHash } from 'helpers';
import { useAdapter, useNetworkRoute } from 'hooks';

import { BlockData, BlockDataType } from './BlockData';

export const BlockDetails = () => {
  const ref = useRef(null);
  const navigate = useNavigate();
  const networkRoute = useNetworkRoute();
  const { getBlock } = useAdapter();
  const { hash: blockId } = useParams() as any;

  const [state, setState] = useState<BlockDataType>();
  const [dataReady, setDataReady] = useState<boolean | undefined>();

  const invalid = blockId && !isHash(blockId);

  const fetchBlock = () => {
    if (!invalid) {
      getBlock(blockId).then(({ success, block, nextHash }) => {
        if (ref.current !== null) {
          setState({ block, nextHash });
          setDataReady(success);
        }
      });
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(fetchBlock, [blockId]); // run the operation only once since the parameter does not change

  return invalid ? (
    navigate(networkRoute('/not-found'))
  ) : (
    <>
      {dataReady === undefined && <Loader />}

      {dataReady === false && (
        <PageState
          icon={faCube}
          title='Unable to locate this block hash'
          description={
            <div className='px-spacer'>
              <span className='text-break-all'>{blockId}</span>
            </div>
          }
          className='py-spacer my-auto'
          dataTestId='errorScreen'
        />
      )}

      <div className='block-details' ref={ref}>
        {dataReady === true && state && state.block.hash && (
          <div className='container page-content'>
            <div className='row'>
              <div className='col-12'>
                <BlockData {...state} />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
