import {
    SubstrateDatasourceKind,
    SubstrateHandlerKind,
    SubstrateProject,
  } from "@subql/types";
import { FrontierEvmDatasource } from "@subql/frontier-evm-processor";
import { EthereumHandlerKind } from "@subql/types-ethereum";
  
  // Can expand the Datasource processor types via the genreic param
  const project: SubstrateProject<FrontierEvmDatasource> = {
    specVersion: "1.0.0",
    version: "0.0.1",
    name: "harmonie-starter",
    description:
      "This project can be used as a starting point for developing your SubQuery project",
    runner: {
      node: {
        name: "@subql/node",
        version: ">=3.0.1",
      },
      query: {
        name: "@subql/query",
        version: "*",
      },
    },
    schema: {
      file: "./schema.graphql",
    },
    network: {
      /* The genesis hash of the network (hash of block 0) */
      chainId:
        "0x7e18728b3f890088891d03dd5b30db9f1a0e62e05bc30eb4cf53f3c4a8280d76",
      /**
       * This endpoint must be a public non-pruned archive node
       * Public nodes may be rate limited, which can affect indexing speed
       * When developing your project we suggest getting a private API key
       */
      endpoint: "https://harmonie-endpoint-01.allfeat.io",
      dictionary: "https://subq-dictionary.allfeat.io"
    },
    dataSources: [
      {
        kind: SubstrateDatasourceKind.Runtime,
        startBlock: 1449160,
        mapping: {
          file: "./dist/index.js",
          handlers: [
            {
              kind: SubstrateHandlerKind.Event,
              handler: "handleEvent",
              filter: {
                module: "balances",
                method: "Transfer",
              }
            },
          ],
        },
      },
      {
        kind: "substrate/FrontierEvm",
        startBlock: 1796813,
        processor: {
          file: "./node_modules/@subql/frontier-evm-processor/dist/bundle.js",
          options: {
            abi: "pass",
            address: "0x13ed4442474DeFA11aa97A35a8B699228D1C5de2",
          },
        },
        assets: new Map([["pass", { file: "./abis/pass.abi.json" }]]),
        mapping: {
          file: "./dist/index.js",
          handlers: [
            {
              kind: "substrate/FrontierEvmEvent",
              handler: "handleMintEvent",
              filter: {
                topics: [
                  "Minted(address indexed to,uint256 indexed tokenId)",
                ]
              }
            },
          ],
        },
      }
    ],
  };
  
  // Must set default to the project instance
  export default project;