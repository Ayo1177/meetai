import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { authClient } from "@/lib/auth-client";
import { SignInView } from '@/modules/auth/ui/views/sign-in-view'



const Page = async () => {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });
  console.log("SESSION:", session);
  if (session?.data) {
    redirect("/");
  }

  return <SignInView />;
};

export default Page;
