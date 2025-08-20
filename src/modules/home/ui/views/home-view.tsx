"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export const HomeView = () => {
  const router = useRouter();
  const { data, isPending, error } = authClient.useSession();
  const session = data;

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/auth/sign-in");
    }
  }, [isPending, session, router]);

  if (isPending || !session) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col p-4 gap-y-4">
      <p>Logged in as {session?.user.name}!</p>
      <Button
        onClick={() =>
          authClient.signOut({
            fetchOptions: {
              onSuccess: async () => {
                await router.push("/auth/sign-in");
              },
            },
          })
        }
      >
        Sign Out
      </Button>
    </div>
  );
};