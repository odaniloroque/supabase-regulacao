import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Button,
  Box,
  Typography,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

interface Paciente {
  id: string;
  nome: string;
  dataNascimento: string;
  cpf: string;
  rg: string;
  email: string;
  telefone: string;
  endereco: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  observacoes?: string;
  ativo: boolean;
}

interface PacienteListProps {
  pacientes: Paciente[];
  onEdit: (paciente: Paciente) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

const PacienteList: React.FC<PacienteListProps> = ({
  pacientes,
  onEdit,
  onDelete,
  onAdd,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPacientes = pacientes.filter((paciente) =>
    paciente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paciente.cpf.includes(searchTerm) ||
    paciente.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Lista de Pacientes</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={onAdd}
        >
          Novo Paciente
        </Button>
      </Box>

      <TextField
        fullWidth
        label="Pesquisar pacientes"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        margin="normal"
      />

      <TableContainer component={Paper} style={{ marginTop: 20 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>CPF</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>Cidade</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPacientes.map((paciente) => (
              <TableRow key={paciente.id}>
                <TableCell>{paciente.nome}</TableCell>
                <TableCell>{paciente.cpf}</TableCell>
                <TableCell>{paciente.email}</TableCell>
                <TableCell>{paciente.telefone}</TableCell>
                <TableCell>{paciente.cidade}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => onEdit(paciente)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => onDelete(paciente.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PacienteList; 