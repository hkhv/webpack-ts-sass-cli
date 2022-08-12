import axios from 'axios'
import '../style/index.scss'

enum CHAINS {
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
    Cube = 'Cube',
    Metis = 'Metis',
}

const CHAIN_ID_EUNM = {
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
    [1818]: CHAINS.Cube,
    [1088]: CHAINS.Metis,
}

function main() {
    console.log('main')
    Promise.all([
        axios.get('https://v2.o3swap.com/contract-hash.json'),
        axios.get('https://api.o3swap.com/v1/pool_swap_volumes?key=A88D855F2782376B91E846DD91FB17DA'),
    ]).then((result) => {
        const contractHash = result[0].data
        const poolsData = contractHash.poolAddress
        const volumesData = result[1].data.data
        console.log(contractHash)
        console.log(volumesData)
    })
}
main()
