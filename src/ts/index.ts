import '../style/index.scss'
import { getTotalSheet } from './sheet'

declare const XLSX: any

let refundContent: any
let salesContent: any
let adContent: any
let resultContent: any
let day = 1
let date = ''

enum fileType {
    refund = 'refund',
    sales = 'sales',
    ad = 'ad',
    result = 'result',
}

document.getElementById('refund-input')!.onchange = (e) => {
    openFile(e, fileType.refund)
}
document.getElementById('sales-input')!.onchange = (e) => {
    openFile(e, fileType.sales)
}
document.getElementById('ad-input')!.onchange = (e) => {
    openFile(e, fileType.ad)
}
document.getElementById('result-input')!.onchange = (e) => {
    openFile(e, fileType.result)
}
document.getElementById('export').onclick = () => {
    getResult()
}

document.getElementById('date').onchange = (e: any) => {
    date = e.target.value
    day = new Date(e.target.value).getDate()
}

function openFile(event: any, type: fileType) {
    var input = event.target
    var reader = new FileReader()
    reader.onload = function (e: any) {
        if (reader.result) {
            var content = XLSX.read(e.target.result, { type: 'binary' })
            console.log(content)
            initData(type, content)
        }
    }
    reader.readAsBinaryString(input.files[0])
    document.getElementById(`${type}-input-name`)!.innerText = input.files[0].name
}
function initData(type: fileType, data: any) {
    switch (type) {
        case fileType.refund:
            refundContent = data
            break
        case fileType.sales:
            salesContent = data
            break
        case fileType.ad:
            adContent = data
            break
        case fileType.result:
            resultContent = data
            break
    }
    // if (resultContent) {
    //     getResult()
    // }
}

function getResult() {
    // console.log(resultContent)
    const [sheet1, sheet2, sheet3] = getTotalSheet(resultContent, salesContent, refundContent, adContent, day)

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, sheet1, '总表')
    XLSX.utils.book_append_sheet(wb, sheet2, '达成率')
    XLSX.utils.book_append_sheet(wb, sheet3, '占比计算')
    const wbOut = XLSX.writeFile(wb, `${date}-销售表统计.xlsx`, { useStyles: true })
}
