import Link from "next/link"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserMenu } from "./user-menu"
import { getCurrentUser } from "@/lib/actions/user.actions"

export async function HomeHeader() {
  const currentUser = await getCurrentUser()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between space-x-4">
        <Link href="/home" className="flex items-center space-x-2">
          <span className="text-xl font-bold">BU Publications</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <form className="flex w-full max-w-sm items-center space-x-2" action="/search">
            <Input
              type="search"
              name="q"
              placeholder="Search..."
              className="h-9 w-[300px] lg:w-[300px]"
              aria-label="Search publications"
            />
            <Button type="submit" size="sm" className="h-9" aria-label="Submit search">
              <Search className="h-4 w-4" />
            </Button>
          </form>
          <nav className="flex items-center space-x-2">
            {currentUser ? (
              <UserMenu user={currentUser} />
            ) : (
              <>
                <Link href="/sign-in">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

