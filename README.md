# Office Management System

A comprehensive web-based admin panel for managing organizations, users, projects, and documents. Built with React, Vite, and Tailwind CSS.

## Features

### 🔐 Authentication System
- Secure login with phone number and PIN
- API integration with backend authentication service
- JWT token management with automatic refresh
- Protected routes requiring authentication
- User session management with localStorage
- Automatic redirect to login for unauthenticated users
- User profile display in sidebar with role badges
- Logout functionality

**API Endpoint:** `http://10.0.100.19:9904/api/v1/auth/login`

**Demo Credentials:**
- Phone: `+8562079991636`
- PIN: `112233`

**Supported Roles:**
- SuperAdmin: Full system access
- Admin: Administrative access
- AdminOrganization: Organization-specific access

### 🏢 Organization Management
- Create, edit, and delete organizations
- Track organization details (contact info, industry, employee count)
- Search and filter organizations
- Status management (Active/Inactive)

### 👥 User Management
- Complete user CRUD operations
- Role-based access control (Admin, Manager, Employee, Guest)
- Department and organization assignment
- User status tracking
- Password management with visibility toggle

### 📋 Project Management
- Project creation and tracking
- Team assignment and management
- Progress monitoring with visual progress bars
- Budget tracking and expense monitoring
- Priority and status management
- Project timeline management

### 📄 Document Management
- Document upload and organization
- File type recognition with appropriate icons
- Category-based organization
- Tagging system for easy search
- Version control tracking
- Grid and list view modes
- Document starring and sharing

### 📊 Dashboard
- Overview statistics and metrics
- Recent activity feed
- Quick access to all modules
- Visual data representation

## Technology Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **Package Manager**: npm

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. **Clone or download the project files**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/
│   ├── Sidebar.jsx          # Navigation sidebar
│   ├── ProtectedRoute.jsx   # Route protection component
│   └── LoadingSpinner.jsx   # Loading spinner component
├── contexts/
│   └── AuthContext.jsx      # Authentication context
├── utils/
│   └── api.js              # API client utilities
├── pages/
│   ├── Login.jsx            # Login page
│   ├── Dashboard.jsx        # Main dashboard
│   ├── OrganizationManagement.jsx
│   ├── UserManagement.jsx
│   ├── ProjectManagement.jsx
│   └── DocumentManagement.jsx
├── App.jsx                  # Main app component
├── main.jsx                 # Entry point
└── index.css               # Global styles
```

## Features Overview

### Dashboard
- Real-time statistics for all modules
- Recent activity tracking
- Quick navigation to all sections

### Organization Management
- **Grid Layout**: Card-based organization display
- **Search & Filter**: Find organizations by name, email, or industry
- **CRUD Operations**: Full create, read, update, delete functionality
- **Detailed Information**: Contact details, industry, employee count, founding year

### User Management
- **Table Layout**: Comprehensive user information display
- **Role Management**: Admin, Manager, Employee, Guest roles
- **Department Assignment**: IT, Marketing, Sales, HR, Finance, Operations
- **Status Tracking**: Active/Inactive user status
- **Password Security**: Secure password input with visibility toggle

### Project Management
- **Project Tracking**: Name, description, organization, manager
- **Team Management**: Assign multiple team members
- **Progress Monitoring**: Visual progress bars with color coding
- **Budget Management**: Track budget and actual spending
- **Timeline Management**: Start and end dates
- **Status & Priority**: Multiple status options and priority levels

### Document Management
- **File Organization**: Upload and categorize documents
- **File Type Support**: PDF, DOCX, XLSX, images, videos, audio
- **Search & Filter**: Search by name, description, or tags
- **View Modes**: Grid and list view options
- **Tagging System**: Add multiple tags for easy organization
- **Version Control**: Track document versions
- **Starring**: Mark important documents

## Customization

### Styling
The application uses Tailwind CSS for styling. You can customize the design by modifying:
- `tailwind.config.js` - Theme configuration
- `src/index.css` - Global styles and custom components
- Individual component files for specific styling

### Data
Currently, the application uses mock data stored in component state. To integrate with a backend:
1. Replace the `useState` hooks with API calls
2. Implement proper data fetching and error handling
3. Add loading states and error boundaries

### Adding New Features
The modular structure makes it easy to add new features:
1. Create new components in the `components/` directory
2. Add new pages in the `pages/` directory
3. Update the sidebar navigation in `Sidebar.jsx`
4. Add new routes in `App.jsx`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For support or questions, please open an issue in the repository or contact the development team.

---

**Note**: This application now integrates with a backend API for authentication. The login system connects to `http://10.0.100.19:9904/api/v1/auth/login` for user authentication. 