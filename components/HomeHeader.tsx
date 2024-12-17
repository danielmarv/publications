'use client';

import Link from 'next/link';
import { Search, User, Star } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function HomeHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between space-x-8">
        <div className="mr-4 flex items-center space-x-2">
          <Link href="/home" className="flex items-center space-x-2">
            <span className="text-xl font-bold">BU Publications</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center space-x-2">
          <div className="flex w-full max-w-2xl items-center space-x-2">
            <Input
              type="search"
              placeholder="Search..."
              className="h-9 md:w-[300px] lg:w-[500px]"
            />
            <Button type="submit" size="sm" className="h-9">
              <Search className="size-4" />
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Link href="/my-profile">
              <Button variant="ghost" size="lg">
                <User />
                My profile
              </Button>
            </Link>
            <Link href="/my-library">
              <Button variant="ghost" size="lg">
                <Star />
                My library
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
