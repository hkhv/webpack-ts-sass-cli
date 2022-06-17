import BigNumber from 'bignumber.js'
import { Token } from '../_libs/token'

const A_PRECISION = new BigNumber(100)
var swapFee = new BigNumber('6000000')
var FEE_DENOMINATOR = new BigNumber(1e10)

export function calculateSwap(params: { tokenFrom: number; tokenTo: number; dx: BigNumber; balances: BigNumber[]; tokenArr: Token[] }) {
    const { balances, tokenArr, tokenFrom, tokenTo, dx } = params
    let xp = getXP(balances, tokenArr)
    // console.log('xp = ', xp)
    // let x = new(big.Int).Add(xp[tokenFrom], new(big.Int).Mul(dx, tokenPrecisionMultipliers[tokenFrom]))
    let x = new BigNumber(xp[tokenFrom]).plus(dx.times(getTokenPrecisionMultiplier(tokenArr[tokenFrom])))
    // console.log('x=', x.toFixed())

    let y = getY({
        tokenFrom,
        tokenTo,
        x,
        xp,
        balances,
    })
    // console.log('y =', y.toFixed())
    // dy := new(big.Int).Sub(new(big.Int).Sub(xp[tokenTo], y), big.NewInt(1))
    let dy = xp[tokenTo].minus(y).minus(1)
    // console.log('dy =', dy.toFixed())
    // dyFee := new(big.Int).Quo(new(big.Int).Mul(dy, swapFee), FEE_DENOMINATOR)
    let dyFee = dy.times(swapFee).div(FEE_DENOMINATOR)
    // console.log('dyFee', dyFee.toFixed())
    // dy = new(big.Int).Quo(new(big.Int).Sub(dy, dyFee), tokenPrecisionMultipliers[tokenTo])
    dy = dy.minus(dyFee).div(getTokenPrecisionMultiplier(tokenArr[tokenTo]))
    // console.log('dy =', dy.toFixed())
    return dy.toFixed()
}

function getXP(balances: BigNumber[], tokenArr: Token[]): BigNumber[] {
    const xp: BigNumber[] = []

    balances.forEach((item, i) => {
        xp[i] = item.times(getTokenPrecisionMultiplier(tokenArr[i]))
    })
    return xp
}

function getD(xp: BigNumber[], a: string, balances: BigNumber[]) {
    let numTokens = new BigNumber(balances.length)
    let s = new BigNumber(0)
    xp.forEach((item) => {
        s = s.plus(new BigNumber(item))
    })

    if (s.comparedTo(new BigNumber(0)) === 0) {
        return s
    }
    let prevD
    let d = new BigNumber(s)
    let na = new BigNumber(a).times(numTokens)

    for (let i = 0; i < 255; i++) {
        let dp = new BigNumber(d)
        for (let j = 0; j < numTokens.toNumber(); j++) {
            dp = new BigNumber(dp).times(d).div(new BigNumber(xp[j]).times(numTokens))
        }
        prevD = new BigNumber(d)
        // (na * s / A_PRECISION + dp * numTokens) * d
        // foo := new(big.Int).Mul(new(big.Int).Add(new(big.Int).Quo(new(big.Int).Mul(na, s), A_PRECISION), new(big.Int).Mul(dp, numTokens)), d)
        let foo = na.times(s).div(A_PRECISION).plus(dp.times(numTokens)).times(d)
        // (na - A_PRECISION) * d / A_PRECISION + ((numTokens + 1) * dp)
        // bar := new(big.Int).Add(new(big.Int).Quo(new(big.Int).Mul(new(big.Int).Sub(na, A_PRECISION), d), A_PRECISION), new(big.Int).Mul(new(big.Int).Add(numTokens, big.NewInt(1)), dp))
        let bar = na.minus(A_PRECISION).times(d).div(A_PRECISION).plus(numTokens.plus(1).times(dp))
        // d = new(big.Int).Quo(foo, bar)
        d = foo.div(bar)
        if (d.minus(prevD).abs().comparedTo(1) <= 0) {
            return d
        }
    }

    console.error('D did not converge')
}

function getY(params: { tokenFrom: number; tokenTo: number; x: BigNumber; xp: BigNumber[]; balances: BigNumber[] }) {
    const { tokenFrom, tokenTo, x, xp, balances } = params
    let numTokens = new BigNumber(balances.length)
    const a = new BigNumber(200 * 100)
    let d = getD(xp, a.toFixed(), balances)
    // fmt.Printf("d=%d\n", d)
    // let na :new(big.Int).Mul(numTokens, a)
    let na = numTokens.times(a)
    // c := new(big.Int).Set(d)
    let c = new BigNumber(d)
    // s := big.NewInt(0)
    let s = new BigNumber(0)
    let _x

    for (let i = 0; i < numTokens.toNumber(); i++) {
        if (i === tokenFrom) {
            _x = new BigNumber(x)
        } else if (i !== tokenTo) {
            _x = xp[i]
        } else {
            continue
        }
        s = s.plus(_x)
        c = c.times(d).div(_x.times(numTokens))
    }
    //c = c * d * A_PRECISION / (na * numTokens)
    // c = new(big.Int).Quo(new(big.Int).Mul(new(big.Int).Mul(c, d), A_PRECISION), new(big.Int).Mul(na, numTokens))
    c = c.times(d).times(A_PRECISION).div(na.times(numTokens))
    // b := new(big.Int).Add(s, new(big.Int).Quo(new(big.Int).Mul(d, A_PRECISION), na))
    let b = s.plus(d.times(A_PRECISION).div(na))
    let yprev
    let y = new BigNumber(d)

    for (let i = 0; i < 255; i++) {
        yprev = new BigNumber(y)
        // y = y * y + c / (2 * y + b - d)
        // y = new(big.Int).Quo(new(big.Int).Add(new(big.Int).Mul(y, y), c), new(big.Int).Sub(new(big.Int).Add(new(big.Int).Mul(big.NewInt(2), y), b), d))
        y = y.times(y).plus(c).div(y.times(2).plus(b).minus(d))
        if (y.minus(yprev).abs().comparedTo(1) <= 0) {
            return y
        }
    }

    console.error('Approximation did not converge')
}

function getTokenPrecisionMultiplier(token: Token): BigNumber {
    return new BigNumber(10).pow(18 - token.decimals)
}
