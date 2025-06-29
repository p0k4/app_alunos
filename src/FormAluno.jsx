import { useState } from 'react';
import './FormAluno.css';

function FormAluno({ onAdicionar }) {
  const [formData, setFormData] = useState({
    dataRenovacao: '',
    nomeCompleto: '',
    dataNascimento: '',
    contato: '',
    email: '',
    observacoes: '',
    nivel: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { dataRenovacao, nomeCompleto, dataNascimento, contato, email, nivel } = formData;
    if (!dataRenovacao || !nomeCompleto || !dataNascimento || !contato || !email || !nivel) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    onAdicionar(formData);
    setFormData({
      dataRenovacao: '',
      nomeCompleto: '',
      dataNascimento: '',
      contato: '',
      email: '',
      observacoes: '',
      nivel: '',
    });
  };

  return (
    <form className="form-aluno" onSubmit={handleSubmit}>
      <h2>Registar Aluno</h2>

      <label>Data de Renovação</label>
      <input
        type="date"
        name="dataRenovacao"
        value={formData.dataRenovacao}
        onChange={handleChange}
      />

      <label>Nome Completo</label>
      <input
        type="text"
        name="nomeCompleto"
        placeholder="Nome Completo"
        value={formData.nomeCompleto}
        onChange={handleChange}
      />

      <label>Data de Nascimento</label>
      <input
        type="date"
        name="dataNascimento"
        value={formData.dataNascimento}
        onChange={handleChange}
      />

      <label>Contato</label>
      <input
        type="text"
        name="contato"
        placeholder="Contato"
        value={formData.contato}
        onChange={handleChange}
      />

      <label>Email</label>
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      />

      <label>Nível</label>
      <select
        name="nivel"
        value={formData.nivel}
        onChange={handleChange}
      >
        <option value="" disabled>Insere o nível</option>
        <option value="Adultos">Adultos</option>
        <option value="Bebes">Bebes</option>
        <option value="Nivel 1">Nivel 1</option>
        <option value="Nivel 2">Nivel 2</option>
        <option value="Nivel 3">Nivel 3</option>
        <option value="Nivel 4">Nivel 4</option>
        <option value="Nivel 5">Nivel 5</option>
        <option value="Nivel 6">Nivel 6</option>
      </select>

      <label>Observações</label>
      <textarea
        name="observacoes"
        placeholder="Observações"
        value={formData.observacoes}
        onChange={handleChange}
        rows={4}
      />

      <button type="submit">Adicionar Aluno</button>
    </form>
  );
}

export default FormAluno;