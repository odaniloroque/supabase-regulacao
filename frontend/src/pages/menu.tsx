import React from 'react';
import { Box, Typography } from '@mui/material';
import ProtectedRoute from '../components/ProtectedRoute';

const MenuPage: React.FC = () => {
  return (
    <ProtectedRoute>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Bem-vindo ao Sistema de Regulação
        </Typography>
        <Typography variant="body1">
          Selecione uma opção no menu lateral para começar.
        </Typography>
      </Box>
    </ProtectedRoute>
  );
};

export default MenuPage; 