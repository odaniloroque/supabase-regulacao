import React from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  useTheme,
} from '@mui/material';
import {
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { authService } from '../services/auth';
import ProtectedRoute from '../components/ProtectedRoute';

const MenuPage: React.FC = () => {
  const theme = useTheme();
  const router = useRouter();

  const handleLogout = () => {
    authService.logout();
    router.push('/');
  };

  const menuItems = [
    {
      title: 'Pacientes',
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      path: '/pacientes',
      color: theme.palette.primary.main,
    },
    {
      title: 'Regulações',
      icon: <AssignmentIcon sx={{ fontSize: 40 }} />,
      path: '/em-construcao',
      color: theme.palette.secondary.main,
    },
    {
      title: 'Configurações',
      icon: <SettingsIcon sx={{ fontSize: 40 }} />,
      path: '/em-construcao',
      color: theme.palette.info.main,
    },
  ];

  return (
    <ProtectedRoute>
      <Container maxWidth="md">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
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
            }}
          >
            <Typography
              component="h1"
              variant="h4"
              sx={{ mb: 4, color: theme.palette.primary.main }}
            >
              Menu Principal
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              {menuItems.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item.title}>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      py: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                      backgroundColor: item.color,
                      '&:hover': {
                        backgroundColor: item.color,
                        opacity: 0.9,
                      },
                    }}
                    onClick={() => router.push(item.path)}
                  >
                    {item.icon}
                    <Typography variant="h6">{item.title}</Typography>
                  </Button>
                </Grid>
              ))}
            </Grid>

            <Button
              variant="outlined"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{ mt: 2 }}
            >
              Sair
            </Button>
          </Paper>
        </Box>
      </Container>
    </ProtectedRoute>
  );
};

export default MenuPage; 