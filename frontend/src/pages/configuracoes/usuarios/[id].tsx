import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  useTheme,
  CircularProgress,
  Alert,
  SelectChangeEvent,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useRouter } from 'next/router';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { usuariosService } from '../../../services/usuarios';
import { Usuario, NivelAcesso } from '../../../types/usuario';

interface FormData {
  nome: string;
  email: string;
  cpf: string;
  matricula: string;
  cargo: string;
  setor: string;
  nivelAcesso: NivelAcesso;
  ativo: boolean;
}

const UsuarioFormPage: React.FC = () => {
  const theme = useTheme();
  const router = useRouter();
  const { id } = router.query;
  const isEditing = id !== 'novo';

  const [formData, setFormData] = useState<FormData>({
    nome: '',
    email: '',
    cpf: '',
    matricula: '',
    cargo: '',
    setor: '',
    nivelAcesso: 'OPERADOR',
    ativo: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing && id) {
      carregarUsuario();
    }
  }, [isEditing, id]);

  const carregarUsuario = async () => {
    try {
      setLoading(true);
      const usuario = await usuariosService.buscarUsuario(id as string);
      setFormData({
        nome: usuario.nome,
        email: usuario.email,
        cpf: usuario.cpf,
        matricula: usuario.matricula,
        cargo: usuario.cargo,
        setor: usuario.setor,
        nivelAcesso: usuario.nivelAcesso,
        ativo: usuario.ativo,
      });
      setError(null);
    } catch (err) {
      setError('Erro ao carregar usuário. Por favor, tente novamente.');
      console.error('Erro ao carregar usuário:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<NivelAcesso>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const usuarioData = {
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      if (isEditing) {
        await usuariosService.atualizarUsuario(id as string, usuarioData);
        setSuccess('Usuário atualizado com sucesso!');
      } else {
        await usuariosService.criarUsuario(usuarioData);
        setSuccess('Usuário criado com sucesso!');
      }

      setTimeout(() => {
        router.push('/configuracoes/usuarios');
      }, 2000);
    } catch (err) {
      setError('Erro ao salvar usuário. Por favor, tente novamente.');
      console.error('Erro ao salvar usuário:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <ProtectedRoute>
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => router.push('/configuracoes/usuarios')}
                sx={{ mr: 2 }}
              >
                Voltar
              </Button>
              <Typography variant="h5" component="h1">
                {isEditing ? 'Editar Usuário' : 'Novo Usuário'}
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleTextChange}
                    required
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleTextChange}
                    required
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="CPF"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleTextChange}
                    required
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Matrícula"
                    name="matricula"
                    value={formData.matricula}
                    onChange={handleTextChange}
                    required
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Cargo"
                    name="cargo"
                    value={formData.cargo}
                    onChange={handleTextChange}
                    required
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Setor"
                    name="setor"
                    value={formData.setor}
                    onChange={handleTextChange}
                    required
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Nível de Acesso</InputLabel>
                    <Select
                      name="nivelAcesso"
                      value={formData.nivelAcesso}
                      onChange={handleSelectChange}
                      label="Nível de Acesso"
                      required
                      disabled={loading}
                    >
                      <MenuItem value="ADMIN">Administrador</MenuItem>
                      <MenuItem value="SUPERVISOR">Supervisor</MenuItem>
                      <MenuItem value="OPERADOR">Operador</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.ativo}
                        onChange={handleSwitchChange}
                        name="ativo"
                        color="primary"
                        disabled={loading}
                      />
                    }
                    label="Usuário Ativo"
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => router.push('/configuracoes/usuarios')}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : isEditing ? (
                    'Salvar Alterações'
                  ) : (
                    'Criar Usuário'
                  )}
                </Button>
              </Box>
            </form>
          </Paper>
        </Box>
      </Container>
    </ProtectedRoute>
  );
};

export default UsuarioFormPage; 