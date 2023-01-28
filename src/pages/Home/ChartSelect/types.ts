import type { SingleValue } from 'react-select';

export interface ChartSelectOptionType {
  label: string;
  value: string;
}

export interface ChartSelectPropsType {
  options: ChartSelectOptionType[];
  onChange: (option: SingleValue<ChartSelectOptionType>) => void;
}
