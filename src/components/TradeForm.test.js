import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TradeForm from './TradeForm';

// Mock React Query hooks used within TradeForm
const mockMutate = jest.fn();
const mockInvalidateQueries = jest.fn();
jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'), // Preserve non-mocked functionality
  useQueryClient: () => ({
    invalidateQueries: mockInvalidateQueries,
  }),
  useMutation: jest.fn(() => ({ // Mock useMutation return value
    mutate: mockMutate,
    isPending: false,
  })),
  useQuery: jest.fn((options) => { // Mock useQuery return value
     // Provide specific mock data for the 'stocks' query
     if (options.queryKey.includes('stocks')) {
        return {
            data: [
                { symbol: 'AAPL', name: 'Apple Inc.', price: 200 },
                { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 180 },
            ],
            isLoading: false,
            error: null,
        };
     }
     // Default mock for any other potential queries
     return { data: undefined, isLoading: false, error: null };
  }),
}));

// Helper to wrap component with QueryClientProvider for testing
const renderWithClient = (client, ui) => {
  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>
  );
};

describe('TradeForm Component', () => {
  let queryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
    // Clear mock call history before each test
    mockMutate.mockClear();
    mockInvalidateQueries.mockClear();
    jest.clearAllMocks();
  });

  test('renders the form elements correctly', () => {
    renderWithClient(queryClient, <TradeForm />);

    expect(screen.getByRole('combobox', { name: /stock/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /action/i })).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: /quantity/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit trade/i })).toBeInTheDocument();
  });

   test('populates stock dropdown from mocked useQuery data', async () => {
      renderWithClient(queryClient, <TradeForm />);
      // Check if options generated from mocked data are present
      expect(await screen.findByRole('option', { name: /AAPL \(Apple Inc.\) - \$200.00/i })).toBeInTheDocument();
      expect(await screen.findByRole('option', { name: /GOOGL \(Alphabet Inc.\) - \$180.00/i })).toBeInTheDocument();
   });

  test('updates state on input change', async () => {
     renderWithClient(queryClient, <TradeForm />);
     const user = userEvent.setup();

     const stockSelect = screen.getByRole('combobox', { name: /stock/i });
     const quantityInput = screen.getByRole('spinbutton', { name: /quantity/i });
     const actionSelect = screen.getByRole('combobox', { name: /action/i });

     await user.selectOptions(stockSelect, screen.getByRole('option', { name: /AAPL/i }));
     expect(stockSelect).toHaveValue('AAPL');

     await user.selectOptions(actionSelect, screen.getByRole('option', { name: /sell/i }));
     expect(actionSelect).toHaveValue('sell');

     await user.type(quantityInput, '15');
     expect(quantityInput).toHaveValue(15);
  });

  test('calls mutation function on valid form submission', async () => {
    renderWithClient(queryClient, <TradeForm />);
    const user = userEvent.setup();

    // Fill the form with valid data
    await user.selectOptions(screen.getByRole('combobox', { name: /stock/i }), 'AAPL');
    await user.selectOptions(screen.getByRole('combobox', { name: /action/i }), 'buy');
    await user.type(screen.getByRole('spinbutton', { name: /quantity/i }), '5');

    await user.click(screen.getByRole('button', { name: /submit trade/i }));

    // Verify the mutation function was called with the correct payload
    expect(mockMutate).toHaveBeenCalledTimes(1);
    expect(mockMutate).toHaveBeenCalledWith({
      symbol: 'AAPL',
      quantity: 5,
      side: 'buy',
    });
  });

   test('displays client-side validation error for missing stock', async () => {
       renderWithClient(queryClient, <TradeForm />);
       const user = userEvent.setup();

       // Only fill quantity, leave stock unselected
       await user.type(screen.getByRole('spinbutton', { name: /quantity/i }), '10');
       await user.click(screen.getByRole('button', { name: /submit trade/i }));

       expect(mockMutate).not.toHaveBeenCalled();
       expect(screen.getByText(/Please select a stock./i)).toBeInTheDocument();
   });

    test('displays client-side validation error for invalid quantity', async () => {
       renderWithClient(queryClient, <TradeForm />);
       const user = userEvent.setup();

       await user.selectOptions(screen.getByRole('combobox', { name: /stock/i }), 'GOOGL');
       await user.type(screen.getByRole('spinbutton', { name: /quantity/i }), '0'); // Invalid quantity
       await user.click(screen.getByRole('button', { name: /submit trade/i }));

       expect(mockMutate).not.toHaveBeenCalled();
       expect(screen.getByText(/Please enter a valid quantity greater than 0./i)).toBeInTheDocument();
    });
});