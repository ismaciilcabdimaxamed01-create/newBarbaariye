# Barbaariye Admin Dashboard

A modern professional admin dashboard for academic/school management built with React.js.

**Repository:** [github.com/ismaciilcabdimaxamed01-create/newBarbaariye](https://github.com/ismaciilcabdimaxamed01-create/newBarbaariye)

## Tech Stack

- **React.js** (Functional Components + Hooks)
- **React Router DOM** – Client-side routing
- **Redux Toolkit** – State management
- **Tailwind CSS** – Styling
- **Lucide React** – Icons
- **Framer Motion** – Smooth animations
- **Vite** – Build tool
- Fully responsive with mobile sidebar drawer

## Features

- Clean, minimal UI with dark blue primary (#0B3C5D / #0f3d5e)
- Dark mode toggle with persistence
- Collapsible sidebar with smooth animations and flyout submenu
- Responsive mobile drawer navigation
- **Login** – Protected routes; redirect to dashboard when authenticated
- **Dashboard** – Summary cards and quick links
- **Academic Office**
  - Academic Setup (Class, Class Formaster, Subjects, Subject Class, Level, Academic Year)
  - Academic Transfer (Branch, Academic Transfer, Class Transfer)
  - Academic Saylapus
  - Lesson Plan (Lesson Activity Mark, Lesson Activity Results)
- **Students Office** – Students, Responsible, Student State, Bus, Update School, Student Info
- **User Privilege** – Menu-based privilege management
- Tab navigation with load buttons and CRUD modals
- Data tables with search, sort, pagination (DataTableCard)
- Backend API integration (services/api, slices/dataSlice)

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
│   │   ├── Sidebar.jsx
│   │   ├── Navbar.jsx
│   │   └── Layout.jsx
│   ├── ui/
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Tabs.jsx
│   │   ├── Modal.jsx
│   │   ├── Input.jsx
│   │   ├── Select2.jsx
│   │   ├── SearchInput.jsx
│   │   ├── EmptyState.jsx
│   │   ├── ErrorAlert.jsx
│   │   └── ActionButton.jsx
│   ├── DataTableCard.jsx
│   └── StatValue.jsx
├── config/
│   ├── menuConfig.jsx
│   └── crudConfig.jsx
├── modals/
│   └── CrudModal.jsx
├── store/
│   └── store.jsx
├── slices/
│   ├── dataSlice.jsx
│   └── uiSlice.jsx
├── services/
│   └── api.jsx
├── utils/
│   ├── tabModalUtils.js
│   ├── swal.js
│   └── crud.js
├── utility/
│   ├── Dashboard.jsx
│   ├── LoginPage.jsx
│   ├── UserPrivilegePage.jsx
│   ├── EntityTab.jsx
│   ├── index.js
│   └── pages/
│       ├── academicfolder/
│       │   ├── AcademicSetup.jsx
│       │   ├── academicSetupTabs.jsx
│       │   ├── academicTransferTabs.jsx
│       │   ├── academicSaylapusTabs.jsx
│       │   └── LessonPlan.jsx
│       └── studentFolder/
│           └── studentofficeTabs.jsx
├── App.jsx
├── main.jsx
└── index.css
```

## Routes

| Path | Description |
|------|-------------|
| `/` | Dashboard |
| `/login` | Login (public) |
| `/AcademicSetup` | Academic Setup tabs |
| `/AcademicTransfer` | Academic Transfer tabs |
| `/AcademicSaylapus` | Academic Saylapus tabs |
| `/LessonPlan` | Lesson Plan tabs |
| `/StudentsOffice` | Students Office (Students, Responsible, etc.) |
| `/user-privilege` | User privilege management |
| `/StudentSetup`, `/frontend/classes`, etc. | Legacy routes → AcademicSetup |

## Usage

1. **Login**: Go to `/login`; after login you are redirected to the dashboard.
2. **Sidebar**: Use Academic Office / Students Office to open submenus and tabbed pages.
3. **Tabs**: Each section has tabs; use "Load" or "Add new" buttons to load data or open CRUD modals.
4. **Dark Mode**: Toggle via the sun/moon icon in the navbar.
5. **Mobile**: Use the menu icon to open the sidebar drawer.

## Backend

The app expects a backend API (see `src/services/api.jsx`). Configure base URL and endpoints as needed for your environment.

## About

Barbaariye Admin Dashboard – academic and school management.
