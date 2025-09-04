import { useState } from 'react';
import { Link } from 'react-router-dom';
import './FormAluno.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faBars, faIdCard} from '@fortawesome/free-solid-svg-icons';

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

  if (name === 'contato') {
    // Remove tudo que não é número
    let onlyNumbers = value.replace(/\D/g, '');
    // Limita a 15 dígitos
    if (onlyNumbers.length > 15) {
      onlyNumbers = onlyNumbers.slice(0, 15);
    }
    setFormData({ ...formData, [name]: onlyNumbers });
  } else {
    setFormData({ ...formData, [name]: value });
  }
};
  const handleSubmit = (e) => {
    e.preventDefault();
    const { dataRenovacao, nomeCompleto, dataNascimento, contato, email, nivel } = formData;
    if (!dataRenovacao || !nomeCompleto || !dataNascimento || !contato || !email || !nivel) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    onAdicionar(formData);
    alert(`✅ Aluno "${nomeCompleto}" adicionado com sucesso!`);
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
      <h2><FontAwesomeIcon icon={faIdCard} /> Registar Aluno</h2>

      <div className="form-grid">
        <div className="form-field">
          <label>Data de Renovação</label>
          <input
            type="date"
            name="dataRenovacao"
            value={formData.dataRenovacao}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <label>Nome Completo</label>
          <input
            type="text"
            name="nomeCompleto"
            placeholder="Nome completo"
            value={formData.nomeCompleto}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <label>Data de Nascimento</label>
          <input
            type="date"
            name="dataNascimento"
            value={formData.dataNascimento}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <label>Contato</label>
          <input
            type="tel"
            name="contato"
            placeholder="999 999 999"
            value={formData.contato}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="email@exemplo.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <label>Nível</label>
          <select
            name="nivel"
            value={formData.nivel}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Seleciona a opção</option>
            <option value="Natacao-Adultos">Natação Adultos</option>
            <option value="Hidroginastica">Hidroginástica</option>
            <option value="Hidrobike">Hidrobike</option>
            <option value="Pilates">Pilates</option>
            <option value="Treino Funcional">Treino Funional</option>
            <option value="Cycling">Cycling</option>
            <option value="Bebes">Bebes</option>
            <option value="Nivel 1">Nivel 1</option>
            <option value="Nivel 2">Nivel 2</option>
            <option value="Nivel 3">Nivel 3</option>
            <option value="Nivel 4">Nivel 4</option>
            <option value="Nivel 5">Nivel 5</option>
            <option value="Nivel 6">Nivel 6</option>
          </select>
        </div>

        <div className="form-field full">
          <label>Observações</label>
          <textarea
            name="observacoes"
            placeholder="Mencione alguma observação, caso exista"
            value={formData.observacoes}
            onChange={handleChange}
            rows={4}
          />
        </div>
      </div>

      <div className="botoes">
        <button type="submit" className="btn btn-primary">
          <FontAwesomeIcon icon={faCheck} /> Adicionar Aluno
        </button>
        <Link to="/registos" className="btn btn-secondary">
          <FontAwesomeIcon icon={faBars} /> Ver Registos
        </Link>
      </div>
    </form>
  );
}

export default FormAluno;