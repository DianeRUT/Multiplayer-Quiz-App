import { Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./components/theme-provider"
import { Layout } from "./components/layout"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { AuthProvider } from "./context/AuthContext"
import { LoginPage } from "./pages/auth/login"
import { Dashboard } from "./pages/dashboard"
import { Users } from "./pages/users"
import { Questions } from "./pages/questions"
import { Analytics } from "./pages/analytics"
import { LiveActivity } from "./pages/live-activity"
import { Categories } from "./pages/categories"
import { Quizzes } from "./pages/quizzes"
import { Tournaments } from "./pages/tournaments"
import { Battles } from "./pages/battles"
import { Reports } from "./pages/reports"
import { BannedUsers } from "./pages/banned-users"
import { Settings } from "./pages/settings"
import { Profile } from "./pages/profile"
import NotificationsPage from "./pages/notifications"
import { Toaster } from "./components/toaster"

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="quiz-admin-theme">
      <AuthProvider>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected admin routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/users" element={
            <ProtectedRoute>
              <Layout>
                <Users />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/questions" element={
            <ProtectedRoute>
              <Layout>
                <Questions />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/analytics" element={
            <ProtectedRoute>
              <Layout>
                <Analytics />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/live" element={
            <ProtectedRoute>
              <Layout>
                <LiveActivity />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/categories" element={
            <ProtectedRoute>
              <Layout>
                <Categories />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/quizzes" element={
            <ProtectedRoute>
              <Layout>
                <Quizzes />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/tournaments" element={
            <ProtectedRoute>
              <Layout>
                <Tournaments />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/battles" element={
            <ProtectedRoute>
              <Layout>
                <Battles />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/notifications" element={
            <ProtectedRoute>
              <Layout>
                <NotificationsPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute>
              <Layout>
                <Reports />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/banned" element={
            <ProtectedRoute>
              <Layout>
                <BannedUsers />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Layout>
                <Settings />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
