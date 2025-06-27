import { Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./components/theme-provider"
import { Layout } from "./components/layout"
import { Dashboard } from "./pages/dashboard"
import { Users } from "./pages/users"
import { Questions } from "./pages/questions"
import { Analytics } from "./pages/analytics"
import { LiveActivity } from "./pages/live-activity"
import { Categories } from "./pages/categories"
import { Tournaments } from "./pages/tournaments"
import { Reports } from "./pages/reports"
import { BannedUsers } from "./pages/banned-users"
import { Settings } from "./pages/settings"
import { Toaster } from "./components/toaster"

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="quiz-admin-theme">
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/live" element={<LiveActivity />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/tournaments" element={<Tournaments />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/banned" element={<BannedUsers />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
      <Toaster />
    </ThemeProvider>
  )
}

export default App
