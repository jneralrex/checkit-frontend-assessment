import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EmptyState } from '@components/EmptyState';

describe('EmptyState Component', () => {
  it('renders default title and description', () => {
    render(<EmptyState />);
    expect(screen.getByText('No Pokemon found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your search or filters.')).toBeInTheDocument();
  });

  it('renders custom title and description', () => {
    const customTitle = 'Custom Title';
    const customDescription = 'Custom description text';
    
    render(
      <EmptyState
        title={customTitle}
        description={customDescription}
      />
    );
    
    expect(screen.getByText(customTitle)).toBeInTheDocument();
    expect(screen.getByText(customDescription)).toBeInTheDocument();
  });

  it('renders search icon emoji', () => {
    const { container } = render(<EmptyState />);
    const emoji = container.querySelector('.text-6xl');
    expect(emoji?.textContent).toBe('🔍');
  });

  it('has proper heading hierarchy', () => {
    render(<EmptyState />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
  });
});
