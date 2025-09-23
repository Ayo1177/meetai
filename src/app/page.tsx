import { headers } from "next/headers";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { HomeView } from "@/modules/home/ui/views/home-view";

const Page = async () => {
  const { data: session } = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  return <HomeView />;
};

export default Page;