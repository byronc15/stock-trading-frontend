// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query'; // Import useQuery
import { fetchStocks } from '../services/api';   // Import fetchStocks
import StockList from '../components/StockList';
import StockChart from '../components/StockChart';

const HomePage = () => {
  const [selectedSymbol, setSelectedSymbol] = useState(null);

  // --- Fetch Stock List Data Here ---
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
  // --- End Fetch ---

  // --- Effect to set initial selected stock ---
  useEffect(() => {
    // Only set the default if no symbol is selected yet AND stocks have loaded
    if (!selectedSymbol && stocks && stocks.length > 0) {
      setSelectedSymbol(stocks[0].symbol); // Select the first stock symbol
    }
    // Dependency array includes stocks and selectedSymbol
    // We only want this to run when stocks load initially or if selection is reset
  }, [stocks, selectedSymbol]);
  // --- End Effect ---

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
      {/* Pass stocks data and handlers down to StockList */}
      <StockList
          stocks={stocks || []} // Pass fetched stocks or empty array
          // Pass loading/error related states if StockList needs them (e.g., for refresh button)
          isLoading={stocksLoading}
          error={stocksError}
          isFetching={isFetchingStocks}
          refetch={refetchStocks}
          // Keep selection logic props
          onStockSelect={handleStockSelect}
          selectedSymbol={selectedSymbol}
          // Decide if StockList should show its own refresh button or rely on HomePage
          showRefreshButton={true}
      />

      <StockChart symbol={selectedSymbol} />
    </div>
  );
};

export default HomePage;