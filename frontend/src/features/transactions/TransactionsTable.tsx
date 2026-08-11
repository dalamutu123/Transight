import { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  flexRender,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Skeleton, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import type { Transaction } from '@/types/transaction';

interface Props {
  data: Transaction[];
  loading?: boolean;
}

const statusColor: Record<string, 'success' | 'error' | 'warning' | 'info' | 'default'> = {
  Successful: 'success',
  Failed: 'error',
  Pending: 'warning',
  Processing: 'info',
};

const columnHelper = createColumnHelper<Transaction>();

export function TransactionsTable({ data, loading }: Props) {
  const navigate = useNavigate();

  const columns = useMemo(
    () => [
      columnHelper.accessor('reference', { header: 'Reference' }),
      columnHelper.accessor('transactionDate', {
        header: 'Date',
        cell: (info) => dayjs(info.getValue()).format('MMM D, YYYY'),
      }),
      columnHelper.accessor('amount', {
        header: 'Amount',
        cell: (info) => `${info.row.original.currency} ${Number(info.getValue()).toLocaleString()}`,
      }),
      columnHelper.accessor('customerAccount', { header: 'Account' }),
      columnHelper.accessor((row) => row.bank.code, { id: 'bank', header: 'Bank' }),
      columnHelper.accessor('transactionType', { header: 'Type' }),
      columnHelper.accessor((row) => row.status.name, {
        id: 'status',
        header: 'Status',
        cell: (info) => (
          <Chip label={info.getValue()} size="small" color={statusColor[info.getValue()] ?? 'default'} />
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) {
    return (
      <Paper elevation={0} className="p-4 rounded-card border border-gray-200">
        <div className="flex flex-col gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} variant="rounded" height={40} />
          ))}
        </div>
      </Paper>
    );
  }

  if (data.length === 0) {
    return (
      <Paper elevation={0} className="p-8 rounded-card border border-gray-200 text-center">
        <p className="text-cool-gray text-sm">No transactions match your search criteria.</p>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} elevation={0} className="rounded-card border border-gray-200">
      <Table size="small">
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-slate-gray">
              {headerGroup.headers.map((header) => (
                <TableCell key={header.id} className="font-semibold">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              hover
              className="cursor-pointer"
              onClick={() => navigate(`/transactions/${row.original.id}`)}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}