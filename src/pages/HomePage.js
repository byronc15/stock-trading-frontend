import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchStocks } from '../services/api';
import StockList from '../components/StockList';
import StockChart from '../components/StockChart';

const HomePage = () => {
  const [selectedSymbol, setSelectedSymbol] = useState(null);

  // Fetch the main stock list data for the page
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
    refetchInterval: 5 * 1000, // Refresh stock list periodically
  });

  // Effect to select the first stock by default when data loads
  useEffect(() => {
    if (!selectedSymbol && stocks && stocks.length > 0) {
      setSelectedSymbol(stocks[0].symbol);
    }
  }, [stocks, selectedSymbol]);

  // Handler to update the selected stock for the chart
  const handleStockSelect = (symbol) => {
    // Allow deselecting by clicking the same stock again
    setSelectedSymbol(prevSymbol => prevSymbol === symbol ? null : symbol);
  };

  // Handle loading and error states for the primary stock list fetch
  if (stocksLoading && !stocks) {
      return <div className="text-center p-4">Loading market data...</div>;
  }

  if (stocksError) {
      return <div className="text-center p-4 text-red-600">Error loading market data: {stocksError.message}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Pass fetched data and control props down to StockList */}
      <StockList
          stocks={stocks || []}
          isLoading={stocksLoading}
          error={stocksError}
          isFetching={isFetchingStocks}
          refetch={refetchStocks}
          onStockSelect={handleStockSelect}
          selectedSymbol={selectedSymbol}
          showRefreshButton={true}
      />
      {/* Render chart for the selected symbol */}
      <StockChart symbol={selectedSymbol} />
    </div>
  );
};

export default HomePage;