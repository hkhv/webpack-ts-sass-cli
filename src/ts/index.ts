import BigNumber from 'bignumber.js'
import '../style/index.scss'
import { calculateSwap } from '../utils/calculate'
import { PoolService } from '../utils/pool.service'
import { POOL_ALL_WRAPPED_TOKENS } from '../_libs/token'

const poolService = new PoolService()
const tableBody = document.getElementById('pool-table-body')
let data = []
let poolData = {}
let rates = {}
function init() {
    POOL_ALL_WRAPPED_TOKENS.forEach((wrappedToken, index) => {
        const tr = document.createElement('tr')
        const chainTd = document.createElement('td')
        const poolTd = document.createElement('td')
        const token0Td = document.createElement('td')
        const token1Td = document.createElement('td')
        const rateTd = document.createElement('td')
        const dxTd = document.createElement('td')
        const dyTd = document.createElement('td')
        const profitTd = document.createElement('td')
        chainTd.setAttribute('class', 'chain')
        poolTd.setAttribute('class', 'pool')
        token0Td.setAttribute('class', 'token0')
        token1Td.setAttribute('class', 'token1')
        rateTd.setAttribute('class', 'rate')
        dxTd.setAttribute('class', 'dx')
        dyTd.setAttribute('class', 'dy')
        profitTd.setAttribute('class', 'profit')
        chainTd.textContent = wrappedToken.chain
        poolTd.textContent = wrappedToken.poolName
        tr.appendChild(chainTd)
        tr.appendChild(poolTd)
        tr.appendChild(token0Td)
        tr.appendChild(token1Td)
        tr.appendChild(rateTd)
        tr.appendChild(dxTd)
        tr.appendChild(dyTd)
        tr.appendChild(profitTd)
        tableBody.appendChild(tr)
        data[index] = {
            chain: wrappedToken.chain,
            poolName: wrappedToken.poolName,
        }
    })
    document.getElementById('rate-th').onclick = sort
}
function initData() {
    poolService.getRates().then((res) => {
        rates = res.data
    })
    poolService.getPoolBalance().then((res: any) => {
        poolData = res
        data.forEach((item) => {
            item.token0 = new BigNumber(poolData[item.chain][item.poolName][0].amount).dp(2).toFixed()
            item.token1 = new BigNumber(poolData[item.chain][item.poolName][1].amount).dp(2).toFixed()
            item.rate =
                new BigNumber(item.token0).comparedTo(new BigNumber(item.token1)) >= 0
                    ? new BigNumber(item.token0).div(new BigNumber(item.token1)).dp(3).toFixed()
                    : new BigNumber(item.token1).div(new BigNumber(item.token0)).dp(3).toFixed()
        })
        sort()
    })
}
function initTable() {
    const trArr = tableBody.getElementsByTagName('tr')
    for (let i = 0; i < trArr.length; i++) {
        const trItem = trArr[i]
        const chainTd = trItem.getElementsByClassName('chain')[0]
        const poolTd = trItem.getElementsByClassName('pool')[0]
        const token0Td = trItem.getElementsByClassName('token0')[0]
        const token1Td = trItem.getElementsByClassName('token1')[0]
        const rateTd = trItem.getElementsByClassName('rate')[0]
        const dxTd = trItem.getElementsByClassName('dx')[0]
        const dyTd = trItem.getElementsByClassName('dy')[0]
        const profitTd = trItem.getElementsByClassName('profit')[0]

        chainTd.textContent = data[i].chain
        poolTd.textContent = data[i].poolName
        token0Td.textContent = new BigNumber(data[i].token0).dp(2).toFixed()
        token1Td.textContent = new BigNumber(data[i].token1).dp(2).toFixed()
        rateTd.textContent = data[i].rate
        dxTd.textContent = data[i].dx
        dyTd.textContent = data[i].dy
        profitTd.textContent = data[i].profit
    }
}
function sort() {
    data = data.sort((a: any, b: any) => {
        return -new BigNumber(a.rate).comparedTo(new BigNumber(b.rate))
    })
    data.forEach((item) => {
        const token0 = poolData[item.chain][item.poolName][0]
        const token1 = poolData[item.chain][item.poolName][1]
        const comparedResult = new BigNumber(item.token0).comparedTo(new BigNumber(item.token1))
        const fromDecimals = comparedResult >= 0 ? token1.decimals : token0.decimals
        const toDecimals = comparedResult >= 0 ? token0.decimals : token1.decimals
        const fromIndex = comparedResult >= 0 ? 1 : 0
        const toIndex = comparedResult > 0 ? 0 : 1
        let rateChain = token0.chain.replace(/\s+/g, '').toLowerCase()
        if (rateChain === 'ethereum') {
            rateChain = 'eth'
        }
        if (new BigNumber(item.rate).comparedTo(1) >= 0) {
            const price = rates[rateChain][token0.symbol.toLowerCase()].price
            let money = new BigNumber(1)
            let dy = new BigNumber(0)
            let tokenCount: BigNumber = new BigNumber(0)
            let earnTokenCount = new BigNumber(0)
            while (1) {
                let tempTokenCount = money.div(new BigNumber(price)).shiftedBy(token1.decimals)

                let tempDy = new BigNumber(
                    calculateSwap({
                        tokenFrom: fromIndex,
                        tokenTo: toIndex,
                        dx: tempTokenCount,
                        balances: [
                            new BigNumber(item.token0).shiftedBy(token0.decimals),
                            new BigNumber(item.token1).shiftedBy(token1.decimals),
                        ],
                        tokenArr: [...poolData[item.chain][item.poolName]],
                    })
                )

                const tempEarn = tempDy.shiftedBy(-toDecimals).minus(tempTokenCount.shiftedBy(-fromDecimals))
                if (tempEarn.comparedTo(earnTokenCount) > 0) {
                    earnTokenCount = tempEarn
                    dy = tempDy
                    tokenCount = tempTokenCount
                } else {
                    break
                }
                money = money.plus(1)
            }
            if (tokenCount.toNumber() !== 0) {
                item.dx = tokenCount.shiftedBy(-fromDecimals).dp(fromDecimals).dp(6).toFixed()
                item.dy = dy.shiftedBy(-toDecimals).dp(toDecimals).dp(6).toFixed()
                item.profit = earnTokenCount.times(price).dp(4).toFixed()
            }
        }
    })
    initTable()
}

init()
initData()
setInterval(() => {
    initData()
}, 30000)
