import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { Typography, Paper, Chip, Skeleton, Breadcrumbs, Link, Button, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBackOutlined';
import dayjs from 'dayjs';
import { useTransaction } from '@/features/transactions/useTransaction';

const statusColor: Record<string, 'success' | 'error' | 'warning' | 'info' | 'default'> = {
  Successful: 'success',
  Failed: 'error',
  Pending: 'warning',
  Processing: 'info',
};

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between py-3 border-b border-gray-100 last:border-0">
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" className="font-medium text-right">
        {value}
      </Typography>
    </div>
  );
}

export default function TransactionDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: tx, isLoading, isError } = useTransaction(id);

  if (isError) {
    return (
      <div className="text-error text-sm">
        Could not load this transaction. It may not exist, or you may not have access to it.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Breadcrumbs>
        <Link component={RouterLink} to="/transactions" underline="hover" color="inherit">
          Transactions
        </Link>
        <Typography color="text.primary">{tx?.reference ?? '...'}</Typography>
      </Breadcrumbs>

      <div className="flex items-center gap-3">
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/transactions')} size="small">
          Back
        </Button>
      </div>

      {isLoading ? (
        <Paper elevation={0} className="p-6 rounded-card border border-gray-200 max-w-2xl">
          <Skeleton variant="text" width={200} height={32} className="mb-4" />
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <Skeleton key={i} variant="text" height={40} />
          ))}
        </Paper>
      ) : tx ? (
        <Paper elevation={0} className="p-6 rounded-card border border-gray-200 max-w-2xl">
          <div className="flex items-center justify-between mb-2">
            <Typography variant="h6" className="font-semibold">
              {tx.reference}
            </Typography>
            <Chip label={tx.status.name} color={statusColor[tx.status.name] ?? 'default'} />
          </div>
          <Typography variant="body2" color="text.secondary" className="mb-4">
            {dayjs(tx.transactionDate).format('MMMM D, YYYY · h:mm A')}
          </Typography>

          <Divider className="mb-2" />

          <DetailRow label="Amount" value={`${tx.currency} ${Number(tx.amount).toLocaleString()}`} />
          <DetailRow label="Customer Account" value={tx.customerAccount} />
          <DetailRow label="Bank" value={`${tx.bank.name} (${tx.bank.code})`} />
          <DetailRow label="Transaction Type" value={tx.transactionType} />
          <DetailRow label="Response Code" value={tx.responseCode} />
          <DetailRow label="Response Description" value={tx.responseDescription || '—'} />
          <DetailRow label="Recorded" value={dayjs(tx.createdAt).format('MMM D, YYYY · h:mm A')} />
        </Paper>
      ) : null}
    </div>
  );
}