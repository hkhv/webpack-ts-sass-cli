export function getProportionSheet(resultContent: any) {
    console.log(resultContent.Sheets['占比计算'])
    const data = resultContent.Sheets['占比计算']
    Object.keys(data).forEach((key) => {
        if (!key.startsWith('!')) {
            const valueType = data[key].t
            const w = data[key]?.w
            let numfmt: string = '0'
            if (valueType === 'n' && w.indexOf('%') >= 0) {
                numfmt = '0.00%'
            }
            data[key].s = {
                numFmt: numfmt,
            }
        }
    })
    return data
}
