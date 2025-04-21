import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchStocks } from '../services/api';
import StockList from '../components/StockList';
import StockChart from '../components/StockChart';

const HomePage = () => {
  const [selectedSymbol, setSelectedSymbol] = useState(null);

  const {
    data: stocks,
    error: stocksError,
    isLoading: stocksLoading,
    refetch: refetchStocks,
    isFetching: isFetchingStocks
  } = useQuery({
    queryKey: ['stocks'],
    queryFn: fetchStocks,
    select: (data) => data.data,
    staleTime: 4 * 1000,
    refetchInterval: 5 * 1000,
  });

  useEffect(() => {
    // Only set the default if no symbol is selected yet AND stocks have loaded
    if (!selectedSymbol && stocks && stocks.length > 0) {
      setSelectedSymbol(stocks[0].symbol); // Select the first stock symbol
    }
  }, [stocks, selectedSymbol]);

  const handleStockSelect = (symbol) => {
    setSelectedSymbol(prevSymbol => prevSymbol === symbol ? null : symbol);
  };

  // Handle loading and error states for the stock list itself
  if (stocksLoading && !stocks) {
      return <div className="text-center p-4">Loading market data...</div>;
  }

  if (stocksError) {
      return <div className="text-center p-4 text-red-600">Error loading market data: {stocksError.message}</div>;
  }

  return (
    <div className="space-y-6">
      <StockList
          stocks={stocks || []} // Pass fetched stocks or empty array
          isLoading={stocksLoading}
          error={stocksError}
          isFetching={isFetchingStocks}
          refetch={refetchStocks}
          onStockSelect={handleStockSelect}
          selectedSymbol={selectedSymbol}
          showRefreshButton={true}
      />

      <StockChart symbol={selectedSymbol} />
    </div>
  );
};

export default HomePage;