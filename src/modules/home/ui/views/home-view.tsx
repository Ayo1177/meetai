const HomeView = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to MeetAI</h1>
        <p className="text-gray-600 text-lg">
          Your AI-powered meeting assistant for smarter, more productive meetings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="p-6 border rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Start Meeting</h3>
          <p className="text-gray-600 mb-4">Create a new AI-powered meeting session</p>
          <a href="/meetings" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Start New Meeting
          </a>
        </div>

        <div className="p-6 border rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Manage Agents</h3>
          <p className="text-gray-600 mb-4">Configure and manage your AI agents</p>
          <a href="/agents" className="inline-block border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50">
            View Agents
          </a>
        </div>

        <div className="p-6 border rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Meeting History</h3>
          <p className="text-gray-600 mb-4">Review past meetings and transcripts</p>
          <a href="/meetings" className="inline-block border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50">
            View History
          </a>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
        <div className="p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Quick Overview</h3>
          <p className="text-gray-600 mb-4">Here&apos;s what&apos;s happening with your meetings and agents</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">0</p>
              <p className="text-sm text-gray-600">Active Agents</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">0</p>
              <p className="text-sm text-gray-600">Meetings Today</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">0</p>
              <p className="text-sm text-gray-600">Total Meetings</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Getting Started</h3>
        <p className="text-gray-600 mb-4">New to MeetAI? Here&apos;s how to get the most out of your experience</p>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">1</div>
            <div>
              <p className="font-medium">Create your first AI agent</p>
              <p className="text-sm text-gray-600">Configure an AI agent to assist with your meetings</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">2</div>
            <div>
              <p className="font-medium">Start a meeting</p>
              <p className="text-sm text-gray-600">Launch a new meeting with AI assistance</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">3</div>
            <div>
              <p className="font-medium">Review and analyze</p>
              <p className="text-sm text-gray-600">Check transcripts and insights from your meetings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { HomeView };
