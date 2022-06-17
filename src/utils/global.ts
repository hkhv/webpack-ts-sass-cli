import BigNumber from 'bignumber.js'
import { CHAINS, CHAIN_ENUM } from '../_libs/chains'
import { POOL_ADDRESS } from '../_libs/contract'
import { Pool, POOL_LIST } from '../_libs/pool'
import axios from 'axios'
import { Token, POOL_ALL_TOKENS, POOL_CHAIN_TOKENS, POOL_CHAIN_P_TOKENS, ETH_SOURCE_ASSET_HASH } from '../_libs/token'
import { ETH_RPC_HOST } from '../_libs/api'

export function getMinAmountOut(amountOut: string, slipValue: number): string {
    const factPercentage = new BigNumber(1).minus(new BigNumber(slipValue).shiftedBy(-2))
    const factAmount = new BigNumber(amountOut).times(factPercentage).dp(0, BigNumber.ROUND_DOWN).toFixed()
    return factAmount
}

export function add0xHash(hash: string): string {
    if ((hash || '').startsWith('0x')) {
        return hash
    } else {
        return `0x${hash}`
    }
}

export function judgeAssetHash(hash: string, anotherHash: string): boolean {
    return this.remove0xHash(hash).toLowerCase() === this.remove0xHash(anotherHash).toLowerCase()
}

export function getSendTransactionParams(
    from: string | undefined,
    to: string,
    data: string,
    value?: string,
    gas?: string,
    gasPrice?: string
): object {
    if (value && !value.startsWith('0x')) {
        value = '0x' + new BigNumber(value).toString(16)
    }
    to = add0xHash(to)
    return {
        from,
        to,
        value,
        gas,
        gasPrice,
        data,
    }
}

export async function getEthCall(params: any, token: Token, isDefault: boolean = false): Promise<any> {
    const method = 'eth_call'
    return axios
        .post(ETH_RPC_HOST[token.chain], {
            jsonrpc: '2.0',
            id: CHAIN_ENUM[token.chain],
            method,
            params,
        })
        .then((res) => {
            return res
        })
}

//#region pool
export function getPoolAddress(token: Token, chain?: CHAINS): string {
    const poolName = getPoolName(token)
    return POOL_ADDRESS[chain ? chain : token.chain][poolName]
}
export function getPoolAddressByTokenAddress(tokenAddress: string, chain: CHAINS): string {
    const standardToken = POOL_ALL_TOKENS.find(
        (item) => item.assetID.toLowerCase() === tokenAddress.toLocaleLowerCase() && item.chain == chain
    )
    return POOL_ADDRESS[chain][standardToken?.poolName || '']
}

export function getPoolName(token?: Token): string {
    if (token?.poolName) {
        return token.poolName
    }
    if (token) {
        const standardToken = POOL_CHAIN_TOKENS[token?.chain].find(
            (item) => item.assetID.toLowerCase() === token?.assetID.toLocaleLowerCase()
        )
        return standardToken?.poolName || ''
    }
    return ''
}

export function getWrappedToken(token: Token, chain?: CHAINS): Token | undefined {
    if (token.poolName && !chain) {
        return token
    }
    return POOL_CHAIN_TOKENS[chain ? chain : token.chain].find(
        (tokenItem) => (judgeAssetHash(token.assetID, tokenItem.assetID) && !chain) || tokenItem.poolName === token.poolName
    )
}

export function getPoolByToken(token?: Token): Pool | undefined {
    return POOL_LIST.find((item) => item.name === getPoolName(token))
}
export function isSupportChain(poolName: string, chain: CHAINS): boolean {
    return POOL_LIST.find((pool) => pool.name === poolName)?.chains.includes(chain) || false
}

export function getPTokenByToken(token: Token, chain?: CHAINS): Token | undefined {
    const poolName = getPoolName(token)
    return POOL_CHAIN_P_TOKENS[chain ? chain : token?.chain].find((item) => item.poolName === poolName)
}
export function getPTokenByTokenAddress(tokenAddress: string, chain: CHAINS): Token | undefined {
    const standardToken = POOL_CHAIN_TOKENS[chain].find((item) => item.assetID.toLowerCase() === tokenAddress.toLocaleLowerCase())
    return POOL_CHAIN_P_TOKENS[chain].find((item) => item.poolName === standardToken?.poolName)
}
export function isPToken(token: Token): boolean {
    return token.originalHash !== undefined
}
export function getPoolAnotherToken(token: Token): Token | undefined {
    const poolName = getPoolName(token)
    const tokens = POOL_ALL_TOKENS.filter((item) => {
        return (
            !judgeAssetHash(item.assetID, token.assetID) &&
            item.poolName === poolName &&
            item.assetID !== ETH_SOURCE_ASSET_HASH &&
            item.chain === token.chain
        )
    })
    if (tokens.length === 1) {
        return tokens[0]
    } else {
        return tokens.find((item) => item.originalHash)
    }
}
//#endregion
