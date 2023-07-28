export interface VerifiedContractType {
  codeHash: string;

  source: {
    abi: ContractAbiType;
    contract: ContractType;
  };
  status: string;
  ipfsFileHash: string;
  dockerImage: string;
}

export interface ContractAbiType {
  name: string;
  buildInfo: {
    contractCrate: {
      name: string;
      version: string;
    };
    framework: {
      name: string;
      version: string;
    };
    rustc: {
      channel: string;
      commitDate: string;
      commitHash: string;
      short: string;
      version: string;
    };
  };
  hasCallback: boolean;
  types: ContractTypesType;
  endpoints?: ContractEndpointType[];
  events?: ContractEventType[];
  ['constructor']?: ContractConstructorType;
}

export interface ContractType {
  entries: ContractEntryType[];
  name: string;
  version: string;
}

export interface ContractEntryType {
  content: string;
  path: string;
  module: string;
  dependencyDepth: number;
  isTestFile: boolean;
}

export interface ContractEndpointType {
  name: string;
  mutability?: string;
  onlyOwner?: boolean;
  docs?: string[];
  inputs?: ContractEndpointInputType[];
  outputs?: ContractOutputType[];
  payableInTokens?: string[];
}

export interface ContractEndpointInputType {
  name: string;
  type: string;
  multi_arg?: boolean;
}

export interface ContractEventType {
  identifier: string;
  inputs: ContractInputType[];
  outputs?: ContractOutputType[];
}

export interface ContractOutputType {
  type: string;
}

export interface ContractInputType {
  name: string;
  type: string;
  indexed?: boolean;
}

export interface ContractTypesType {
  [key: string]: ContractTypeType;
}
export interface ContractTypeType {
  type: string;
  fields: {
    name: string;
    type: string;
  }[];
  variants: {
    name: string;
    discriminant: string | number;
  }[];
}

export interface ContractConstructorType {
  docs: string[];
  inputs: ContractInputType[];
  outputs: ContractOutputType[];
}
