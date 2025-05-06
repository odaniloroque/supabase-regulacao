import React, { useState } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import ProtectedRoute from '../../components/ProtectedRoute';

// Dados mockados para demonstração
const mockPacientes = [
  {
    id: 1,
    nome: 'João Silva',
    cartaoSus: '1234567890123',
    cpf: '123.456.789-00',
    dataNascimento: '1990-01-01',
  },
  {
    id: 2,
    nome: 'Maria Santos',
    cartaoSus: '9876543210987',
    cpf: '987.654.321-00',
    dataNascimento: '1985-05-15',
  },
  // Adicione mais pacientes mockados conforme necessário
];

const PacientesPage: React.FC = () => {
  const theme = useTheme();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'nome' | 'cartaoSus' | 'cpf'>('nome');

  const handleFilterChange = (
    event: React.MouseEvent<HTMLElement>,
    newFilter: 'nome' | 'cartaoSus' | 'cpf' | null,
  ) => {
    if (newFilter !== null) {
      setFilterType(newFilter);
    }
  };

  const filteredPacientes = mockPacientes.filter((paciente) => {
    const searchLower = searchTerm.toLowerCase();
    switch (filterType) {
      case 'nome':
        return paciente.nome.toLowerCase().includes(searchLower);
      case 'cartaoSus':
        return paciente.cartaoSus.includes(searchTerm);
      case 'cpf':
        return paciente.cpf.includes(searchTerm);
      default:
        return true;
    }
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <ProtectedRoute>
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => router.push('/menu')}
                sx={{ mr: 2 }}
              >
                Voltar
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => router.push('/pacientes/novo')}
              >
                Novo Paciente
              </Button>
            </Box>

            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Buscar pacientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <ToggleButtonGroup
                  value={filterType}
                  exclusive
                  onChange={handleFilterChange}
                  aria-label="tipo de filtro"
                >
                  <ToggleButton value="nome" aria-label="filtrar por nome">
                    Nome
                  </ToggleButton>
                  <ToggleButton value="cartaoSus" aria-label="filtrar por cartão SUS">
                    Cartão SUS
                  </ToggleButton>
                  <ToggleButton value="cpf" aria-label="filtrar por CPF">
                    CPF
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nome</TableCell>
                    <TableCell>Cartão SUS</TableCell>
                    <TableCell>CPF</TableCell>
                    <TableCell>Data de Nascimento</TableCell>
                    <TableCell align="right">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPacientes.length > 0 ? (
                    filteredPacientes.map((paciente) => (
                      <TableRow key={paciente.id}>
                        <TableCell>{paciente.nome}</TableCell>
                        <TableCell>{paciente.cartaoSus}</TableCell>
                        <TableCell>{paciente.cpf}</TableCell>
                        <TableCell>{formatDate(paciente.dataNascimento)}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            color="primary"
                            onClick={() => router.push(`/pacientes/${paciente.id}`)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton color="error">
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography variant="body1" color="text.secondary">
                          Nenhum paciente encontrado
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </Container>
    </ProtectedRoute>
  );
};

export default PacientesPage; 