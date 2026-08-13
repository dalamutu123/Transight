import { Navigate, useNavigate } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/DashboardOutlined';
import UploadFileIcon from '@mui/icons-material/UploadFileOutlined';
import SummarizeIcon from '@mui/icons-material/SummarizeOutlined';
import { useAuthStore } from '@/store/authStore';

const features = [
  {
    icon: <DashboardIcon sx={{ fontSize: 32 }} />,
    title: 'Operational Dashboards',
    description: 'Monitor transaction volume, success rates, and trends at a glance.',
  },
  {
    icon: <UploadFileIcon sx={{ fontSize: 32 }} />,
    title: 'Validated CSV Uploads',
    description: 'Ingest transaction files with automatic validation and duplicate detection.',
  },
  {
    icon: <SummarizeIcon sx={{ fontSize: 32 }} />,
    title: 'Operational Reporting',
    description: 'Generate filtered CSV and Excel reports for investigations and audits.',
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // Already logged in? Skip the landing page and go straight to the app.
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-gray flex flex-col">
      <header className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto w-full">
        <Typography variant="h6" color="secondary" className="font-bold">
          Transight
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/login')}>
          Log In
        </Button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
        <Typography variant="h3" color="secondary" className="font-bold mb-4 max-w-2xl">
          Transaction intelligence for payment operations teams
        </Typography>
        <Typography variant="body1" color="text.secondary" className="max-w-xl mb-8">
          Upload, validate, monitor, investigate, and report on transaction activity — all from a single,
          secure platform.
        </Typography>
        <Button variant="contained" color="primary" size="large" onClick={() => navigate('/login')}>
          Log In to Continue
        </Button>
      </main>

      <section className="max-w-5xl mx-auto w-full px-6 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="card-hover bg-white rounded-card p-6 border border-gray-200 text-left">
              <div className="text-royal-purple mb-3">{f.icon}</div>
              <Typography variant="subtitle1" className="font-semibold mb-1">
                {f.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {f.description}
              </Typography>
            </div>
          ))}
        </div>
      </section>

      <footer className="text-center py-6 text-cool-gray text-sm">
        © {new Date().getFullYear()} Transight. Internal use only.
      </footer>
    </div>
  );
}