import { useState, useRef } from 'react';
import { Paper, Typography, Button } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFileOutlined';

interface Props {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

export function UploadDropzone({ onFileSelected, disabled }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.name.toLowerCase().endsWith('.csv')) {
      onFileSelected(file);
    }
  };

  return (
    <Paper
      elevation={0}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`p-10 rounded-card border-2 border-dashed text-center transition-colors ${
        isDragging ? 'border-royal-purple bg-purple-50' : 'border-gray-300'
      }`}
    >
      <UploadFileIcon sx={{ fontSize: 48, color: '#6B7280' }} />
      <Typography variant="body1" className="mt-3 mb-1 font-medium">
        Drag and drop a CSV file here
      </Typography>
      <Typography variant="body2" color="text.secondary" className="mb-4">
        or click below to browse
      </Typography>
      <Button variant="contained" color="primary" disabled={disabled} onClick={() => inputRef.current?.click()}>
        Select File
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileSelected(file);
          e.target.value = ''; // allow re-selecting the same file
        }}
      />
    </Paper>
  );
}