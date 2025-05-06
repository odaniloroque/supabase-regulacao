import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  FormControlLabel,
  Switch,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useRouter } from 'next/router';
import InputMask from 'react-input-mask';
import ProtectedRoute from '../../components/ProtectedRoute';
import { pacientesService } from '../../services/pacientes';
import { Paciente } from '../../types/paciente';
import { isValidCPF } from '../../utils/validation';

interface FormData {
  nome: string;
  cpf: string;
  dataNascimento: string;
  email: string;
  telefone: string;
  ativo: boolean;
}

const PacienteFormPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const isEditing = id !== 'novo';

  const [formData, setFormData] = useState<FormData>({
    nome: '',
    cpf: '',
    dataNascimento: '',
    email: '',
    telefone: '',
    ativo: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [cpfError, setCpfError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing && id) {
      carregarPaciente();
    }
  }, [id]);

  const carregarPaciente = async () => {
    try {
      setLoading(true);
      const paciente = await pacientesService.buscarPaciente(Number(id));
      setFormData({
        nome: paciente.nome,
        cpf: paciente.cpf,
        dataNascimento: paciente.dataNascimento,
        email: paciente.email,
        telefone: paciente.telefone,
        ativo: paciente.ativo,
      });
      setError(null);
    } catch (err) {
      setError('Erro ao carregar paciente. Por favor, tente novamente.');
      console.error('Erro ao carregar paciente:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'ativo' ? checked : value,
    }));

    // Validação de CPF
    if (name === 'cpf') {
      const cleanCPF = value.replace(/\D/g, '');
      if (cleanCPF.length === 11 && !isValidCPF(value)) {
        setCpfError('CPF inválido');
      } else {
        setCpfError(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação de CPF antes do envio
    if (!isValidCPF(formData.cpf)) {
      setCpfError('CPF inválido');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      if (isEditing) {
        await pacientesService.atualizarPaciente(Number(id), formData);
      } else {
        await pacientesService.criarPaciente(formData);
      }

      setSuccess(
        isEditing
          ? 'Paciente atualizado com sucesso!'
          : 'Paciente cadastrado com sucesso!'
      );
      setTimeout(() => {
        router.push('/pacientes');
      }, 2000);
    } catch (err) {
      setError(
        isEditing
          ? 'Erro ao atualizar paciente. Por favor, tente novamente.'
          : 'Erro ao cadastrar paciente. Por favor, tente novamente.'
      );
      console.error('Erro ao salvar paciente:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ProtectedRoute>
      <Box>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" component="h1" sx={{ mb: 3 }}>
            {isEditing ? 'Editar Paciente' : 'Novo Paciente'}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputMask
                  mask="999.999.999-99"
                  value={formData.cpf}
                  onChange={handleChange}
                >
                  {(inputProps: any) => (
                    <TextField
                      {...inputProps}
                      fullWidth
                      label="CPF"
                      name="cpf"
                      required
                      disabled={loading}
                      error={!!cpfError}
                      helperText={cpfError}
                    />
                  )}
                </InputMask>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Data de Nascimento"
                  name="dataNascimento"
                  type="date"
                  value={formData.dataNascimento}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputMask
                  mask="(99) 99999-9999"
                  value={formData.telefone}
                  onChange={handleChange}
                >
                  {(inputProps: any) => (
                    <TextField
                      {...inputProps}
                      fullWidth
                      label="Telefone"
                      name="telefone"
                      required
                      disabled={loading}
                    />
                  )}
                </InputMask>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.ativo}
                      onChange={handleChange}
                      name="ativo"
                      disabled={loading}
                    />
                  }
                  label="Paciente Ativo"
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => router.push('/pacientes')}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading || !!cpfError}
              >
                {isEditing ? 'Atualizar' : 'Cadastrar'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </ProtectedRoute>
  );
};

export default PacienteFormPage; 