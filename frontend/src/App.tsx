function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            LogicLike Voting
          </h1>
          <p className="text-gray-600">
            Vote for your favorite ideas
          </p>
        </header>

        <main>
          <div className="text-center text-gray-500">
            Loading ideas...
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
