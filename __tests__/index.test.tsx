import { render, screen } from '@testing-library/react';
import { PostCreateContainer } from '@components-core/posts/post-create-container';

describe('Home Page', () => {
  it('renders a heading', () => {
    render(<PostCreateContainer />);

    const greeting = screen.queryByText('Create New Post');

    expect(greeting);
  });
});
