import { headers } from "next/headers";
import { authClient } from "@/lib/auth-client";

import { SignUpView } from '@/modules/auth/ui/views/sign-up-view'

const Page = async () => {
  await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });
  /*
  if (!!session) {
    redirect("/");
  }*/

  return (
    <SignUpView />
  );
};

export default Page;
