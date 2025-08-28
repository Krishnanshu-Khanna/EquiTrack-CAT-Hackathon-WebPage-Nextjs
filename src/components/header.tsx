'use client';

import {
  Home,
  Package,
  Users,
  BrainCircuit,
  FileText,
  Menu,
  Truck,
  CircleUser,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', icon: Home, label: 'Dashboard' },
  { href: '/inventory', icon: Package, label: 'Inventory' },
  { href: '/operators', icon: Users, label: 'Operators' },
  { href: '/forecasting', icon: BrainCircuit, label: 'Forecasting' },
  { href: '/contracts', icon: FileText, label: 'Contracts', badge: '3' },
];

export function Header() {
  const pathname = usePathname();
  const pageTitle = navItems.find(item => item.href === pathname)?.label || 'Dashboard';

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            <Link
              href="#"
              className="flex items-center gap-2 text-lg font-semibold font-headline mb-4"
            >
              <Truck className="h-6 w-6 text-primary" />
              <span>EquiTrack</span>
            </Link>
            {navItems.map(({ href, icon: Icon, label, badge }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground',
                  { 'bg-muted text-foreground': pathname === href }
                )}
              >
                <Icon className="h-5 w-5" />
                {label}
                {badge && (
                  <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                    {badge}
                  </Badge>
                )}
              </Link>
            ))}
          </nav>
          <div className="mt-auto">
            <Card>
              <CardHeader>
                <CardTitle>Upgrade to Pro</CardTitle>
                <CardDescription>
                  Unlock all features and get unlimited access to our support
                  team.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button size="sm" className="w-full">
                  Upgrade
                </Button>
              </CardContent>
            </Card>
          </div>
        </SheetContent>
      </Sheet>

      <div className="w-full flex-1">
        <h1 className="font-semibold text-xl font-headline">{pageTitle}</h1>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <CircleUser className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
