import React from 'react';
import moment from 'moment';
import { useGlobalState } from 'context';
import { defaultTestnet } from 'context/config';
import DefaultHighlights from './DefaultHighlights';
import { getStats } from './helpers/asyncRequests';
import HeroHighlights from './HeroHighlights';

export interface StateType {
  blockNumber: string;
  nrOfNodes: string;
  nrOfShards: string;
  roundNumber: string;
  liveTPS: string;
  peakTPS: string;
  totalProcessedTxCount: string;
  epochPercentage: number;
  epochTotalTime: string;
  epochTimeElapsed: string;
  epochTimeRemaining: string;
  epoch: string;
}

const initialState = {
  blockNumber: '...',
  nrOfNodes: '...',
  nrOfShards: '...',
  roundNumber: '...',
  liveTPS: '...',
  peakTPS: '...',
  totalProcessedTxCount: '...',
  epochPercentage: 0,
  epoch: '...',
  epochTotalTime: '...',
  epochTimeElapsed: '...',
  epochTimeRemaining: '',
};

const Hightlights = ({
  hero = false,
  setLiveTps = () => {
    return;
  },
}: {
  hero?: boolean;
  setLiveTps?: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const {
    activeTestnet: { elasticUrl, nodeUrl, refreshRate },
    activeTestnetId,
    config: { metaChainShardId },
    cancelToken,
    timeout,
    refresh: { timestamp },
  } = useGlobalState();

  const [state, setState] = React.useState({
    [activeTestnetId]: initialState,
  });
  const [oldTestnetId, setOldTestnetId] = React.useState<string>('');
  const ref = React.useRef(null);

  React.useEffect(() => {
    setOldTestnetId(activeTestnetId);
  }, [activeTestnetId]);

  const getHighlights = () => {
    if (ref.current !== null && activeTestnetId !== defaultTestnet.id) {
      getStats({
        elasticUrl,
        nodeUrl,
        metaChainShardId,
        timeout,
        cancelToken,
      }).then(({ data, success }) => {
        const check = data.roundsPerEpoch >= data.roundsPassed;
        const newState = success
          ? {
              blockNumber: data.blockCount
                ? parseInt(data.blockCount).toLocaleString('en')
                : parseInt(data.blockNumber).toLocaleString('en'),
              nrOfNodes: parseInt(data.nrOfNodes).toLocaleString('en'),
              nrOfShards: parseInt(data.nrOfShards).toLocaleString('en'),
              roundNumber: parseInt(data.roundNumber).toLocaleString('en'),
              liveTPS: parseInt(data.liveTPS).toLocaleString('en'),
              peakTPS: parseInt(data.peakTPS).toLocaleString('en'),
              totalProcessedTxCount: parseInt(data.totalProcessedTxCount).toLocaleString('en'),
              epoch: data.epoch.toLocaleString('en'),
              epochPercentage: check ? (100 * data.roundsPassed) / data.roundsPerEpoch : 0,
              epochTotalTime: check
                ? moment.utc(refreshRate * data.roundsPerEpoch).format('HH:mm')
                : '...',
              epochTimeElapsed: check
                ? moment.utc(refreshRate * data.roundsPassed).format('HH:mm')
                : '...',
              epochTimeRemaining: check
                ? moment
                    .utc(refreshRate * (data.roundsPerEpoch - data.roundsPassed))
                    .format('HH:mm')
                : '...',
            }
          : initialState;

        if (ref.current !== null) {
          const sameTestnet = oldTestnetId === activeTestnetId;
          if (success || (!success && !sameTestnet)) {
            setLiveTps(data.liveTPS);
            setState((state) => ({
              ...state,
              [activeTestnetId]: newState,
            }));
          }
        }
      });
    }
  };

  React.useEffect(getHighlights, [timestamp]); // run the operation only once since the parameter does not change

  const props = activeTestnetId in state ? state[activeTestnetId] : initialState;

  return (
    <div ref={ref}>{!hero ? <DefaultHighlights {...props} /> : <HeroHighlights {...props} />}</div>
  );
};

export default Hightlights;
