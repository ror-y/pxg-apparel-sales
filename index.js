const fs = require('fs');
const axios = require('axios');
const { format } = require('date-fns');
const glob = require('glob');
const { promises } = require('fs');
const backupData = require('./fixtures/backup-data.json');
const { compareOldAndNewProducts } = require('./compare-old-and-new-products');

// Uses fallback demo data if set to false.
const USE_API_REQUEST = false;

let mostRecentHistoryFile = null;

function app() {
  const payload = {
    path: '/Apparel/Mens',
    newestProductsOnly: false,
  };

  async function getMostRecentHistoryFile() {
    const filePath = glob.sync('history/*.json')
      .map((name) => ({ name, ctime: fs.statSync(name).ctime }))
      .sort((a, b) => b.ctime - a.ctime)[0].name;

    return JSON.parse(await promises.readFile(filePath, 'utf8'));
  }

  async function writeSaleItemsToFile(products) {
    const saleProducts = products.filter((product) => product.ShowSalesItemBanner);

    const formattedDateAndTime = format(new Date(), 'yyyy-MM-dd - HH:mm:ss');

    mostRecentHistoryFile = await getMostRecentHistoryFile();

    fs.writeFile(`history/${formattedDateAndTime}.json`, JSON.stringify(saleProducts), (err) => {
      if (err) throw err;
    });
  }

  async function gotData(res) {
    await writeSaleItemsToFile(res.data.d);
    compareOldAndNewProducts(mostRecentHistoryFile, await getMostRecentHistoryFile());
  }

  function problem(err) {
    console.error('Error: ', err);
  }

  if (USE_API_REQUEST) {
    axios.post('https://www.pxg.com/Services/ProductListingService.asmx/GetCategoryProducts', payload)
      .then(gotData)
      .catch(problem);
  } else {
    gotData({
      data: backupData,
    });
  }
}

app();
