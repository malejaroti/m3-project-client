// AppShell.tsx
import type { ReactNode } from 'react';

type Props = { children: ReactNode };

export function AppShell({ children }: Props) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="hidden w-64 bg-white dark:bg-gray-800 md:flex md:flex-col shadow-lg">
        <nav className="flex-1 p-4">
          {/* Navigation links */}
          <a
            href="/"
            className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Dashboard
          </a>
          <a
            href="/settings"
            className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Settings
          </a>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-gray-800 shadow">
          <h1 className="font-bold text-lg text-gray-800 dark:text-gray-100">
            My App
          </h1>
          {/* user menu, theme toggle, etc. */}
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

export default AppShell;
