"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importStar(require("fs"));
const axios_1 = __importDefault(require("axios"));
const date_fns_1 = require("date-fns");
const glob_1 = __importDefault(require("glob"));
const backup_data_json_1 = __importDefault(require("./fixtures/backup-data.json"));
const compare_old_and_new_products_1 = require("./compare-old-and-new-products");
const compare_price_changes_1 = require("./compare-price-changes");
// Uses fallback demo data if set to false.
const USE_API_REQUEST = false;
let mostRecentHistoryFile;
function app() {
    const payload = {
        path: '/Apparel/Mens',
        newestProductsOnly: false
    };
    function getMostRecentHistoryFile() {
        return __awaiter(this, void 0, void 0, function* () {
            const file = glob_1.default.sync('history/*.json')
                .map((name) => ({ name, ctime: fs_1.default.statSync(name).ctime }))
                .sort((a, b) => b.ctime - a.ctime)[0].name;
            return JSON.parse(yield fs_1.promises.readFile(file, 'utf8'));
        });
    }
    function getMostRecentHistoryPath() {
        return glob_1.default.sync('history/*.json');
    }
    function writeSaleItemsToFile(products) {
        return __awaiter(this, void 0, void 0, function* () {
            const saleProducts = products.filter((product) => product.ShowSalesItemBanner);
            const formattedDateAndTime = (0, date_fns_1.format)(new Date(), 'yyyy-MM-dd - HH:mm:ss');
            const mostRecentHistoryPath = getMostRecentHistoryPath();
            if (mostRecentHistoryPath.length > 0) {
                /**
                 * Store the most recent history now, because it won't be most recent soon.
                 */
                mostRecentHistoryFile = yield getMostRecentHistoryFile();
            }
            else {
                /**
                 * Create history dir, as it doesn't exist yet.
                 */
                fs_1.default.mkdir('history', { recursive: true }, (err) => {
                    if (err != null)
                        throw err;
                });
            }
            /**
             * Save all products to file.
             */
            fs_1.default.writeFile(`history/${formattedDateAndTime}.json`, JSON.stringify(saleProducts), (err) => {
                if (err != null)
                    throw err;
            });
        });
    }
    function handleSuccess(res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield writeSaleItemsToFile(res.data.d);
            if ((mostRecentHistoryFile == null) || getMostRecentHistoryPath().length === 0) {
                console.log('No existing history. Will make comparisons when this app next runs.');
                return;
            }
            const priceChanges = (0, compare_price_changes_1.comparePriceChanges)(mostRecentHistoryFile, yield getMostRecentHistoryFile());
            const productDiff = (0, compare_old_and_new_products_1.compareOldAndNewProducts)(mostRecentHistoryFile, yield getMostRecentHistoryFile());
            console.warn('✨ priceChanges:', priceChanges); // eslint-disable-line no-console
            console.warn('✨ productDiff:', productDiff); // eslint-disable-line no-console
        });
    }
    function handleProblem(err) {
        // eslint-disable-next-line no-console
        console.error('Error: ', err);
    }
    if (USE_API_REQUEST) {
        axios_1.default.post('https://www.pxg.com/Services/ProductListingService.asmx/GetCategoryProducts', payload)
            .then(handleSuccess)
            .catch(handleProblem);
    }
    else {
        handleSuccess({
            data: backup_data_json_1.default
        })
            .then(() => { })
            .catch((err) => {
            // eslint-disable-next-line no-console
            console.error('Error: ', err);
        });
    }
}
app();
//# sourceMappingURL=index.js.map