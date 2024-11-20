import '@testing-library/jest-dom'; // Adds custom matchers for testing-library
import { configure } from '@testing-library/react';

configure({ testIdAttribute: 'data-testid' }); 
