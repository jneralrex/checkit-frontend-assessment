import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PokemonCard } from '@components/PokemonCard';

describe('PokemonCard Component', () => {
  const mockPokemon = {
    id: 25,
    name: 'pikachu',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
    types: ['electric'],
  };

  it('renders pokemon name correctly', () => {
    render(<PokemonCard pokemon={mockPokemon} />);
    const heading = screen.getByText('pikachu');
    expect(heading).toBeInTheDocument();
  });

  it('renders pokemon id formatted correctly', () => {
    render(<PokemonCard pokemon={mockPokemon} />);
    const id = screen.getByText('#025');
    expect(id).toBeInTheDocument();
  });

  it('renders pokemon types', () => {
    render(<PokemonCard pokemon={mockPokemon} />);
    const type = screen.getByText('electric');
    expect(type).toBeInTheDocument();
  });

  it('renders link to pokemon detail page', () => {
    const { container } = render(<PokemonCard pokemon={mockPokemon} />);
    const link = container.querySelector('a');
    expect(link).toHaveAttribute('href', '/pokemon/25');
  });

  it('handles pokemon with multiple types', () => {
    const pokemonWithMultipleTypes = {
      ...mockPokemon,
      types: ['electric', 'mouse'],
    };
    render(<PokemonCard pokemon={pokemonWithMultipleTypes} />);
    expect(screen.getByText('electric')).toBeInTheDocument();
    expect(screen.getByText('mouse')).toBeInTheDocument();
  });
});
