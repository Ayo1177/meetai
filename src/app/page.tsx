import { redirect } from "next/navigation";

const Page = async () => {
  // Temporarily disable auth to fix server error
  // TODO: Re-enable auth once server issues are resolved
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome to MeetAI</h1>
      <p>Your AI-powered meeting assistant is ready!</p>
      <div className="mt-4">
        <a href="/auth/sign-in" className="text-blue-600 hover:underline">Sign In</a>
        <span className="mx-2">|</span>
        <a href="/auth/sign-up" className="text-blue-600 hover:underline">Sign Up</a>
      </div>
    </div>
  );
};

export default Page;