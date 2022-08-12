export enum CHAINS {
    Ethereum = 'Ethereum',
    BNBChain = 'BNB Chain',
    Polygon = 'Polygon',
    Arbitrum = 'Arbitrum',
    Gnosis = 'Gnosis',
    Fantom = 'Fantom',
    Avalanche = 'Avalanche',
    Optimism = 'Optimism',
    Cube = 'Cube',
    Metis = 'Metis',
    Celo = 'Celo',
}

export const CHAIN_ENUM = {
    [CHAINS.Ethereum]: 1,
    [CHAINS.BNBChain]: 56,
    [CHAINS.Polygon]: 137,
    [CHAINS.Arbitrum]: 42161,
    [CHAINS.Gnosis]: 100,
    [CHAINS.Avalanche]: 43114,
    [CHAINS.Optimism]: 10,
    [CHAINS.Fantom]: 250,
    [CHAINS.Cube]: 1818,
    [CHAINS.Metis]: 1088,
    [CHAINS.Celo]: 42220,
}
export const CHAIN_ID_EUNM = {
    [1]: CHAINS.Ethereum,
    [56]: CHAINS.BNBChain,
    [137]: CHAINS.Polygon,
    [42161]: CHAINS.Arbitrum,
    [100]: CHAINS.Gnosis,
    [10]: CHAINS.Optimism,
    [43114]: CHAINS.Avalanche,
    [250]: CHAINS.Fantom,
    [1818]: CHAINS.Cube,
    [1088]: CHAINS.Metis,
    [42220]: CHAINS.Celo,
}

export interface ChainsObject<T> {
    [CHAINS.Ethereum]: T
    [CHAINS.BNBChain]: T
    [CHAINS.Polygon]: T
    [CHAINS.Arbitrum]: T
    [CHAINS.Gnosis]: T
    [CHAINS.Fantom]: T
    [CHAINS.Avalanche]: T
    [CHAINS.Optimism]: T
    [CHAINS.Cube]: T
    [CHAINS.Metis]: T
    [CHAINS.Celo]: T
}

export const CHAIN_LIST: CHAINS[] = Object.values(CHAINS)

export const EVM_CHAIN_LIST = CHAIN_LIST
