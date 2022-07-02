/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../common";
import type { Oracle, OracleInterface } from "../Oracle";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "blockNumber",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "coinbase",
        type: "address",
      },
    ],
    name: "StoreBlock",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    name: "didSaveBlock",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "txHash",
        type: "bytes32",
      },
    ],
    name: "getTxInfo",
    outputs: [
      {
        components: [
          {
            internalType: "bool",
            name: "didRevert",
            type: "bool",
          },
          {
            internalType: "uint64",
            name: "blockNumber",
            type: "uint64",
          },
          {
            internalType: "address",
            name: "coinbase",
            type: "address",
          },
        ],
        internalType: "struct IOracle.TxHashInfo",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32[]",
        name: "txHashes",
        type: "bytes32[]",
      },
      {
        internalType: "bool[]",
        name: "didRevert",
        type: "bool[]",
      },
      {
        internalType: "uint32",
        name: "blockNumber",
        type: "uint32",
      },
      {
        internalType: "address",
        name: "coinbase",
        type: "address",
      },
    ],
    name: "storeBlock",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "txInfos",
    outputs: [
      {
        internalType: "bool",
        name: "didRevert",
        type: "bool",
      },
      {
        internalType: "uint64",
        name: "blockNumber",
        type: "uint64",
      },
      {
        internalType: "address",
        name: "coinbase",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506106c6806100206000396000f3fe608060405234801561001057600080fd5b506004361061004c5760003560e01c8063378a072b14610051578063b2e7f72614610089578063b9bc5237146100fd578063cdaa700014610147575b600080fd5b61007461005f366004610442565b60016020526000908152604090205460ff1681565b60405190151581526020015b60405180910390f35b6100ce610097366004610464565b60006020819052908152604090205460ff811690610100810467ffffffffffffffff1690600160481b90046001600160a01b031683565b60408051931515845267ffffffffffffffff90921660208401526001600160a01b031690820152606001610080565b61011061010b366004610464565b61015c565b6040805182511515815260208084015167ffffffffffffffff1690820152918101516001600160a01b031690820152606001610080565b61015a610155366004610579565b61020c565b005b60408051606081018252600080825260208201819052918101919091526000828152602081815260408083208151606081018352905460ff811615158252610100810467ffffffffffffffff16938201849052600160481b90046001600160a01b03169181019190915291036102065760405162461bcd60e51b815260206004820152600a6024820152694e6f20747820696e666f60b01b60448201526064015b60405180910390fd5b92915050565b82518451146102545760405162461bcd60e51b8152602060048201526014602482015273496e636f6e73697374656e74206c656e6774687360601b60448201526064016101fd565b438263ffffffff16106102a95760405162461bcd60e51b815260206004820152601760248201527f496e76616c696420696e666f3a2066757475726520626e00000000000000000060448201526064016101fd565b63ffffffff821660009081526001602052604090205460ff16156103055760405162461bcd60e51b8152602060048201526013602482015272616c726561647920736176656420626c6f636b60681b60448201526064016101fd565b60005b84518110156103ce57600080600087848151811061032857610328610653565b60200260200101518152602001908152602001600020905084828151811061035257610352610653565b6020908102919091010151815468ffffffffffffffffff191690151568ffffffffffffffff0019161761010063ffffffff861602177fffffff0000000000000000000000000000000000000000ffffffffffffffffff16600160481b6001600160a01b03851602179055806103c681610669565b915050610308565b5063ffffffff82166000818152600160208190526040808320805460ff1916909217909155516001600160a01b03841692917fa2954f4c5c0c7ccbb88fef9e7e8c64ad73d3683969a6712ec797f5266b7a7ef091a350505050565b803563ffffffff8116811461043d57600080fd5b919050565b60006020828403121561045457600080fd5b61045d82610429565b9392505050565b60006020828403121561047657600080fd5b5035919050565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f1916810167ffffffffffffffff811182821017156104bc576104bc61047d565b604052919050565b600067ffffffffffffffff8211156104de576104de61047d565b5060051b60200190565b600082601f8301126104f957600080fd5b8135602061050e610509836104c4565b610493565b82815260059290921b8401810191818101908684111561052d57600080fd5b8286015b84811015610557578035801515811461054a5760008081fd5b8352918301918301610531565b509695505050505050565b80356001600160a01b038116811461043d57600080fd5b6000806000806080858703121561058f57600080fd5b843567ffffffffffffffff808211156105a757600080fd5b818701915087601f8301126105bb57600080fd5b813560206105cb610509836104c4565b82815260059290921b8401810191818101908b8411156105ea57600080fd5b948201945b83861015610608578535825294820194908201906105ef565b9850508801359250508082111561061e57600080fd5b5061062b878288016104e8565b93505061063a60408601610429565b915061064860608601610562565b905092959194509250565b634e487b7160e01b600052603260045260246000fd5b60006001820161068957634e487b7160e01b600052601160045260246000fd5b506001019056fea2646970667358221220d1e470e5b3cb056fda471a930128222068bf8949755fe5010e6a757082f68d0964736f6c634300080f0033";

type OracleConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: OracleConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Oracle__factory extends ContractFactory {
  constructor(...args: OracleConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<Oracle> {
    return super.deploy(overrides || {}) as Promise<Oracle>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): Oracle {
    return super.attach(address) as Oracle;
  }
  override connect(signer: Signer): Oracle__factory {
    return super.connect(signer) as Oracle__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): OracleInterface {
    return new utils.Interface(_abi) as OracleInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Oracle {
    return new Contract(address, _abi, signerOrProvider) as Oracle;
  }
}
