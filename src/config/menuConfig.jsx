import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  Database,
  Plus,
  DollarSign,
  Users,
  ClipboardList,
  BookMarked,
  UserPlus,
} from 'lucide-react';

export const defaultMenuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  {
    id: 'academic',
    label: 'Academic',
    icon: BookOpen,
    children: [
      {
        id: 'classes',
        label: 'Classes',
        icon: BookMarked,
        path: '/classes',
        tabs: [
          {
            id: 'accounts',
            label: 'Accounts',
            entityKey: 'accounts',
            modalKey: 'account',
            icon: Database,
            queryName: 'accounts',
            loadButtons: [
              { id: 'accounts', label: 'Accounts', icon: Database },
              { id: 'addNew', label: 'Add new', icon: Plus, modalKey: 'account' },
            ],
          },
          { id: 'subject', label: 'Subject', entityKey: 'subjects', modalKey: 'subject', icon: BookOpen, queryName: 'subjects' },
          { id: 'student', label: 'Student', entityKey: 'students', modalKey: 'student', icon: GraduationCap, queryName: 'students' },
          { id: 'academicYear', label: 'Academic Year', queryName: null },
        ],
      },  
    ],
  },
  {
    id: 'students',
    label: 'students',
    icon: GraduationCap,
    children: [
      {
        id: 'students register',
        label: 'students register',
        icon: UserPlus,
        path: '/student_register',
        tabs: [
          {
            id: 'student_info',
            label: 'student info',
            entityKey: 'student_info',  
            queryName: 'student_info',
            loadButtons: [
              { id: 'student_info', label: 'Load student info', icon: Database },
              { id: 'addNew', label: 'Add new', icon: Plus, modalKey: 'mdl_student_info' },
            ],
          }, 
        ],
      },  
    ],
  },
  {
    id: 'Finance',
    label: 'Finance',
    icon: DollarSign,
    children: [
      {
        id: 'people',
        label: 'people section',
        icon: Users,
        path: '/people_section',
        tabs: [
          {
            id: 'people_info',
            label: 'people tab',
            entityKey: 'people_tab',   
            loadButtons: [
              { id: 'people_info', label: 'Load people info', icon: Database },
              { id: 'addNew', label: 'Add new', icon: Plus, modalKey: 'mdl_people_infos' }, 
            ],
          }, 
        ],
      },  
    ],
  },
  {
    id: 'HRM',
    label: 'HRM',
    icon: Users,
    children: [
      {
        id: 'people',
        label: 'people section',
        icon: Users,
        path: '/people_section',
        tabs: [
          {
            id: 'people_info',
            label: 'people tab',
            entityKey: 'people_tab',   
            loadButtons: [
              { id: 'people_info', label: 'Load people info', icon: Database },
              { id: 'addNew', label: 'Add new', icon: Plus, modalKey: 'mdl_people_infos' }, 
            ],
          }, 
        ],
      },  
    ],
  },
  {
    id: 'Attendents',
    label: 'Attendence',
    icon: ClipboardList,
    children: [
      {
        id: 'Studenyt',
        label: 'Student section',
        icon: ClipboardList,
        path: '/student_attendence',
        tabs: [
          {
            id: 'people_info',
            label: 'student att',
            entityKey: 'people_tab',   
            loadButtons: [
              { id: 'people_info', label: 'Load people info', icon: Database },
              { id: 'addNew', label: 'Add new', icon: Plus, modalKey: 'mdl_people_infos' }, 
              { id: 'addNew', label: 'Add new', icon: Plus, modalKey: 'mdl_people_infos' }, 
            ],
          }, 
        ],
      },  
    ],
  },
];

/** Walks menu tree, finds item by path, returns its tabs */
function findItemByPath(items, path) {
  for (const item of items) {
    if (item.path === path) return item;
    if (item.children) {
      const found = findItemByPath(item.children, path);
      if (found) return found;
    }
  }
  return null;
}

/** Parent menu ids that contain a child with this path (so they should be open) */
export function getOpenMenuIdsForPath(items, path) {
  const open = {};
  for (const item of items) {
    if (item.children?.some((c) => c.path === path)) open[item.id] = true;
  }
  return open;
}

/** Get tabs for a sidebar link by path */
export function getTabsForPath(path) {
  const item = findItemByPath(defaultMenuItems, path);
  return item?.tabs ?? [];
}
