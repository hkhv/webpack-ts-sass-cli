import { CHAINS } from './chains'
import { Token } from './token'

export const USDT_POOL_NAME = 'USDT Pool'
export const ETH_POOL_NAME = 'ETH Pool'
export const MATIC_POOL_NAME = 'MATIC Pool'
export const FTM_POOL_NAME = 'FTM Pool'
export const DAI_POOL_NAME = 'DAI Pool'
export const USDC_POOL_NAME = 'USDC Pool'
export const BTC_POOL_NAME = 'BTC Pool'
export const CUBE_POOL_NAME = 'Cube Pool'
export const O3_POOL_NAME = 'O3 Pool'
export const ATA_POOL_NAME = 'ATA Pool'
export const RACA_POOL_NAME = 'RACA Pool'
export const ROOBEE_POOL_NAME = 'ROOBEE Pool'
export const WING_POOL_NAME = 'WING Pool'
export const AVAX_POOL_NAME = 'AVAX Pool'
export const METIS_POOL_NAME = 'Metis Pool'

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
    isShow?: boolean
    stakedChain?: CHAINS[]
    tvl?: string
    swap_vol_total?: string
    heighestAPR?: string
}

export const DEPOSIT_ENTRANCE_CHAIN: any = {
    [DAI_POOL_NAME]: CHAINS.Ethereum,
    [ETH_POOL_NAME]: CHAINS.Ethereum,
    [FTM_POOL_NAME]: CHAINS.Fantom,
    [USDC_POOL_NAME]: CHAINS.Ethereum,
    [USDT_POOL_NAME]: CHAINS.Ethereum,
    [MATIC_POOL_NAME]: CHAINS.Polygon,
    [BTC_POOL_NAME]: CHAINS.Ethereum,
    [CUBE_POOL_NAME]: CHAINS.Cube,
    [O3_POOL_NAME]: CHAINS.Ethereum,
    [ATA_POOL_NAME]: CHAINS.BNBChain,
    [RACA_POOL_NAME]: CHAINS.BNBChain,
    [ROOBEE_POOL_NAME]: CHAINS.Ethereum,
    [WING_POOL_NAME]: CHAINS.BNBChain,
    [AVAX_POOL_NAME]: CHAINS.Avalanche,
    [METIS_POOL_NAME]: CHAINS.Metis,
}

//#region pool list
export const POOL_LIST: Pool[] = [
    {
        name: USDT_POOL_NAME,
        chains: [CHAINS.Ethereum, CHAINS.BNBChain, CHAINS.Arbitrum, CHAINS.Polygon, CHAINS.Cube, CHAINS.Metis],
    },
    {
        name: USDC_POOL_NAME,
        chains: [
            CHAINS.Ethereum,
            CHAINS.BNBChain,
            CHAINS.Polygon,
            CHAINS.Arbitrum,
            CHAINS.Fantom,
            CHAINS.Gnosis,
            CHAINS.Optimism,
            CHAINS.Cube,
            CHAINS.Avalanche,
            CHAINS.Metis,
            CHAINS.Celo,
        ],
    },
    {
        name: BTC_POOL_NAME,
        chains: [CHAINS.Ethereum, CHAINS.BNBChain, CHAINS.Arbitrum, CHAINS.Cube, CHAINS.Avalanche],
    },
    {
        name: ETH_POOL_NAME,
        chains: [
            CHAINS.Ethereum,
            CHAINS.BNBChain,
            CHAINS.Polygon,
            CHAINS.Arbitrum,
            CHAINS.Fantom,
            CHAINS.Gnosis,
            CHAINS.Optimism,
            CHAINS.Cube,
            CHAINS.Avalanche,
            CHAINS.Metis,
        ],
    },
    {
        name: O3_POOL_NAME,
        chains: [
            CHAINS.Ethereum,
            CHAINS.BNBChain,
            CHAINS.Polygon,
            CHAINS.Arbitrum,
            CHAINS.Fantom,
            CHAINS.Optimism,
            CHAINS.Cube,
            CHAINS.Avalanche,
            CHAINS.Metis,
            CHAINS.Celo,
        ],
    },
]
//#endregion
