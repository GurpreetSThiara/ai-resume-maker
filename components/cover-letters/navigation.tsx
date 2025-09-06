'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'My Cover Letters', href: '/cover-letter' },
  { name: 'Create New', href: '/cover-letter/editor/new' },
  { name: 'Templates', href: '/cover-letter/templates' },
];

export function CoverLetterNavigation() {
  const pathname = usePathname();

  return (
    <nav className="flex space-x-4 border-b mb-6">
      {navigation.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={cn(
            'px-3 py-2 text-sm font-medium transition-colors hover:text-primary',
            pathname === item.href
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-primary'
          )}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}
