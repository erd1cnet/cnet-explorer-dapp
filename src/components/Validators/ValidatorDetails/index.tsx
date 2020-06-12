import { faCogs, faCube } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useParams } from 'react-router-dom';
import * as React from 'react';
import { useGlobalState } from 'context';
import { BlocksTable, Loader } from 'sharedComponents';
import { ValidatorType } from 'context/validators';
import { getValidator, searchBlocks, getHistoricRatings } from './helpers/asyncRequests';
import { validatorFunctions } from 'helpers';
import NetworkMetrics, { NetworkMetricsType } from './NetworkMetrics';
import NodeInformation, { NodeInformationType } from './NodeInformation';
import Rounds from './Rounds';
import RatingsChart, { HistoricRatingType } from './RatingsChart';
import BrandInformation from './BrandInformation';
import Alert from './Alert';
import useSetValidatorsData from './../useSetValidatorsData';

export type StateType = NetworkMetricsType &
  NodeInformationType & {
    shardId: string;
    startBlockNr: number;
    endBlockNr: number;
    signersIndex: number;
    success: boolean;
    rating: number;
    ratingModifier: number;
    historicRatings: HistoricRatingType[];
  };

export const initialState: StateType = {
  shardId: '0',
  publicKey: '',
  shardNumber: 0,
  versionNumber: '0',
  isActive: false,
  nodeDisplayName: '0',
  isValidator: false,
  publicKeyBlockSign: '0',
  totalDownTimePercentege: 0,
  totalUpTimePercentege: 0,
  totalUpTimeLabel: '',
  totalDownTimeLabel: '',
  instanceType: '0',
  startBlockNr: 0,
  endBlockNr: 0,
  signersIndex: -1,
  success: true,
  rating: 0,
  ratingModifier: 0,
  historicRatings: [],
};

const ValidatorDetails = () => {
  const ref = React.useRef(null);
  const { hash } = useParams();
  const [validator, setValidator] = React.useState<ValidatorType>();
  const [dataFetched] = React.useState(useSetValidatorsData(ref));
  const [state, setState] = React.useState(initialState);
  const [fetchedBlocks, setFetchedBlocks] = React.useState({
    blocks: [],
    startBlockNr: 0,
    endBlockNr: 0,
    blocksFetched: true,
  });
  const [rounds, setRounds] = React.useState<validatorFunctions.GetRoundsReturnType>({
    rounds: [],
    roundsFetched: true,
  });

  const {
    activeTestnet: { elasticUrl, nodeUrl },
    config: { metaChainShardId, explorerApi },
    timeout,
    validatorData,
  } = useGlobalState();

  React.useEffect(() => {
    if (hash) {
      const foundValidator = validatorData.validatorsAndObservers.find(v => v.publicKey === hash);
      if (foundValidator === undefined && validatorData.validatorsAndObservers.length > 0) {
        setSuccess(false);
      } else {
        setValidator(foundValidator);
      }
    }
  }, [hash, validatorData, dataFetched]);

  const [success, setSuccess] = React.useState(true);

  React.useEffect(() => {
    if (ref.current !== null && validator !== undefined && validator.peerType !== 'observer') {
      getValidator({
        currentValidator: validator,
        elasticUrl,
        timeout: Math.max(timeout, 10000),
        publicKey: validator.publicKey,
        nodeUrl,
        explorerApi,
      }).then(({ signersIndex, shardNumber, epoch, roundAtEpochStart, success, ...data }: any) => {
        if (ref.current !== null) {
          setState({ ...data, shardNumber, rating: validator!.rating });
          setSuccess(success);
          const props = {
            elasticUrl,
            timeout: Math.max(timeout, 10000),
            shardNumber,
            signersIndex,
            epoch,
            roundAtEpochStart,
          };

          getHistoricRatings({ explorerApi, timeout, publicKey: validator.publicKey }).then(
            (historicRatings: HistoricRatingType[]) => {
              setState(state => ({ ...state, historicRatings }));
            }
          );

          validatorFunctions.getRounds(props).then(({ rounds, roundsFetched }) => {
            if (ref.current !== null) {
              setRounds({ rounds, roundsFetched });
            }
          });

          searchBlocks(props).then((blockdata: any) => {
            if (ref.current !== null) {
              setFetchedBlocks(blockdata);
            }
          });
        }
      });
    }
  }, [elasticUrl, timeout, nodeUrl, metaChainShardId, validator, explorerApi]); // run the operation only once since the parameter does not change

  const { publicKey, isValidator } = state;

  const networkMetricsClass = isValidator ? 'col-md-4' : 'col-8';

  const nodeClass = 'col-md-8';
  const brandClass = 'col-md-4';

  const isWaiting = state.instanceType.includes('waiting');

  return (
    <div ref={ref}>
      <div className="container pt-3 pb-3">
        <div className="row">
          <div className={success ? nodeClass : 'col-12'}>
            <h4 data-testid="title">Node Information</h4>
          </div>
          {publicKey !== '' && (
            <div className={brandClass}>
              <h4 className="d-sm-none d-lg-block">&nbsp;</h4>
            </div>
          )}
        </div>
        {validator !== undefined && <Alert validator={validator} />}
        {success ? (
          <>
            {publicKey !== '' ? (
              <>
                <div className="row">
                  <div className={nodeClass}>
                    <NodeInformation {...state} />
                  </div>
                  <div className={brandClass}>
                    <BrandInformation publicKey={state.publicKey} />
                  </div>
                </div>
                <div className="row">
                  <div className={networkMetricsClass}>
                    <NetworkMetrics {...state} />
                  </div>
                  <div className="col-md-4">
                    <RatingsChart historicRatings={state.historicRatings} />
                  </div>
                  {isValidator && (
                    <div className="col-md-4">
                      <Rounds {...rounds} isWaiting={isWaiting} />
                    </div>
                  )}
                </div>
                {isValidator && (
                  <>
                    <div className="row">
                      <div className="col-12 mt-4">
                        <h4>Proposed Blocks in Current Epoch</h4>
                      </div>
                    </div>
                    {fetchedBlocks.blocksFetched ? (
                      <>
                        {fetchedBlocks.blocks.length > 0 ? (
                          <div className="row">
                            <div className="col-12">
                              <div className="card">
                                <div className="card-body">
                                  Last {fetchedBlocks.blocks.length} proposed blocks
                                  <BlocksTable blocks={fetchedBlocks.blocks} shardId={undefined} />
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <Loader />
                        )}
                      </>
                    ) : (
                      <div className="row">
                        <div className="col-12">
                          <div className="card">
                            <div className="card-body card-details" data-testid="errorScreen">
                              <div className="empty">
                                <FontAwesomeIcon icon={faCube} className="empty-icon" />
                                <span className="h4 empty-heading">
                                  {isWaiting ? 'Validator not in consensus' : 'No blocks found'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            ) : (
              <Loader />
            )}
          </>
        ) : (
          <div className="card">
            <div className="card-body card-details" data-testid="errorScreen">
              <div className="empty">
                <FontAwesomeIcon icon={faCogs} className="empty-icon" />
                <span className="h4 empty-heading">Unable to locate this node</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ValidatorDetails;
