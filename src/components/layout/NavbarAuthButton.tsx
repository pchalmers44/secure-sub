"use client";

import { signIn, signOut, useSession } from "next-auth/react";

import { Button } from "@/components/ui/Button";

export function NavbarAuthButton() {
  const { status } = useSession();

  return (
    <div className="flex items-center gap-2">
      {status === "authenticated" ? (
        <Button
          variant="outline"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Logout
        </Button>
      ) : (
        <Button variant="outline" size="sm" onClick={() => signIn()}>
          Login
        </Button>
      )}
    </div>
  );
}
