import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '@/styles/globals.css';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  title: 'Pokémon Explorer',
  description:
    'Browse and discover Pokémon with detailed information. Search, filter, and explore the complete Pokédex.',
  keywords: ['pokemon', 'pokedex', 'explorer', 'browse'],
  openGraph: {
    title: 'Pokémon Explorer',
    description: 'Browse and discover Pokémon with detailed information.',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'https://pokemon-explorer.example.com',
    type: 'website',
    images: [
      {
        url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
        width: 300,
        height: 300,
        alt: 'Pokémon Explorer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pokémon Explorer',
    description: 'Browse and discover Pokémon',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`} data-scroll-behavior="smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <div className="min-h-screen flex flex-col">
          <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
            <div className="container-custom py-6">
              <h1 className="text-3xl font-bold">Pokémon Explorer</h1>
              <p className="text-blue-100 text-sm mt-1">
                Discover and explore Pokémon from the official Pokédex
              </p>
            </div>
          </header>

          <main className="flex-1 container-custom py-8">{children}</main>

          <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-12">
            <div className="container-custom py-8 text-sm">
              <p>
                Pokémon data sourced from{' '}
                <a
                  href="https://pokeapi.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300"
                >
                  PokéAPI
                </a>
              </p>
              <p className="mt-2 text-xs text-slate-400">
                © {new Date().getFullYear()} Pokémon Explorer. Not affiliated with The Pokémon
                Company.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
