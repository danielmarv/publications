"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { signOutUser } from "@/lib/actions/user.actions"

type Role = "guest" | "author" | "reviewer" | "approver" | "admin"

interface UserMenuProps {
  user: {
    fullName?: string | null
    email?: string | null
    avatar?: string | null
    role: Role
  }
}

export function UserMenu({ user }: UserMenuProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    await signOutUser()
    router.push("/sign-in")
  }
  const handleDashboard = async () => {
    await router.push("/dashboard")
  }

  const showDashboard = user.role !== "guest"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar || ""} alt={user.fullName || ""} />
            <AvatarFallback>{user.fullName?.[0]}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuItem asChild>
          <Link href="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/my-library">My Library</Link>
        </DropdownMenuItem>
        {showDashboard && (
          <DropdownMenuItem asChild>
            {/* <Link href="/dashboard">Dashboard</Link> */}
            <Button variant="ghost" className="cursor-pointer" onClick={handleDashboard}>
              Go to dashboard
            </Button>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleSignOut}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
