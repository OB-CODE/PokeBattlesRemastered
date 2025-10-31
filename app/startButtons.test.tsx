import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, getByTestId } from '@testing-library/react';
import StartButtons from './StartButtons';
import { describe } from 'node:test';

describe('Buttons required to start the game rendered', () => {
  test('renders the start game button', () => {
    const { getByText, queryByText, getByTestId } = render(<StartButtons />);
    const startButtonText = getByText(/start/i);
    expect(startButtonText).toBeInTheDocument();
  });

  test('The start game button produces the modal text.', () => {
    const { getByText, queryByText, getByTestId } = render(<StartButtons />);
    const startButtonText = getByText(/start/i);
    expect(startButtonText).toBeInTheDocument();

    // Verify the modal content is not rendered
    const startModalMessage = queryByText(/Sign in to save your progress/i);
    expect(startModalMessage).not.toBeInTheDocument();

    // Get the start button by its data-testid attribute
    const startButton = getByTestId('startButton');

    // Click the start button
    fireEvent.click(startButton);
    // Verify the modal content IS rendered

    // Re-query for the modal content after the click
    const modalContentAfterClick = queryByText(/Sign in to save your progress/);
    expect(modalContentAfterClick).toBeInTheDocument();
  });

  test('renders the How to game button', () => {
    const { getByText } = render(<StartButtons />);
    const howTo = getByText(/How to/i);
    expect(howTo).toBeInTheDocument();
  });
});

test('The How to game button produces the how to descriptive text modal text.', () => {
  const { getByText, queryByText, getByTestId } = render(<StartButtons />);
  const howToButtonText = getByText(/How to/i);
  expect(howToButtonText).toBeInTheDocument();

  // Verify the modal content is not rendered
  const howToModalText = queryByText(/HOW TO PLAY/i);
  expect(howToModalText).not.toBeInTheDocument();

  // Get the start button by its data-testid attribute
  const howToButton = getByTestId('howToButton');

  // Click the start button
  fireEvent.click(howToButton);
  // Verify the modal content IS rendered

  // Re-query for the modal content after the click
  const modalContentAfterClick = queryByText(/HOW TO PLAY/i);
  expect(modalContentAfterClick).toBeInTheDocument();
});
