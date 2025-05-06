import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Construction as ConstructionIcon } from '@mui/icons-material';
import { useRouter } from 'next/router';
import ProtectedRoute from '../components/ProtectedRoute';

const EmConstrucaoPage: React.FC = () => {
  const router = useRouter();

  return (
    <ProtectedRoute>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
          p: 3,
        }}
      >
        <ConstructionIcon sx={{ fontSize: 80, color: 'warning.main', mb: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom>
          Em Construção
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Esta funcionalidade está sendo desenvolvida e estará disponível em breve.
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push('/menu')}
        >
          Voltar ao Menu
        </Button>
      </Box>
    </ProtectedRoute>
  );
};

export default EmConstrucaoPage; 