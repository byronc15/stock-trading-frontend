import React from 'react';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Portfolio from './Portfolio';
import { fetchPortfolio } from '../services/api';

jest.mock('../services/api', () => ({
  fetchPortfolio: jest.fn(),
}));

// Helper to wrap component with QueryClientProvider
const renderWithClient = (client, ui) => {
  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>
  );
};

describe('Portfolio Component', () => {
  let queryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false, // Disable retries for testing
        },
      },
    });
    fetchPortfolio.mockClear();
  });

  test('renders loading state initially', () => {
    // Mock a promise that never resolves to keep it in loading state
    fetchPortfolio.mockImplementation(() => new Promise(() => {}));
    renderWithClient(queryClient, <Portfolio />);
    expect(screen.getByText(/loading portfolio.../i)).toBeInTheDocument();
  });

  test('renders portfolio data after successful fetch', async () => {
    const mockPortfolioData = {
      // Mock data structure should match the actual API response structure
      data: {
        cash: 50000.50,
        holdings: [
          { symbol: 'AAPL', quantity: 10, price: 195.50, value: 1955.00 },
          { symbol: 'MSFT', quantity: 5, price: 410.00, value: 2050.00 },
        ],
        totalValue: 54005.50,
      }
    };
    fetchPortfolio.mockResolvedValue(mockPortfolioData);

    renderWithClient(queryClient, <Portfolio />);

    // Wait specifically for an element that appears only *after* loading is complete
    await screen.findByText(/Your Portfolio/i);

    // Verify loading indicator is gone
    expect(screen.queryByText(/loading portfolio.../i)).not.toBeInTheDocument();

    expect(screen.getByText(/Your Portfolio/i)).toBeInTheDocument();
    // Use flexible function matchers for currency values to avoid issues with formatting/whitespace
    expect(screen.getByText((content) => content.startsWith('$') && content.includes('50000.50'))).toBeInTheDocument();
    expect(screen.getByText((content) => content.startsWith('$') && content.includes('54005.50'))).toBeInTheDocument();

    expect(screen.getByText(/AAPL/)).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument(); // Use exact string for quantity
    expect(screen.getByText((content) => content.startsWith('$') && content.includes('195.50'))).toBeInTheDocument(); // Current price
    expect(screen.getByText((content) => content.startsWith('$') && content.includes('1955.00'))).toBeInTheDocument(); // Current value

    expect(screen.getByText(/MSFT/)).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument(); // Use exact string for quantity
    expect(screen.getByText((content) => content.startsWith('$') && content.includes('410.00'))).toBeInTheDocument(); // Current price
    expect(screen.getByText((content) => content.startsWith('$') && content.includes('2050.00'))).toBeInTheDocument(); // Current value
  });

   test('renders error message if fetch fails', async () => {
       const errorMessage = 'Network Error';
       fetchPortfolio.mockRejectedValue(new Error(errorMessage));

       renderWithClient(queryClient, <Portfolio />);

       // Wait directly for the error message to appear
       const errorElement = await screen.findByText(new RegExp(`Error loading portfolio: ${errorMessage}`, 'i'));

       expect(errorElement).toBeInTheDocument();

       // We DON'T expect the loading message to be present in the error state
       // based on the component's conditional rendering logic for initial fetches.
   });

   test('renders "no stocks" message when holdings are empty', async () => {
       const mockPortfolioData = {
            data: { cash: 100000, holdings: [], totalValue: 100000 }
       };
       fetchPortfolio.mockResolvedValue(mockPortfolioData);

       renderWithClient(queryClient, <Portfolio />);

       // Wait for the main component structure to render after loading
       await screen.findByText(/Your Portfolio/i);

       expect(screen.queryByText(/loading portfolio.../i)).not.toBeInTheDocument();
       expect(screen.getByText(/You currently hold no stocks./i)).toBeInTheDocument();
   });

});