# Quiz Battle Admin Dashboard

A modern admin dashboard for managing the Quiz Battle multiplayer quiz application.

## Authentication System

This admin dashboard is **admin-only** and strictly restricts access to administrators:

### How It Works

1. **Admin-Only Login**: Only users with `role: 'ADMIN'` can access the dashboard
2. **Access Denied**: Regular users (`role: 'CREATOR'`) are rejected with a clear error message
3. **Mobile App Direction**: Regular users are directed to download the mobile app

### User Flow

#### For Admin Users:
1. Visit `/login`
2. Enter admin credentials
3. Automatically redirected to admin dashboard
4. Full access to all admin features

#### For Regular Users:
1. Visit `/login`
2. Enter regular user credentials
3. **Access denied** with message to use mobile app
4. Cannot access any admin features

### Routes

- `/login` - Admin login page (rejects non-admin users)
- `/` - Admin dashboard (protected, admin only)
- `/users`, `/questions`, `/analytics`, etc. - Admin features (protected, admin only)

### Security Features

- **Admin-Only Access**: Login rejects non-admin users immediately
- **Protected Routes**: All admin routes are wrapped with `ProtectedRoute` component
- **Role Validation**: Login checks user role and rejects non-admins
- **Token Management**: JWT tokens stored in localStorage
- **Auto Logout**: Expired tokens automatically redirect to login

### Backend Integration

The dashboard connects to your existing backend API (`MultiplayerQuizBe`) and uses the same authentication endpoints:

- `POST /api/auth/login` - User login (admin validation)
- All other API endpoints require admin authentication

### Mobile App Integration

Regular users are clearly directed to download the mobile app. The login page includes:

- Clear messaging that this is admin-only
- App Store and Google Play download links
- Helpful information about mobile app features

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:8000/api
```

## Features

- 🔐 Admin-only authentication system
- 🎨 Modern UI with dark mode support
- 📊 Real-time analytics dashboard
- 👥 User management
- ❓ Question and quiz management
- 📈 Live activity monitoring
- 🏆 Tournament management
- 📋 Reports and analytics
- ⚙️ Settings and configuration

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **UI**: Shadcn/ui + Tailwind CSS
- **State Management**: React Context
- **Routing**: React Router
- **HTTP Client**: Axios
- **Icons**: Lucide React 