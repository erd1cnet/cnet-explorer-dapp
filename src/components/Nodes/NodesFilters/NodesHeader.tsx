import classNames from 'classnames';

import { TableSearch } from 'components';
import { useGetNodeFilters, useGetSearch } from 'hooks';
import { WithClassnameType } from 'types';

export interface NodesHeaderUIType extends WithClassnameType {
  searchValue?: string | number;
}

export const NodesHeader = ({ searchValue, className }: NodesHeaderUIType) => {
  const nodeFilters = useGetNodeFilters();
  const { search } = useGetSearch();
  const { status, type } = nodeFilters;

  const getNodesFilterTitle = () => {
    if (type === 'validator') {
      return 'Validating Nodes';
    }
    if (type === 'observer') {
      return 'Observers';
    }
    if (status === 'auction') {
      return 'Auction List';
    }
    if (status === 'queued') {
      return 'Queued Nodes';
    }
    if (Object.keys(nodeFilters).length === 0 && !search) {
      return 'All Nodes';
    }
    return 'Nodes';
  };

  const filterTitle = getNodesFilterTitle();

  return (
    <div
      className={classNames(
        'nodes-search d-flex flex-wrap align-items-center justify-content-between gap-3 w-100',
        className
      )}
    >
      {filterTitle && (
        <h3 className='mb-0' data-testid='title'>
          {filterTitle}
        </h3>
      )}
      <TableSearch searchValue={searchValue} placeholderText='node' />
    </div>
  );
};
