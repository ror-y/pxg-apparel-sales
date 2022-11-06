import fs, { promises } from 'fs'
import axios from 'axios'
import { format } from 'date-fns'
import glob from 'glob'
import backupData from './fixtures/backup-data.json'
import { compareOldAndNewProducts } from './compare-old-and-new-products'
import { Product } from './types'
import { comparePriceChanges } from './compare-price-changes'

// Uses fallback demo data if set to false.
const USE_API_REQUEST = false

let mostRecentHistoryFile: Product[] | undefined

function app (): void {
  const payload = {
    path: '/Apparel/Mens',
    newestProductsOnly: false
  }

  async function getMostRecentHistoryFile (): Promise<Product[]> {
    const file = glob.sync('history/*.json')
      .map((name) => ({ name, ctime: fs.statSync(name).ctime }))
      .sort((a, b) => (b.ctime as any) - (a.ctime as any))[0].name

    return JSON.parse(await promises.readFile(file, 'utf8'))
  }

  function getMostRecentHistoryPath (): string[] {
    return glob.sync('history/*.json')
  }

  async function writeSaleItemsToFile (products: Product[]): Promise<void> {
    const saleProducts = products.filter((product) => product.ShowSalesItemBanner)
    const formattedDateAndTime = format(new Date(), 'yyyy-MM-dd - HH:mm:ss')
    const mostRecentHistoryPath = getMostRecentHistoryPath()

    if (mostRecentHistoryPath.length > 0) {
      /**
       * Store the most recent history now, because it won't be most recent soon.
       */
      mostRecentHistoryFile = await getMostRecentHistoryFile()
    } else {
      /**
       * Create history dir, as it doesn't exist yet.
       */
      fs.mkdir('history', { recursive: true }, (err) => {
        if (err != null) throw err
      })
    }

    /**
     * Save all products to file.
     */
    fs.writeFile(`history/${formattedDateAndTime}.json`, JSON.stringify(saleProducts), (err) => {
      if (err != null) throw err
    })
  }

  async function handleSuccess (res: { data: { d: Product[] } }): Promise<void> {
    await writeSaleItemsToFile(res.data.d)
    if ((mostRecentHistoryFile == null) || getMostRecentHistoryPath().length === 0) {
      /**
       * Return early, because there is no history to compare against.
       */
      console.log('No existing history. Will make comparisons when this app next runs.')
      return
    }

    const priceChanges = comparePriceChanges(mostRecentHistoryFile, await getMostRecentHistoryFile())
    const productDiff = compareOldAndNewProducts(mostRecentHistoryFile, await getMostRecentHistoryFile())

    console.warn('✨ priceChanges:', priceChanges) // eslint-disable-line no-console
    console.warn('✨ productDiff:', productDiff) // eslint-disable-line no-console
  }

  function handleProblem (err: Error): void {
    // eslint-disable-next-line no-console
    console.error('Error: ', err)
  }

  if (USE_API_REQUEST) {
    axios.post('https://www.pxg.com/Services/ProductListingService.asmx/GetCategoryProducts', payload)
      .then(handleSuccess)
      .catch(handleProblem)
  } else {
    handleSuccess({
      data: backupData
    })
      .then(() => {})
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Error: ', err)
      })
  }
}

app()
