import BigNumber from 'bignumber.js'

declare const XLSX: any
interface ResultData {
    [sku: string]: {
        quantity?: number
        salesPrice?: number
        refund?: number
        adSpend?: string
        owner?: string
    }
}
let resultData: ResultData = {}
let day = 1
const dataStartIndex = 15
export function getTotalSheet(resultContent: any, salesContent: any, refundContent: any, adContent: any, _day: number) {
    day = _day
    const resultSheet = resultContent.Sheets['总表']
    const achievementSheet = resultContent.Sheets['达成率']
    const proportionSheet = resultContent.Sheets['占比计算']

    resultData = {}
    getSalesData(salesContent)
    getRefundData(refundContent)
    getAdData(adContent)

    console.log('------', resultData)

    return [
        getResultSheet(resultSheet),
        getAchievementSheet(achievementSheet, resultSheet),
        getProportionSheet(proportionSheet, resultSheet),
    ]
}

function getSalesData(salesContent: any) {
    const sheet = salesContent.Sheets[salesContent.SheetNames[0]]
    const dataArr = XLSX.utils.sheet_to_json(sheet)
    dataArr
        .filter((item: any) => item.order_status !== 'Cancelled')
        .forEach((item: any) => {
            const oldData = resultData[item.sku]
            let oldQuantity = oldData?.quantity || 0
            let oldPrice = oldData?.salesPrice || 0
            const quantity = new BigNumber(oldQuantity).plus(new BigNumber(item.quantity)).toNumber()
            const price = new BigNumber(oldPrice)
                .plus(new BigNumber(item['item-price'] || 0))
                .plus(new BigNumber(item['shipping-price'] || 0))
                .toNumber()
            if (!resultData[item.sku]) {
                resultData[item.sku] = {
                    quantity,
                    salesPrice: price,
                }
            } else {
                resultData[item.sku]['quantity'] = quantity
                resultData[item.sku]['salesPrice'] = price
            }
        })
}

function getRefundData(refundContent: any) {
    const sheet = refundContent.Sheets[refundContent.SheetNames[0]]
    const dataArr = XLSX.utils.sheet_to_json(sheet)
    const keys = dataArr[6]
    const skuKey = getKeyByValue(keys, 'sku')
    const typeKey = getKeyByValue(keys, 'type')
    const totalKey = getKeyByValue(keys, 'total')
    dataArr
        .slice(7, dataArr.length)
        .filter((item: any) => item[typeKey] === 'Refund')
        .forEach((item: any) => {
            const oldData = resultData[item[skuKey]]
            const oldRefund = oldData?.refund || 0
            const refund = new BigNumber(oldRefund).plus(new BigNumber(item[totalKey]).abs()).abs().toNumber()
            if (!resultData[item[skuKey]]) {
                resultData[item[skuKey]] = {
                    refund,
                }
            } else {
                console.log(refund)
                console.log(resultData[item.sku])
                if (resultData[item.sku]) {
                    resultData[item.sku]['refund'] = refund
                } else {
                    resultData[item.sku] = {
                        refund,
                    }
                }
            }
        })
}

function getAdData(adContent: any) {
    const sheet = adContent.Sheets[adContent.SheetNames[0]]
    const dataArr = XLSX.utils.sheet_to_json(sheet)
    dataArr
        .filter((item: any) => item.order_status !== 'Cancelled')
        .forEach((item: any) => {
            const sku = item['Advertised SKU']
            const oldData = resultData[sku]
            let adSpend = oldData?.adSpend || 0
            adSpend = new BigNumber(adSpend).plus(new BigNumber(item['Spend'] || 0)).toFixed()
            if (!resultData[sku]) {
                resultData[sku] = {
                    adSpend,
                }
            } else {
                resultData[sku]['adSpend'] = adSpend
            }
        })
}

function getResultSheet(resultSheet: any) {
    const weekArr = getWeekArr()
    const columnKey = sortString(
        Array.from(
            new Set(
                Object.keys(resultSheet)
                    .slice(1)
                    .map((item) => item.replace(/\d/g, ''))
            )
        ).filter((item) => !item.startsWith('!'))
    )
    const skuIndex = getSkuRowKeuRowIndex(resultSheet)
    const dayIndex = weekArr.indexOf(day)
    const weekArrIndex = weekArr.reduce((arr, val, index) => {
        if (val < 0) {
            return [...arr, index]
        } else {
            return arr
        }
    }, [])
    const startIndex = dataStartIndex + dayIndex * 7

    columnKey.forEach((item, index) => {
        let color = 'FFB1CF95'
        if (index > 7 && index <= 14) {
            color = 'FFA3C1E3'
            for (let i = 0; i < 2000; i++) {
                if (resultSheet[`${item}${i}`]) {
                    if (!resultSheet[`${item}${i}`]['s']) {
                        resultSheet[`${item}${i}`]['s'] = {}
                    }
                    resultSheet[`${item}${i}`]['s']['fill'] = {
                        fgColor: { rgb: color },
                    }
                    let titleCell = resultSheet[`${item}${i}`]
                    titleCell['t'] = 's'
                    titleCell['v'] = titleCell.w || titleCell.v
                }
            }
        }
        if (resultSheet[`${item}1`]) {
            if (!resultSheet[`${item}1`]['s']) {
                resultSheet[`${item}1`]['s'] = {}
            }
            resultSheet[`${item}1`]['s']['fill'] = {
                fgColor: { rgb: color },
            }
            let titleCell = resultSheet[`${item}1`]
            titleCell['t'] = 's'
            titleCell['v'] = titleCell.w || titleCell.v
        }
        if (resultSheet[`${item}2`]) {
            if (!resultSheet[`${item}2`]['s']) {
                resultSheet[`${item}2`]['s'] = {}
            }
            resultSheet[`${item}2`]['s']['fill'] = {
                fgColor: { rgb: color },
            }
        }
    })
    Object.keys(skuIndex).forEach((sku) => {
        const i = skuIndex[sku]
        const titleKey = columnKey[startIndex]
        const priceKey = `${columnKey[startIndex]}${i}`
        const quantityKey = `${columnKey[startIndex + 1]}${i}`
        const salesPriceKey = `${columnKey[startIndex + 2]}${i}`
        const refundKey = `${columnKey[startIndex + 3]}${i}`
        const refundPercentKey = `${columnKey[startIndex + 4]}${i}`
        const adKey = `${columnKey[startIndex + 5]}${i}`
        const adPercentKey = `${columnKey[startIndex + 6]}${i}`
        weekArrIndex.forEach((wIndex) => {
            const weekStartIndex = dataStartIndex + wIndex * 7
            const weekStyle = {
                fill: {
                    fgColor: { rgb: 'FFEAB38B' },
                },
            }
            if (resultSheet[`${columnKey[weekStartIndex]}1`]) {
                resultSheet[`${columnKey[weekStartIndex]}1`]['s'] = weekStyle
            } else {
                resultSheet[`${columnKey[weekStartIndex]}1`] = {
                    s: weekStyle,
                }
            }
            for (let w = 0; w < 7; w++) {
                if (resultSheet[`${columnKey[weekStartIndex + w]}2`]) {
                    resultSheet[`${columnKey[weekStartIndex + w]}2`]['s'] = weekStyle
                } else {
                    resultSheet[`${columnKey[weekStartIndex + w]}2`] = {
                        s: weekStyle,
                    }
                }
                let cell = resultSheet[`${columnKey[weekStartIndex + w]}${i}`]
                if (cell) {
                    cell['s'] = weekStyle
                } else {
                    cell = {
                        s: weekStyle,
                    }
                }
            }
        })
        resultSheet[quantityKey] = {
            t: 'n',
            v: resultData[sku]?.quantity || 0,
        }
        resultSheet[salesPriceKey] = {
            t: 'n',
            v: resultData[sku]?.salesPrice || 0,
        }
        resultSheet[refundKey] = {
            t: 'n',
            v: resultData[sku]?.refund || 0,
        }
        resultSheet[refundPercentKey] = {
            t: 'n',
            f: `${refundKey}/${salesPriceKey}`,
        }
        if (resultSheet[refundPercentKey]['s']) {
            resultSheet[refundPercentKey]['s']['numFmt'] = '0.00%'
        } else {
            resultSheet[refundPercentKey]['s'] = {
                numFmt: '0.00%',
            }
        }
        resultSheet[adKey] = {
            t: 'n',
            v: resultData[sku]?.adSpend || 0,
        }
        resultSheet[adPercentKey] = {
            t: 'n',
            f: `${adKey}/${salesPriceKey}`,
        }
        if (resultSheet[adPercentKey]['s']) {
            resultSheet[adPercentKey]['s']['numFmt'] = '0.00%'
        } else {
            resultSheet[adPercentKey]['s'] = {
                numFmt: '0.00%',
            }
        }
    })
    return resultSheet
}

function getAchievementSheet(sheet: any, resultSheet: any) {
    const weekArr = getWeekArr()
    const totalColumnKey = sortString(
        Array.from(
            new Set(
                Object.keys(resultSheet)
                    .slice(1)
                    .map((item) => item.replace(/\d/g, ''))
            )
        ).filter((item) => !item.startsWith('!'))
    )
    const dayIndex = weekArr.indexOf(day)
    const startIndex = dataStartIndex + dayIndex * 7
    const salesPriceKey = `${totalColumnKey[startIndex + 1]}`
    const sheetJson = XLSX.utils.sheet_to_json(sheet)

    sheetJson.forEach((item: any, index: number) => {
        sheet[`F${index + 2}`] = {
            t: 'n',
            f: `SUMIFS(总表!${salesPriceKey}3:${salesPriceKey}2000,总表!G3:总表!G2000, "${item['产品名称']}")`,
        }
        sheet[`E${index + 2}`]['s'] = {
            fill: {
                fgColor: { rgb: 'FFF9DA78' },
            },
        }
        sheet[`F${index + 2}`]['s'] = {
            fill: {
                fgColor: { rgb: 'FFFFFF54' },
            },
        }
    })
    const columnKey = sortString(
        Array.from(
            new Set(
                Object.keys(sheet)
                    .slice(1)
                    .map((item) => item.replace(/\d/g, ''))
            )
        ).filter((item) => !item.startsWith('!'))
    )
    columnKey.forEach((item) => {
        sheet[`${item}1`]['s'] = {
            fill: {
                fgColor: { rgb: 'FF7EAB55' },
            },
        }
    })
    return sheet
}

function getProportionSheet(sheet: any, resultSheet: any) {
    const sheetJson = XLSX.utils.sheet_to_json(sheet)
    const weekArr = getWeekArr()
    const columnKey = sortString(
        Array.from(
            new Set(
                Object.keys(resultSheet)
                    .slice(1)
                    .map((item) => item.replace(/\d/g, ''))
            )
        ).filter((item) => !item.startsWith('!'))
    )
    const dayIndex = weekArr.indexOf(day)
    const startIndex = dataStartIndex + dayIndex * 7
    const salesPriceKey = `${columnKey[startIndex + 2]}`
    const refundKey = `${columnKey[startIndex + 3]}`
    const adKey = `${columnKey[startIndex + 5]}`
    sheetJson.forEach((item: any, index: number) => {
        const rowIndex = index + 2
        if (item['__EMPTY'] !== '总') {
            sheet[`B${rowIndex}`] = {
                t: 'n',
                f: `SUMIFS(总表!${salesPriceKey}3:${salesPriceKey}2000,总表!E3:总表!E2000, "${item['__EMPTY'].toUpperCase()}")`,
            }
            sheet[`C${rowIndex}`] = {
                t: 'n',
                f: `SUMIFS(总表!${refundKey}3:${refundKey}2000,总表!E3:总表!E2000, "${item['__EMPTY'].toUpperCase()}")`,
            }

            sheet[`E${rowIndex}`] = {
                t: 'n',
                f: `SUMIFS(总表!${adKey}3:${adKey}2000,总表!E3:总表!E2000, "${item['__EMPTY'].toUpperCase()}")`,
            }
        } else {
            sheet[`B${rowIndex}`] = {
                t: 'n',
                f: `SUM(B3:B20)`,
            }
            sheet[`C${rowIndex}`] = {
                t: 'n',
                f: `SUM(C3:C20)`,
            }

            sheet[`E${rowIndex}`] = {
                t: 'n',
                f: `SUM(E3:E20)`,
            }
        }
        sheet[`D${rowIndex}`] = {
            t: 'n',
            f: `C${rowIndex}/B${rowIndex}`,
            s: {
                numFmt: '0.00%',
            },
        }
        sheet[`F${rowIndex}`] = {
            t: 'n',
            f: `E${rowIndex}/B${rowIndex}`,
            s: {
                numFmt: '0.00%',
            },
        }
    })
    return sheet
}

function getWeekArr() {
    const year = new Date().getFullYear()
    const month = new Date().getMonth() + 1
    let weekCount = 1
    const array = [-weekCount]
    for (let i = 1; i <= 31; i++) {
        const day = new Date(`${year}/${month}/${i}`).getDay()
        if (day === 6) {
            array.push(-++weekCount)
        }
        array.push(i)
    }
    return array
}

function getSkuRowKeuRowIndex(resultSheet: any) {
    const skuObject = {}
    const skuKeys = Object.keys(resultSheet)
        .slice(1)
        .filter((item) => {
            return /^H\d+$/.test(item)
        })

    skuKeys.forEach((item) => {
        skuObject[resultSheet[item].v] = item.replace('H', '')
    })
    return skuObject
}

function getKeyByValue(object: any, value: string) {
    return Object.keys(object).find((key) => object[key] === value)
}

function sortString(stringArr: string[]) {
    return stringArr.sort((a: string, b: string) => {
        return ASCIISum(a) - ASCIISum(b)
    })
}

function ASCIISum(str: string) {
    return str.split('').reduce((acc, val) => {
        return acc * 100000 + val.charCodeAt(0)
    }, 0)
}
