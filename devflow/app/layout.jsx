import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'DevFlow — Ultimate AI-First Developer Command Center',
  description: 'Manage your local AI conversations, code generations, and project progress in one private, browser-based workspace. 100% Privacy and Local-First.',
  keywords: ['AI development', 'prompt management', 'local-first', 'developer tools', 'AI workflow', 'privacy-focused'],
  verification: {
    google: 'dyitLt80YqDWnYz6__XIEwhrunV4U1-KU8ODTGzuK_s',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
