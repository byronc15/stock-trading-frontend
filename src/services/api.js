import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fetches the list of available stocks with current tick data.
 * @returns {Promise<AxiosResponse<Array<{symbol: string, name: string, price: number, change: number, changePercent: number, open: number, high: number, low: number, volume: number, timestamp: number}>>>}
 */
export const fetchStocks = () => apiClient.get('/stocks');

/**
 * Fetches the user's portfolio data.
 * @returns {Promise<AxiosResponse<{cash: number, holdings: Array<{symbol: string, quantity: number, price: number, value: number}>, totalValue: number}>>}
 */
export const fetchPortfolio = () => apiClient.get('/portfolio');

/**
 * Submits a trade request (buy or sell).
 * @param {{symbol: string, quantity: number, side: 'buy' | 'sell'}} tradeData
 * @returns {Promise<AxiosResponse<any>>}
 */
export const postTrade = (tradeData) => apiClient.post('/trade', tradeData);

/**
 * Fetches the recent price history for a specific stock symbol.
 * @param {string} symbol The stock symbol
 * @returns {Promise<AxiosResponse<Array<{timestamp: number, price: number}>>>}
 */
export const fetchStockHistory = (symbol) => apiClient.get(`/stocks/${symbol}/history`); // <<< NEW FUNCTION

export default apiClient;
