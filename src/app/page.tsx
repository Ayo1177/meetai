import { headers } from "next/headers";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

export default async function HomePage() {
  // Check if user is authenticated
  try {
    const { data: session } = await authClient.getSession({
      fetchOptions: {
        headers: await headers(),
      },
    });

    if (session) {
      // If authenticated, redirect to agents page (dashboard)
      redirect("/agents");
    }
  } catch (error) {
    // If auth fails, show the landing page
    console.log("Auth check failed, showing landing page:", error);
  }

  // Show landing page for unauthenticated users
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Meet.AI
        </h1>
        <p className="text-gray-600 mb-8">
          AI-powered meeting assistant
        </p>
        <div className="space-x-4">
          <a 
            href="/auth/sign-in" 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Sign In
          </a>
          <a 
            href="/auth/sign-up" 
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300"
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}
