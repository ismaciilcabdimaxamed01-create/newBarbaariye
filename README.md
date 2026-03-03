# Barbaariye Admin Dashboard

A modern professional admin dashboard for academic/school management built with React.js.

## Tech Stack

- **React.js** (Functional Components + Hooks)
- **React Router DOM** - Client-side routing
- **Redux Toolkit** - State management
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Framer Motion** - Smooth animations
- Fully responsive with mobile sidebar drawer

## Features

- Clean, minimal UI with dark blue primary (#0f3d5e)
- Dark mode toggle with persistence
- Collapsible sidebar with smooth animations
- Responsive mobile drawer navigation
- Accounts management with table, search, pagination
- Tab navigation (Accounts, Subject, Academic Year)
- Load data simulation with mock data stored in Redux

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.js
│   │   ├── Navbar.js
│   │   └── Layout.js
│   └── ui/
│       ├── Button.js
│       ├── Card.js
│       ├── Table.js
│       └── Tabs.js
├── features/
│   ├── accounts/
│   │   ├── accountsSlice.js
│   │   └── AccountsPage.js
│   └── ui/
│       └── uiSlice.js
├── store/
│   └── store.js
├── App.js
├── main.jsx
└── index.css
```

## Routes

- `/` - Dashboard
- `/classes` - Classes (Accounts management)

## Usage

1. **Load Data**: Click "Load data" button to load mock account data into the table
2. **Search**: Use the search input to filter accounts by name, institution, or balance
3. **Pagination**: Navigate through pages with Previous/Next buttons
4. **Dark Mode**: Toggle dark mode via the sun/moon icon in the navbar
5. **Mobile**: Use the menu icon to open the sidebar drawer on small screens
