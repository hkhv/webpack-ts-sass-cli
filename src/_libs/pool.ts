import { DAI_POOL_NAME, ETH_POOL_NAME, FTM_POOL_NAME, MATIC_POOL_NAME, USDC_POOL_NAME, USDT_POOL_NAME } from './app'
import { CHAINS } from './chains'
import { Token } from './token'

export interface PoolSwapParams {
    fromToken: Token
    toToken: Token
    inputAmount: string
    receiveAmount: string
    fromAddress: string
}
export interface PoolLiquidityParams {
    address: string
    token: Token
    pToken: Token
    LPToken: Token
    inputAmount: string
    inputPAmount: string
    receiveAmount: string
    receivePAmount?: string
}

export interface Pool {
    name: string
    chains: CHAINS[]
    logo: string
    isShow?: boolean
    stakedChain?: CHAINS[]
    tvl?: string
    swap_vol_total?: string
}

export const DEPOSIT_ENTRANCE_CHAIN: any = {
    [DAI_POOL_NAME]: CHAINS.Ethereum,
    [ETH_POOL_NAME]: CHAINS.Ethereum,
    [FTM_POOL_NAME]: CHAINS.Fantom,
    [USDC_POOL_NAME]: CHAINS.Ethereum,
    [USDT_POOL_NAME]: CHAINS.Ethereum,
    [MATIC_POOL_NAME]: CHAINS.Polygon,
}

//#region pool list
export const POOL_LIST: Pool[] = [
    {
        name: USDT_POOL_NAME,
        chains: [CHAINS.Ethereum, CHAINS.BNBChain, CHAINS.Arbitrum, CHAINS.Polygon],
        logo: '',
    },
    {
        name: USDC_POOL_NAME,
        chains: [CHAINS.Ethereum, CHAINS.BNBChain, CHAINS.Polygon, CHAINS.Arbitrum, CHAINS.Fantom, CHAINS.Gnosis, CHAINS.Optimism],
        logo: '',
    },
    {
        name: ETH_POOL_NAME,
        chains: [CHAINS.Ethereum, CHAINS.BNBChain, CHAINS.Polygon, CHAINS.Arbitrum, CHAINS.Fantom, CHAINS.Gnosis, CHAINS.Optimism],
        logo: '',
    },
    {
        name: MATIC_POOL_NAME,
        chains: [CHAINS.Ethereum, CHAINS.Polygon],
        logo: '',
    },
    {
        name: FTM_POOL_NAME,
        chains: [CHAINS.Ethereum, CHAINS.Fantom],
        logo: '',
    },
    {
        name: DAI_POOL_NAME,
        chains: [CHAINS.Ethereum, CHAINS.Polygon, CHAINS.Arbitrum, CHAINS.Fantom, CHAINS.Gnosis, CHAINS.Optimism],
        logo: '',
    },
]
//#endregion
