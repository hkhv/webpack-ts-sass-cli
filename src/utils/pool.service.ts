import axios from 'axios'
import BigNumber from 'bignumber.js'
import Web3 from 'web3'
import { getPoolCalculateSwapData, getPoolSwapData } from '../contract/pool-contract'
import { ETH_RPC_HOST } from '../_libs/api'
import { CHAINS, CHAIN_ENUM, CHAIN_LIST } from '../_libs/chains'
import { PoolSwapParams } from '../_libs/pool'
import { Token, POOL_ALL_TOKENS, ETH_SOURCE_ASSET_HASH } from '../_libs/token'
import { getEthCall, getPoolAddress, getSendTransactionParams } from './global'

export class PoolService {
    web3 = new Web3()
    constructor() {}

    async getRates() {
        return axios.get('https://hub-v2.o3.network/v1/crypto/rates').then((response) => {
            return response.data
        })
    }

    async poolCalculateSwap(fromToken: Token, toToken: Token, inputAmount: string): Promise<string> {
        console.log('poolCalculateSwap')
        const contractHash = getPoolAddress(fromToken)
        const data = await getPoolCalculateSwapData(fromToken, inputAmount)
        const callParams = [getSendTransactionParams(undefined, contractHash, data), 'latest']
        const result = getEthCall(callParams, toToken, true)
        return result
    }

    async getPoolBalance(): Promise<any> {
        const result: any = {}
        return new Promise((resolve) => {
            CHAIN_LIST.forEach(async (chain) => {
                const postDatas: any[] = []
                const tempTokens = (JSON.parse(JSON.stringify(POOL_ALL_TOKENS)) as Token[]).filter((item) => {
                    return item.assetID !== ETH_SOURCE_ASSET_HASH && item.chain === chain
                })
                for (const token of tempTokens) {
                    const data = await this.getReqBalanceData(chain, getPoolAddress(token), token.assetID)
                    postDatas.push(data)
                }
                if (postDatas.length <= 0) {
                    result[chain] = {}
                    if (Object.keys(result).length === CHAIN_LIST.length) {
                        resolve(result)
                    }
                    return
                }
                axios.post<any[]>(ETH_RPC_HOST[chain], postDatas).then((response: any) => {
                    const res = response.data
                    result[chain] = {}
                    if (!res.length) {
                        if (Object.keys(result).length === CHAIN_LIST.length) {
                            resolve(result)
                        }
                    }
                    res.forEach((resItem, index) => {
                        const token = tempTokens[index]
                        const balance = resItem.result
                        if (!result[chain].hasOwnProperty(token.poolName!)) {
                            result[chain][token.poolName!] = []
                        }
                        if (balance && !new BigNumber(balance).isNaN() && new BigNumber(balance).comparedTo(0) >= 0) {
                            token.amount = new BigNumber(balance).shiftedBy(-token.decimals).toFixed()
                        }
                        result[chain][token.poolName!].push(token)
                    })
                    if (Object.keys(result).length === CHAIN_LIST.length) {
                        resolve(result)
                    }
                })
            })
        })
    }

    async poolSwap(params: PoolSwapParams): Promise<string | undefined> {
        console.log('poolSwap')
        const { fromToken, toToken, inputAmount, receiveAmount, fromAddress } = params
        const contractHash = getPoolAddress(fromToken)
        const data = await getPoolSwapData(params)
        return this.sendTransaction({
            fromAddress,
            contractHash,
            data,
            value: '0',
            fromToken: [fromToken],
            toToken: [toToken],
            inputAmount: [inputAmount],
            receiveAmount: [receiveAmount],
        })
    }

    private async sendTransaction(params: {
        fromAddress: string
        contractHash: string
        data: string
        value: string
        fromToken: Token[]
        toToken: Token[]
        inputAmount: string[]
        receiveAmount: string[]
    }): Promise<string | undefined> {
        const requestData = {
            method: 'eth_sendTransaction',
            params: [getSendTransactionParams(params.fromAddress, params.contractHash, params.data, params.value)],
        }
        return (window as any).ethereum
            .request(requestData)
            .then((hash: string) => {
                return hash
            })
            .catch((error: any) => {
                return undefined
            })
    }
    private async getReqBalanceData(chain: CHAINS, address: string, tokenAssetId: string): Promise<any> {
        if (address === '') {
            return null
        }
        let params: any[]
        let method = 'eth_call'
        const json = await axios.get('./assets/contract-json/ethErc20.json').then((res) => res.data)
        const ethErc20Contract = new this.web3.eth.Contract(json, tokenAssetId)
        const data = await ethErc20Contract.methods.balanceOf(address).encodeABI()
        params = [getSendTransactionParams(address, tokenAssetId, data), 'latest']
        return {
            jsonrpc: '2.0',
            id: CHAIN_ENUM[chain],
            method,
            params,
        }
    }
}
