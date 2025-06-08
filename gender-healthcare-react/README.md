# Gender Healthcare React Frontend

This is the frontend application for the Gender Healthcare project, built with React and Vite.

## Features

- User authentication (login/register)
- Health forum for asking and answering questions
- Menstrual cycle tracking (coming soon)
- Health reminders (coming soon)

## Getting Started

### Prerequisites

- Node.js (v16 or newer)
- npm or yarn
- Backend API running (see main project README)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the project root with:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

## API Integration

This frontend connects to the Express.js backend API. The API services are organized in `src/app/services/api.js`.

Available API services:
- accountAPI - User authentication and account management
- customerAPI - Customer profile management
- counselorAPI - Access to counselor information
- questionAPI - Forum questions management
- commentAPI - Forum comments management
- cycleAPI - Menstrual cycle tracking
- reminderAPI - Health reminders

## Project Structure

- `src/app/components/` - Reusable UI components
- `src/app/pages/` - Page components
- `src/app/services/` - API services and other utilities
- `src/app/routes/` - Application routing
- `src/settings/` - Application settings and environment variables

## Building for Production

To build the app for production:

```bash
npm run build
```

The build files will be in the `dist/` directory, ready to be deployed.

## Development Notes

- The application uses React Router for navigation
- API requests are handled with Axios
- Tailwind CSS is used for styling

## Learn More

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [React Router Documentation](https://reactrouter.com/)
