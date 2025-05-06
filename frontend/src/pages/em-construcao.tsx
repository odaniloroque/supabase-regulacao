import React from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  Button,
  useTheme,
} from '@mui/material';
import { Construction as ConstructionIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useRouter } from 'next/router';

const EmConstrucaoPage: React.FC = () => {
  const theme = useTheme();
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <ConstructionIcon
            sx={{
              fontSize: 80,
              color: theme.palette.warning.main,
              mb: 3,
            }}
          />
          <Typography
            component="h1"
            variant="h4"
            sx={{ mb: 2, color: theme.palette.warning.main }}
          >
            Em Construção
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            Esta funcionalidade está em desenvolvimento. Em breve estará disponível.
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
          >
            Voltar
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default EmConstrucaoPage; 