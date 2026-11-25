import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router'
import HealthPage from '@/components/pages/Health/HealthPage'
import HomeRoute from '@/components/pages/Home/HomeRoute'
import SigninRoute from '@/components/pages/Signin/SigninRoute'
import SignupRoute from '@/components/pages/Signup/SignupRoute'
import { Toaster } from '@/components/ui/sonner'
import { queryClient } from '@/lib/queryClient'

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeRoute />} />
          <Route path="/signup" element={<SignupRoute />} />
          <Route path="/signin" element={<SigninRoute />} />
          <Route path="/health" element={<HealthPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  )
}
