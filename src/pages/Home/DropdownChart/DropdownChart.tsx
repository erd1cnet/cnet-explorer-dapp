import React from 'react';
import Select, { components } from 'react-select';
import classNames from 'classnames';

import type { DropdownChartPropsType } from './types';

import styles from './styles.module.scss';

const Control: typeof components.Control = (props) => (
  <components.Control
    {...props}
    className={classNames(styles.control, {
      [styles.expanded]: props.selectProps.menuIsOpen
    })}
  />
);

const ValueContainer: typeof components.ValueContainer = (props) => (
  <components.ValueContainer {...props} className={styles.value} />
);

const SingleValue: typeof components.SingleValue = (props) => (
  <components.SingleValue {...props} className={styles.single} />
);

const Menu: typeof components.Menu = (props) => (
  <components.Menu {...props} className={styles.menu} />
);

const MenuList: typeof components.MenuList = (props) => (
  <components.MenuList {...props} className={styles.list} />
);

const Option: typeof components.Option = (props) => (
  <components.Option
    {...props}
    className={classNames(styles.option, {
      [styles.selected]: props.isSelected || props.isFocused
    })}
  />
);

const IndicatorsContainer: typeof components.IndicatorsContainer = (props) => (
  <components.IndicatorsContainer
    {...props}
    className={classNames(styles.indicator, {
      [styles.expanded]: props.selectProps.menuIsOpen
    })}
  />
);

export const DropdownChart = (props: DropdownChartPropsType) => (
  <Select
    {...props}
    className={styles.dropdown}
    isMulti={false}
    isSearchable={false}
    components={{
      Menu,
      MenuList,
      Control,
      Option,
      ValueContainer,
      SingleValue,
      IndicatorsContainer,
      IndicatorSeparator: null
    }}
  />
);
