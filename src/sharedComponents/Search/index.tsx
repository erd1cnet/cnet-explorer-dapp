import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useGlobalState } from '../../context';
import { testnetRoute } from '../../helpers';
import { isAddress, isBlock, isTransaction } from './helpers/asyncRequests';

const Search: React.FC = () => {
  const {
    activeTestnet: { elasticUrl, nodeUrl },
    activeTestnetId,
    timeout,
  } = useGlobalState();
  const history = useHistory();
  const [hash, setHash] = React.useState<string>('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onClick();
    }
  };
  const onClick = async () => {
    if (await isBlock({ elasticUrl, hash, timeout })) {
      history.push(testnetRoute({ to: `/blocks/${hash}`, activeTestnetId }));
    } else if (await isTransaction({ elasticUrl, hash, timeout })) {
      history.push(testnetRoute({ to: `/transactions/${hash}`, activeTestnetId }));
    } else if (await isAddress({ nodeUrl, hash, timeout })) {
      history.push(testnetRoute({ to: `/address/${hash}`, activeTestnetId }));
    } else {
      history.push(testnetRoute({ to: `/search/${hash}`, activeTestnetId }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setHash(e.target.value);

  return (
    <>
      <input
        type="text"
        className="form-control mr-sm-2"
        placeholder="Address / Txn Hash / Block Hash"
        name="requestType"
        required
        value={hash}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <div className="input-group-append">
        <button type="submit" className="input-group-text" onClick={onClick}>
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>
    </>
  );
};

export default Search;
