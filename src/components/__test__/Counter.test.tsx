import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Counter } from '../Counter';

describe('Counter Component', () => {
  it('renders with default initial value', () => {
    render(<Counter />);
    expect(screen.getByText('Counter: 0')).toBeInTheDocument();
  });

  it('renders with custom initial value', () => {
    render(<Counter initialValue={10} />);
    expect(screen.getByText('Counter: 10')).toBeInTheDocument();
  });

  it('increments counter when increment button is clicked', async () => {
    const user = userEvent.setup();
    render(<Counter />);

    const incrementBtn = screen.getByTestId('increment');
    await user.click(incrementBtn);

    expect(screen.getByText('Counter: 1')).toBeInTheDocument();
  });

  it('decrements counter when decrement button is clicked', async () => {
    const user = userEvent.setup();
    render(<Counter initialValue={5} />);

    const decrementBtn = screen.getByTestId('decrement');
    await user.click(decrementBtn);

    expect(screen.getByText('Counter: 4')).toBeInTheDocument();
  });

  it('resets counter to initial value when reset button is clicked', async () => {
    const user = userEvent.setup();
    render(<Counter initialValue={10} />);

    // Change the counter value first
    const incrementBtn = screen.getByTestId('increment');
    await user.click(incrementBtn);
    expect(screen.getByText('Counter: 11')).toBeInTheDocument();

    // Then reset
    const resetBtn = screen.getByTestId('reset');
    await user.click(resetBtn);
    expect(screen.getByText('Counter: 10')).toBeInTheDocument();
  });

  it('uses custom step value', async () => {
    const user = userEvent.setup();
    render(<Counter step={5} />);

    const incrementBtn = screen.getByTestId('increment');
    await user.click(incrementBtn);

    expect(screen.getByText('Counter: 5')).toBeInTheDocument();
  });

  it('displays correct button labels with custom step', () => {
    render(<Counter step={3} />);

    expect(screen.getByText('+3')).toBeInTheDocument();
    expect(screen.getByText('-3')).toBeInTheDocument();
  });

  // Example of testing with fireEvent (alternative to userEvent)
  it('handles multiple clicks correctly (fireEvent example)', () => {
    render(<Counter />);

    const incrementBtn = screen.getByTestId('increment');

    fireEvent.click(incrementBtn);
    fireEvent.click(incrementBtn);
    fireEvent.click(incrementBtn);

    expect(screen.getByText('Counter: 3')).toBeInTheDocument();
  });
});
