import React from 'react'

interface Props {
    children: React.ReactNode
};

const layout = ({children}: Props) => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold">Meet.AI Dashboard</h1>
        </div>
      </header>
      <main className="container mx-auto">
        {children}
      </main>
    </div>
  )
}   

export default layout
