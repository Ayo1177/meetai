import { headers } from "next/headers";
import { authClient } from "@/lib/auth-client";
import { HomeView } from "@/modules/home/ui/views/home-view";
import { redirect } from "next/navigation";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const Page = async () => {
  const { data: session } = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  return (
    <HomeView />
  );
};

export default Page;