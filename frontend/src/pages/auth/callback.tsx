import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Box,
  Paper,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { govAuthService } from '../../services/govAuth';
import { authService } from '../../services/auth';

const AuthCallbackPage = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const { code, error: authError } = router.query;

      if (authError) {
        setError('Erro na autenticação com Gov.br');
        return;
      }

      if (!code) {
        setError('Código de autorização não encontrado');
        return;
      }

      try {
        const response = await govAuthService.handleCallback(code as string);
        if (response.success && response.token) {
          localStorage.setItem('auth_token', response.token);
          router.push('/menu');
        } else {
          setError(response.error || 'Erro ao autenticar com Gov.br');
        }
      } catch (err) {
        console.error('Erro no callback:', err);
        setError('Erro ao processar autenticação');
      }
    };

    if (router.isReady) {
      handleCallback();
    }
  }, [router.isReady, router.query]);

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
          }}
        >
          {error ? (
            <>
              <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                {error}
              </Alert>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Você será redirecionado para a página de login em alguns segundos...
              </Typography>
            </>
          ) : (
            <>
              <CircularProgress sx={{ mb: 2 }} />
              <Typography variant="h6">
                Processando autenticação...
              </Typography>
            </>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default AuthCallbackPage; 