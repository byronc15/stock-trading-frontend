import React from 'react';

// Helper to format large numbers (M for millions, K for thousands)
const formatVolume = (volume) => {
    if (!volume && volume !== 0) return 'N/A'; // Handle null/undefined
    if (volume >= 1_000_000) return `${(volume / 1_000_000).toFixed(2)}M`;
    if (volume >= 1_000) return `${(volume / 1_000).toFixed(1)}K`;
    return volume.toString();
};

const StockList = ({
  stocks,
  isLoading,
  isFetching,
  refetch,
  showRefreshButton = true,
  onStockSelect,
  selectedSymbol
}) => {

  // Display message if no stocks are available after fetch attempt
  if (!isLoading && (!stocks || stocks.length === 0)) {
    return <div className="text-center p-4 text-gray-500">No stocks available at the moment.</div>;
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h2 className="text-lg leading-6 font-medium text-gray-900">Market Overview</h2>
          {showRefreshButton && (
             <button
               onClick={() => refetch()}
               disabled={isFetching}
               className={`px-3 py-1 border border-gray-300 text-sm rounded shadow-sm ${isFetching ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
               {isFetching ? 'Refreshing...' : 'Refresh'}
              </button>
          )}
      </div>
      <div className="border-t border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
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
            {/* Render rows only if stocks array is available */}
            {stocks?.map((stock) => {
              const isSelected = stock.symbol === selectedSymbol;
              const changeColor = stock.change > 0 ? 'text-green-600' : stock.change < 0 ? 'text-red-600' : 'text-gray-500';
              return (
                <tr
                    key={stock.symbol}
                    onClick={() => onStockSelect(stock.symbol)}
                    className={`hover:bg-gray-100 cursor-pointer ${isSelected ? 'bg-blue-100' : ''}`}
                >
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
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-right text-gray-500">{formatVolume(stock.volume)}</td>
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