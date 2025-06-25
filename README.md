# 🎮 Multiplayer Quiz Battle App

A real-time trivia game that allows users to challenge friends or random opponents in engaging quiz battles. Built with React Native for mobile and React for the admin dashboard.

## 🚀 Features

### Mobile App
- **Real-time 1v1 Battles** - Live competitive gameplay
- **Multiple Categories** - Science, History, Geography, Pop Culture, Sports
- **Social Features** - Friends, chat, leaderboards
- **Power-ups** - Extra time, hints, skip questions
- **Achievements** - Badges and milestones
- **Beautiful UI** - Modern design with animations

### Admin Dashboard
- **Question Management** - Add, edit, delete questions
- **User Management** - View and manage users
- **Analytics** - Real-time game statistics
- **Content Moderation** - Review and approve content
- **System Monitoring** - Server health and performance

## 🛠️ Tech Stack

### Mobile App
- **React Native** + **Expo**
- **TypeScript**
- **Redux Toolkit** (State Management)
- **Socket.io Client** (Real-time)
- **React Navigation**
- **React Native Elements** (UI)

### Admin Dashboard
- **React** + **TypeScript**
- **Material-UI** (Components)
- **Redux Toolkit** (State Management)
- **Chart.js** (Analytics)
- **React Router** (Navigation)

### Backend
- **Node.js** + **Express**
- **Socket.io** (Real-time)
- **MongoDB** (Database)
- **Redis** (Caching)
- **JWT** (Authentication)

## 📁 Project Structure

```
Multiplayer Quiz App/
├── 📱 mobile-app/                 # React Native App
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   ├── screens/               # App screens
│   │   ├── navigation/            # Navigation setup
│   │   ├── services/              # API calls and utilities
│   │   ├── store/                 # State management
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── utils/                 # Helper functions
│   │   ├── types/                 # TypeScript definitions
│   │   ├── constants/             # App constants
│   │   └── assets/                # Images, fonts, sounds
│   └── App.tsx
│
├── 💻 admin-dashboard/            # React Web Admin Panel
│   ├── src/
│   │   ├── components/            # Admin UI components
│   │   ├── pages/                 # Admin pages
│   │   ├── services/              # Admin API calls
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── store/                 # State management
│   │   ├── utils/                 # Admin utilities
│   │   ├── types/                 # TypeScript definitions
│   │   └── assets/                # Admin assets
│   └── package.json
│
└── 🖥️ backend/                    # Node.js Server (Separate Repo)
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Expo CLI
- Git

### Mobile App Setup
```bash
cd mobile-app
npm install
npx expo start
```

### Admin Dashboard Setup
```bash
cd admin-dashboard
npm install
npm start
```

## 📱 Mobile App Development

### Install Dependencies
```bash
cd mobile-app
npm install @reduxjs/toolkit react-redux
npm install @react-navigation/native @react-navigation/stack
npm install socket.io-client
npm install react-native-elements
npm install lottie-react-native
npm install @react-native-async-storage/async-storage
```

### Run on Device/Simulator
```bash
npx expo start
# Scan QR code with Expo Go app
# Or press 'i' for iOS simulator
# Or press 'a' for Android emulator
```

## 💻 Admin Dashboard Development

### Install Dependencies
```bash
cd admin-dashboard
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
npm install react-router-dom
npm install @reduxjs/toolkit react-redux
npm install axios
npm install recharts
npm install react-query
npm install formik yup
```

### Run Development Server
```bash
npm start
# Open http://localhost:3000
```

## 🔧 Development Workflow

### 1. Feature Development
- Create feature branch: `git checkout -b feature/feature-name`
- Develop in respective folders (`mobile-app/` or `admin-dashboard/`)
- Test thoroughly
- Commit changes: `git commit -m "feat: add feature description"`

### 2. Code Organization
- **Components**: Reusable UI elements
- **Screens/Pages**: Main app views
- **Services**: API calls and external integrations
- **Store**: State management
- **Types**: TypeScript definitions
- **Utils**: Helper functions

### 3. Testing
- Unit tests for utilities and services
- Component testing for UI elements
- Integration testing for features
- E2E testing for critical user flows

## 📊 API Integration

### Backend Connection
The mobile app and admin dashboard connect to the backend via:
- **REST API**: For CRUD operations
- **Socket.io**: For real-time features
- **JWT**: For authentication

### Environment Variables
Create `.env` files in both `mobile-app/` and `admin-dashboard/`:
```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_SOCKET_URL=http://localhost:3001
```

## 🎨 UI/UX Guidelines

### Design System
- **Colors**: Consistent color palette
- **Typography**: Readable fonts and sizes
- **Spacing**: Consistent margins and padding
- **Animations**: Smooth transitions and micro-interactions

### Mobile App
- **Responsive**: Works on all screen sizes
- **Touch-friendly**: Appropriate button sizes
- **Accessible**: High contrast and readable text

### Admin Dashboard
- **Professional**: Clean and organized interface
- **Efficient**: Quick access to common actions
- **Responsive**: Works on desktop and tablet

## 🚀 Deployment

### Mobile App
- **Expo Build**: `expo build:android` / `expo build:ios`
- **App Store**: Submit to Apple App Store
- **Play Store**: Submit to Google Play Store

### Admin Dashboard
- **Build**: `npm run build`
- **Deploy**: Deploy to Vercel, Netlify, or AWS

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Happy Coding! 🎮✨**
