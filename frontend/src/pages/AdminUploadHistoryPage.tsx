import { useState } from 'react';
import { Typography, TextField, Tabs, Tab, Button, Pagination as MuiPagination } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBackOutlined';
import { useQuery } from '@tanstack/react-query';
import { adminUploadsService, type AdminDirectoryUser, type AdminAllUploadsFilters } from '@/services/adminUploads.service';
import { usersService } from '@/services/users.service';
import { UserDirectoryCard } from '@/features/admin-uploads/UserDirectoryCard';
import { UserUploadHistoryTable } from '@/features/admin-uploads/UserUploadHistoryTable';
import { AllUploadsTable } from '@/features/admin-uploads/AllUploadsTable';
import { AllUploadsFilters } from '@/features/admin-uploads/AllUploadsFilters';

type View = 'directory' | 'user' | 'all';

export default function AdminUploadHistoryPage() {
  const [view, setView] = useState<View>('directory');
  const [selectedUser, setSelectedUser] = useState<AdminDirectoryUser | null>(null);
  const [search, setSearch] = useState('');
  const [userPage, setUserPage] = useState(1);
  const [allFilters, setAllFilters] = useState<Partial<AdminAllUploadsFilters>>({});
  const [allPage, setAllPage] = useState(1);

  const { data: directory, isLoading: directoryLoading } = useQuery({
    queryKey: ['admin-upload-directory', search],
    queryFn: () => adminUploadsService.getDirectory(search),
    enabled: view === 'directory',
  });

  const { data: userHistory, isLoading: userHistoryLoading } = useQuery({
    queryKey: ['admin-user-uploads', selectedUser?.id, userPage],
    queryFn: () => adminUploadsService.getUserHistory(selectedUser!.id, userPage, 20),
    enabled: view === 'user' && !!selectedUser,
  });

  const { data: roles = [] } = useQuery({
    queryKey: ['roles'],
    queryFn: () => usersService.getRoles(),
  });

  const { data: allUploads, isLoading: allUploadsLoading } = useQuery({
    queryKey: ['admin-all-uploads', allFilters, allPage],
    queryFn: () => adminUploadsService.getAllUploads({ page: allPage, limit: 20, ...allFilters }),
    enabled: view === 'all',
  });

  const handleViewUser = (user: AdminDirectoryUser) => {
    setSelectedUser(user);
    setUserPage(1);
    setView('user');
  };

  const handleBackToDirectory = () => {
    setSelectedUser(null);
    setView('directory');
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Typography variant="h5" className="font-semibold text-charcoal">
          Upload History
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Investigate uploaded file activity across all users
        </Typography>
      </div>

      {view !== 'user' && (
        <Tabs
          value={view}
          onChange={(_, val) => setView(val)}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Users" value="directory" />
          <Tab label="All Uploads" value="all" />
        </Tabs>
      )}

      {view === 'directory' && (
        <>
          <TextField
            label="Search users"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ maxWidth: 320 }}
          />
          {directoryLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 rounded-card bg-white border border-gray-200 animate-pulse" />
              ))}
            </div>
          ) : !directory || directory.length === 0 ? (
            <div className="text-center py-12 text-cool-gray text-sm">No users found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {directory.map((user) => (
                <UserDirectoryCard key={user.id} user={user} onView={handleViewUser} />
              ))}
            </div>
          )}
        </>
      )}

      {view === 'user' && selectedUser && (
        <>
          <div className="flex items-center gap-3">
            <Button startIcon={<ArrowBackIcon />} onClick={handleBackToDirectory} size="small">
              Back to Users
            </Button>
          </div>
          <div>
            <Typography variant="subtitle1" className="font-semibold">
              {selectedUser.firstName} {selectedUser.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedUser.role} · {selectedUser.email}
            </Typography>
          </div>

          <UserUploadHistoryTable uploads={userHistory?.items ?? []} loading={userHistoryLoading} />

          {userHistory && userHistory.pagination.totalPages > 1 && (
            <div className="flex justify-center">
              <MuiPagination
                count={userHistory.pagination.totalPages}
                page={userHistory.pagination.page}
                onChange={(_, p) => setUserPage(p)}
                color="primary"
              />
            </div>
          )}
        </>
      )}

      {view === 'all' && (
        <>
          <AllUploadsFilters
            roles={roles}
            onApply={(filters) => {
              setAllFilters(filters);
              setAllPage(1);
            }}
          />
          <AllUploadsTable uploads={allUploads?.items ?? []} loading={allUploadsLoading} />
          {allUploads && allUploads.pagination.totalPages > 1 && (
            <div className="flex justify-center">
              <MuiPagination
                count={allUploads.pagination.totalPages}
                page={allUploads.pagination.page}
                onChange={(_, p) => setAllPage(p)}
                color="primary"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}