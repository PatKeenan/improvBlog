import { render, screen } from '@testing-library/react';
import { HomeContainer } from '@components-core/home';

describe('Home Page', () => {
  it('renders a heading', () => {
    render(<HomeContainer />);
    const greeting = screen.queryByText('welcome to the Improv App');
    expect(greeting);
  });
});
