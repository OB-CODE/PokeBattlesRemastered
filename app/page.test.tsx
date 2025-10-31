import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import Home from './page';

test('renders with correct text', () => {
  const { getByText } = render(<Home />);
  const textElement = getByText(/Pokemon Remastered/i);
  expect(textElement).toBeInTheDocument();
});
