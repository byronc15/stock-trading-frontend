import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { postTrade, fetchStocks } from '../services/api';

const TradeForm = () => {
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [side, setSide] = useState('buy');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const queryClient = useQueryClient();

  // Fetch stocks for the dropdown selector
  const { data: stocksData, isLoading: isLoadingStocks } = useQuery({
      queryKey: ['stocks'],
      queryFn: fetchStocks,
      select: (data) => data.data,
      staleTime: 60 * 1000 * 5, // Cache stock list for 5 minutes
  });
  const availableStocks = stocksData || [];

  // Effect to reset symbol selection if the previously selected stock is no longer available
  // (e.g., if the backend's supported stock list changes - an edge case).
  useEffect(() => {
    if (symbol && availableStocks.length > 0 && !availableStocks.find(s => s.symbol === symbol)) {
        setSymbol('');
    }
  }, [availableStocks, symbol]);


  // React Query Mutation hook for handling the POST /trade request
  const tradeMutation = useMutation({
    mutationFn: postTrade,
    onSuccess: (data) => {
      setMessage(`Trade successful: ${side.toUpperCase()} ${quantity} ${data.data.symbol || symbol}.`);
      setMessageType('success');
      // Invalidate portfolio data to trigger a refetch after a successful trade
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      // Clear form fields on success
      setSymbol('');
      setQuantity('');
      setSide('buy');
    },
    onError: (error) => {
      // Extract user-friendly error message from API response or default
      const errorMsg = error.response?.data?.message || error.message || 'An unknown error occurred.';
      setMessage(`Trade failed: ${errorMsg}`);
      setMessageType('error');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous message on new submission
    setMessageType('');

    // Basic client-side validation before sending request
    if (!symbol) {
      setMessage('Please select a stock.');
      setMessageType('error');
      return;
    }
    const numQuantity = parseInt(quantity, 10);
    if (isNaN(numQuantity) || numQuantity <= 0) {
      setMessage('Please enter a valid quantity greater than 0.');
      setMessageType('error');
      return;
    }

    // Trigger the mutation
    tradeMutation.mutate({ symbol, quantity: numQuantity, side });
  };

  // Dynamic class for styling feedback messages
   const messageClass = messageType === 'success'
     ? 'text-green-600'
     : messageType === 'error'
     ? 'text-red-600'
     : '';

   const isSubmitting = tradeMutation.isPending;
   // Disable form elements while submitting trade or loading stock list
   const isFormDisabled = isSubmitting || isLoadingStocks;

  return (
    <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Place a Trade</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>Select a stock, choose buy/sell, enter quantity, and submit.</p>
            </div>
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <div>
                    <label htmlFor="stock-symbol" className="block text-sm font-medium text-gray-700">
                        Stock
                    </label>
                    <select
                        id="stock-symbol"
                        name="symbol"
                        value={symbol}
                        onChange={(e) => setSymbol(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md disabled:bg-gray-100"
                        disabled={isFormDisabled}
                    >
                        <option value="" disabled>
                           {isLoadingStocks ? 'Loading stocks...' : '-- Select a Stock --'}
                        </option>
                        {availableStocks.map((stock) => (
                            <option key={stock.symbol} value={stock.symbol}>
                                {stock.symbol} ({stock.name}) - ${stock.price?.toFixed(2)}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="trade-side" className="block text-sm font-medium text-gray-700">
                        Action
                    </label>
                    <select
                        id="trade-side"
                        name="side"
                        value={side}
                        onChange={(e) => setSide(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md disabled:bg-gray-100"
                        disabled={isFormDisabled}
                    >
                        <option value="buy">Buy</option>
                        <option value="sell">Sell</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="trade-quantity" className="block text-sm font-medium text-gray-700">
                        Quantity
                    </label>
                    <input
                        type="number"
                        name="quantity"
                        id="trade-quantity"
                        min="1"
                        step="1"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md disabled:bg-gray-100"
                        placeholder="e.g., 10"
                        disabled={isFormDisabled}
                        required
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                            isSubmitting
                            ? 'bg-indigo-300 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                        }`}
                        disabled={isFormDisabled}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Trade'}
                    </button>
                </div>

                {/* Display success or error message after trade submission attempt */}
                {message && (
                    <div className={`mt-4 text-sm ${messageClass}`}>
                        {message}
                    </div>
                )}
            </form>
        </div>
    </div>
  );
};

export default TradeForm;