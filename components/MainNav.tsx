'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, FileText, Users, HomeIcon } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const mainNavItems = [
  {
    title: 'Home',
    href: '/home',
    icon: HomeIcon,
  },
  {
    title: 'Articles',
    href: '/articles',
    icon: FileText,
  },
  {
    title: 'Case law',
    href: '/case-law',
    icon: Calendar,
  },
  {
    title: 'Profiles',
    href: '/my-profile',
    icon: Users,
  },
];

const filterItems = [
  {
    title: 'Any time',
    items: [
      { title: 'Since 2024', href: '?year=2024' },
      { title: 'Since 2023', href: '?year=2023' },
      { title: 'Since 2020', href: '?year=2020' },
      { title: 'Custom range...', href: '?custom=true' },
    ],
  },
  {
    title: 'Sort by',
    items: [
      { title: 'Sort by relevance', href: '?sort=relevance' },
      { title: 'Sort by date', href: '?sort=date' },
    ],
  },
];

export function MainNav() {
  const pathname = usePathname();

  return (
      <Sidebar className='mt-[50px]'>
        <SidebarHeader>
          <SidebarMenu>
            {mainNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={pathname === item.href}>
                  <Link href={item.href}>
                    <item.icon className="mr-2 size-4" />
                    {item.title}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          {filterItems.map((group) => (
            <SidebarGroup key={group.title}>
              <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild>
                        <Link href={item.href}>{item.title}</Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
      </Sidebar>
  );
}
