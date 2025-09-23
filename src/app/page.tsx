import { headers } from "next/headers";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const Page = async () => {
  try {
    const { data: session } = await authClient.getSession({
      fetchOptions: {
        headers: await headers(),
      },
    });

    if (!session) {
      redirect("/auth/sign-in");
    }

    // Redirect authenticated users directly to meetings
    redirect("/meetings");
  } catch (error) {
    console.error("Auth error:", error);
    // Fallback to sign-in page if auth fails
    redirect("/auth/sign-in");
  }
};

export default Page;