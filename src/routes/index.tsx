import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <main>
      <h1>Home Pet Home 🐶</h1>

      <a href="/login">Ir al login</a>
    </main>
  )
}