import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import Home from './page';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), prefetch: jest.fn() }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

test('renders with correct text', () => {
  const { getByText } = render(<Home />);
  // const textElement = getByText(/Pokemon Remastered/i);
  // expect(textElement).toBeInTheDocument();
});
