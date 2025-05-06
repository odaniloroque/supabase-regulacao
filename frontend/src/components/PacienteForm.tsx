import React, { useState, useEffect } from 'react';
import { Button, TextField, Grid, Paper, Typography } from '@mui/material';

interface Paciente {
  id?: string;
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

interface PacienteFormProps {
  paciente?: Paciente;
  onSubmit: (paciente: Paciente) => void;
  onCancel: () => void;
}

const PacienteForm: React.FC<PacienteFormProps> = ({ paciente, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Paciente>({
    nome: '',
    dataNascimento: '',
    cpf: '',
    rg: '',
    email: '',
    telefone: '',
    endereco: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
    observacoes: '',
    ativo: true,
  });

  useEffect(() => {
    if (paciente) {
      setFormData(paciente);
    }
  }, [paciente]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Paper style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <Typography variant="h6" gutterBottom>
        {paciente ? 'Editar Paciente' : 'Novo Paciente'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Data de Nascimento"
              name="dataNascimento"
              type="date"
              value={formData.dataNascimento}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="CPF"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="RG"
              name="rg"
              value={formData.rg}
              onChange={handleChange}
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
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Telefone"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Endereço"
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Bairro"
              name="bairro"
              value={formData.bairro}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Cidade"
              name="cidade"
              value={formData.cidade}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Estado"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="CEP"
              name="cep"
              value={formData.cep}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Observações"
              name="observacoes"
              multiline
              rows={4}
              value={formData.observacoes}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginRight: 8 }}
            >
              {paciente ? 'Atualizar' : 'Cadastrar'}
            </Button>
            <Button
              variant="outlined"
              onClick={onCancel}
            >
              Cancelar
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default PacienteForm; 