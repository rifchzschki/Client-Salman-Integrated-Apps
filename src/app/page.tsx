import Link from 'next/link';

export default function HomePage() {
  return (
    <main>
      <h1>Welcome to My Website</h1>
      <p>This is the homepage</p>
      <nav>
        <ul>
          <li><Link href="/login">login</Link></li>
        </ul>
      </nav>
    </main>
  );
}