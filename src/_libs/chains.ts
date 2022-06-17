export type CHAINTYPE = 'EVM'

export enum CHAINS {
    Ethereum = 'Ethereum',
    BNBChain = 'BNB Chain',
    Polygon = 'Polygon',
    Arbitrum = 'Arbitrum',
    Gnosis = 'Gnosis',
    Fantom = 'Fantom',
    Avalanche = 'Avalanche',
    OKC = 'OKC',
    Optimism = 'Optimism',
    HECO = 'HECO',
}

export const DISABLE_CHAIN = [CHAINS.Avalanche, CHAINS.OKC, CHAINS.HECO]

export const CHAIN_ENUM = {
    [CHAINS.Ethereum]: 1,
    [CHAINS.BNBChain]: 56,
    [CHAINS.HECO]: 128,
    [CHAINS.Polygon]: 137,
    [CHAINS.Arbitrum]: 42161,
    [CHAINS.Gnosis]: 100,
    [CHAINS.Avalanche]: 43114,
    [CHAINS.OKC]: 66,
    [CHAINS.Optimism]: 10,
    [CHAINS.Fantom]: 250,
}
export const CHAIN_ID_EUNM = {
    [1]: CHAINS.Ethereum,
    [56]: CHAINS.BNBChain,
    [128]: CHAINS.HECO,
    [137]: CHAINS.Polygon,
    [42161]: CHAINS.Arbitrum,
    [100]: CHAINS.Gnosis,
    [10]: CHAINS.Optimism,
    [43114]: CHAINS.Avalanche,
    [66]: CHAINS.OKC,
    [250]: CHAINS.Fantom,
}

export const CHAIN_LIST: CHAINS[] = Object.values(CHAINS).filter((item) => {
    return !DISABLE_CHAIN.includes(item)
})

export const EVM_CHAIN_LIST = CHAIN_LIST
