import BigNumber from 'bignumber.js'
import Web3 from 'web3'
import { getMinAmountOut, getPoolAddress, isPToken } from '../utils/global'
import { PoolSwapParams } from '../_libs/pool'
import { Token } from '../_libs/token'

export async function getPoolCalculateSwapData(fromToken: Token, inputAmount: string): Promise<string> {
    const web3 = new Web3()
    const json = await fetch('./assets/contract-json/Pool.json')
        .then((response) => response.json())
        .then((res) => {
            return res
        })
        .catch((error) => {
            console.log(error)
        })
    const poolAddress = getPoolAddress(fromToken)
    const poolContract = new web3.eth.Contract(json, poolAddress)
    const fromIndex = isPToken(fromToken) ? 1 : 0
    const amount = new BigNumber(inputAmount).shiftedBy(fromToken.decimals).dp(0).toFixed()
    const dataParams = [fromIndex, fromIndex ^ 1, amount]
    return poolContract.methods.calculateSwap(...dataParams).encodeABI()
}

export async function getPoolSwapData(params: PoolSwapParams): Promise<string> {
    const { fromToken, toToken, inputAmount, receiveAmount } = params
    const json = await fetch('./assets/contract-json/Pool.json')
        .then((response) => response.json())
        .then((res) => {
            return res
        })
        .catch((error) => {
            console.log(error)
        })
    const poolAddress = getPoolAddress(fromToken)
    const fromIndex = isPToken(fromToken) ? 1 : 0
    const poolContract = new this.web3.eth.Contract(json, poolAddress)
    const deadline = Math.floor(Date.now() / 1000 + 10 * 60)
    const amount = new BigNumber(inputAmount).shiftedBy(fromToken.decimals).dp(0).toFixed()
    const minDy = getMinAmountOut(new BigNumber(receiveAmount).shiftedBy(toToken.decimals).dp(0).toFixed(), 1)
    const dataParams = [fromIndex, fromIndex ^ 1, amount, minDy, deadline]
    return poolContract.methods.swap(...dataParams).encodeABI()
}
