import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the app component', () => {
  render(<App />);
  const linkElement = screen.getByText(/Welcome to the Internship Management System/i);
  expect(linkElement).toBeInTheDocument();
});
