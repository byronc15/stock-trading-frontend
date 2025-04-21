// src/components/StockList.js
import React from 'react';
// Removed useQuery import

// Helper function remains the same
const formatVolume = (volume) => {
    if (volume >= 1_000_000) return `${(volume / 1_000_000).toFixed(2)}M`;
    if (volume >= 1_000) return `${(volume / 1_000).toFixed(1)}K`;
    return volume;
};

// Accept props passed down from HomePage
const StockList = ({
  stocks,         // <-- New prop
  isLoading,      // <-- New prop
  error,          // <-- New prop
  isFetching,     // <-- New prop
  refetch,        // <-- New prop
  showRefreshButton = true,
  onStockSelect,
  selectedSymbol
}) => {

  // Removed the useQuery hook that was here

  // Loading/error checks now use props
  // Note: HomePage handles the main initial loading/error state,
  // but StockList might still show these if needed during refetches,
  // or we can simplify these checks if HomePage handles all loading/error display.
  // Let's keep them simple for now.

  // if (isLoading && !stocks) { // Maybe not needed if HomePage handles initial load
  //   return <div className="text-center p-4">Loading available stocks...</div>;
  // }

  // if (error) { // Maybe not needed if HomePage handles error display
  //   return <div className="text-center p-4 text-red-600">Error loading stocks: {error.message}</div>;
  // }

  // Use the passed-in stocks prop
  if (!stocks || stocks.length === 0) {
    // This case handles when data is successfully fetched but empty,
    // or if the initial load in HomePage resulted in an empty array.
    return <div className="text-center p-4 text-gray-500">No stocks available at the moment.</div>;
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h2 className="text-lg leading-6 font-medium text-gray-900">Market Overview</h2>
          {/* Use the refetch function passed via props */}
          {showRefreshButton && (
             <button
               onClick={() => refetch()} // <-- Use prop
               disabled={isFetching}      // <-- Use prop
               className={`px-3 py-1 border border-gray-300 text-sm rounded shadow-sm ${isFetching ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
               {isFetching ? 'Refreshing...' : 'Refresh'}
              </button>
          )}
      </div>
      <div className="border-t border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
             {/* Headers remain the same */}
            <tr>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">Symbol</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
              <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Change %</th>
              <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Open</th>
              <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">High</th>
              <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Low</th>
              <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Map over the stocks prop */}
            {stocks.map((stock) => {
              const isSelected = stock.symbol === selectedSymbol;
              const changeColor = stock.change > 0 ? 'text-green-600' : stock.change < 0 ? 'text-red-600' : 'text-gray-500';
              return (
                <tr
                    key={stock.symbol}
                    onClick={() => onStockSelect(stock.symbol)}
                    className={`hover:bg-gray-100 cursor-pointer ${isSelected ? 'bg-blue-100' : ''}`}
                >
                   {/* Table cells remain the same */}
                  <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white z-5">
                    {stock.symbol}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">{stock.name}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-right font-semibold text-gray-800">
                    ${stock.price?.toFixed(2) ?? 'N/A'}
                  </td>
                  <td className={`px-3 py-4 whitespace-nowrap text-sm text-right ${changeColor}`}>
                    {stock.change?.toFixed(2) ?? 'N/A'}
                  </td>
                  <td className={`px-3 py-4 whitespace-nowrap text-sm text-right ${changeColor}`}>
                    {stock.changePercent?.toFixed(2) ?? 'N/A'}%
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-right text-gray-500">${stock.open?.toFixed(2) ?? 'N/A'}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-right text-gray-500">${stock.high?.toFixed(2) ?? 'N/A'}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-right text-gray-500">${stock.low?.toFixed(2) ?? 'N/A'}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-right text-gray-500">{formatVolume(stock.volume) ?? 'N/A'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockList;