import { useNavigate } from 'react-router-dom';
import TabelaAlunos from './TabelaAlunos';
import './App.css';


function RegistoPage({ alunos, editarAluno, gravarAluno, apagarAluno, editId }) {
  const navigate = useNavigate();

  return (
    <div className="registo-page">
      <h1>📋 Registos de Alunos</h1>
    <div className="registo-topo">
      <div className="top-bar">
  <button className="voltar-btn" onClick={() => navigate('/')}>← Voltar</button>
  </div>
</div>
      <TabelaAlunos
        alunos={alunos}
        onEditar={editarAluno}
        onGravar={gravarAluno}
        onApagar={apagarAluno}
        editId={editId}
      />
    </div>
  );
}

export default RegistoPage;