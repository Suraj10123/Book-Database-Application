import { render, screen } from '@testing-library/react';
import App from './App';
// Mock axios to avoid ESM import issues in tests
jest.mock('axios');

test('renders home page heading', () => {
  render(<App />);
  const heading = screen.getByRole('heading', { name: /All\s*Books/i });
  expect(heading).toBeInTheDocument();
});
