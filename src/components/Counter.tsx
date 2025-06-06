import { useState } from 'react';

interface CounterProps {
  initialValue?: number;
  step?: number;
}

export const Counter: React.FC<CounterProps> = ({
  initialValue = 0,
  step = 1,
}) => {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount((prev) => prev + step);
  const decrement = () => setCount((prev) => prev - step);
  const reset = () => setCount(initialValue);

  return (
    <div>
      <h2>Counter: {count}</h2>
      <button onClick={increment} data-testid="increment">
        +{step}
      </button>
      <button onClick={decrement} data-testid="decrement">
        -{step}
      </button>
      <button onClick={reset} data-testid="reset">
        Reset
      </button>
    </div>
  );
};

export default Counter;
