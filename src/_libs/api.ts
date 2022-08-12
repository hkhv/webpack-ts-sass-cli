import { CHAINS } from './chains'

export const O3_HOST = 'https://hub-v2.o3.network'

export const ETH_RPC_HOST: any = {
    [CHAINS.Ethereum]: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    [CHAINS.BNBChain]: 'https://bsc-dataseed1.ninicoin.io',
    [CHAINS.Polygon]: 'https://polygon-rpc.com',
    [CHAINS.Arbitrum]: 'https://arb1.arbitrum.io/rpc',
    [CHAINS.Gnosis]: 'https://rpc.gnosischain.com',
    [CHAINS.Avalanche]: 'https://api.avax.network/ext/bc/C/rpc',
    [CHAINS.Optimism]: 'https://mainnet.optimism.io',
    [CHAINS.Fantom]: 'https://rpc.fantom.network',
    [CHAINS.Cube]: 'https://http-mainnet.cube.network',
    [CHAINS.Metis]: 'https://andromeda.metis.io',
    [CHAINS.Celo]: 'https://forno.celo.org',
}
