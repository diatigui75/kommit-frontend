import { QueryClientProvider } from '@tanstack/react-query'
import HomePage from '@/components/pages/Home/HomePage'
import { queryClient } from '@/lib/queryClient'

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HomePage />
    </QueryClientProvider>
  )
}
