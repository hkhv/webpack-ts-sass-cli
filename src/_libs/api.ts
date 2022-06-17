import { CHAINS } from './chains'

export const O3_HOST = 'https://hub-v2.o3.network'

export const ETH_RPC_HOST: any = {
    [CHAINS.Ethereum]: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    [CHAINS.BNBChain]: 'https://bsc-dataseed1.ninicoin.io',
    [CHAINS.HECO]: 'https://http-mainnet.hecochain.com',
    [CHAINS.Polygon]: 'https://polygon-rpc.com',
    [CHAINS.Arbitrum]: 'https://arb1.arbitrum.io/rpc',
    [CHAINS.Gnosis]: 'https://rpc.gnosischain.com/',
    [CHAINS.Avalanche]: 'https://api.avax.network/ext/bc/C/rpc',
    [CHAINS.OKC]: 'https://exchainrpc.okex.org',
    [CHAINS.Optimism]: 'https://mainnet.optimism.io',
    [CHAINS.Fantom]: 'https://rpc.ftm.tools',
}

export const DEX_ADD_LIQUIDITY_URL = {
    [CHAINS.Ethereum]: 'https://app.uniswap.org/#/add/v2/',
    [CHAINS.BNBChain]: 'https://pancakeswap.finance/add/',
    [CHAINS.HECO]: 'https://ht.mdex.co/#/add/',
    [CHAINS.Polygon]: 'https://quickswap.exchange/#/add/',
    [CHAINS.Arbitrum]: 'https://app.sushi.com/add/',
    [CHAINS.OKC]: 'https://app.jswap.finance/#/add/',
    [CHAINS.Avalanche]: 'https://traderjoexyz.com/pool/',
    [CHAINS.Fantom]: 'https://spooky.fi/#/add/',
    [CHAINS.Optimism]: 'https://zipswap.fi/#/add/v2/',
    [CHAINS.Gnosis]: 'https://app.sushi.com/legacy/add/',
}

export const O3_AGG_HOST = 'https://agg.o3swap.com'

export const O3_API_HOST = 'https://api.o3swap.com'

//#region swap

export const LOGO_CDN_URL = 'https://cdn.o3.network/token-profile'
//#endregion
