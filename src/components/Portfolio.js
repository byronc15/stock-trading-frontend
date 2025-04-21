import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchPortfolio } from '../services/api';

const Portfolio = () => {
  const { data: portfolioData, error, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['portfolio'],
    queryFn: fetchPortfolio,
    select: (data) => data.data,
    refetchInterval: 20 * 1000, // Refetch every 20 seconds
  });

  // Provide default structure while loading or if data is initially undefined
  const portfolio = portfolioData || { cash: 0, holdings: [], totalValue: 0 };

  // Show loading only on initial fetch
  if (isLoading && !portfolioData) {
    return <div className="text-center p-4">Loading portfolio...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-600">Error loading portfolio: {error.message}</div>;
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
       <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h2 className="text-lg leading-6 font-medium text-gray-900">Your Portfolio</h2>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className={`px-3 py-1 border border-gray-300 text-sm rounded shadow-sm ${isFetching ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
           >
            {isFetching ? 'Refreshing...' : 'Refresh'}
           </button>
       </div>

      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Cash Balance</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">${portfolio.cash.toFixed(2)}</dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Total Portfolio Value</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-semibold">${portfolio.totalValue.toFixed(2)}</dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Holdings</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {portfolio.holdings.length === 0 ? (
                <span className="text-gray-500">You currently hold no stocks.</span>
              ) : (
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                     <tr>
                        <th scope="col" className="py-2 pl-4 pr-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 sm:pl-6">Symbol</th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Quantity</th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Avg Price</th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Current Value</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {portfolio.holdings.map((stock) => (
                      <tr key={stock.symbol}>
                         <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{stock.symbol}</td>
                         <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500">{stock.quantity}</td>
                         {/* Note: Backend provides current price/value. Avg price might need backend calculation if desired */}
                         <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500">${stock.price?.toFixed(2) ?? 'N/A'}</td>
                         <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500">${stock.value.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default Portfolio;