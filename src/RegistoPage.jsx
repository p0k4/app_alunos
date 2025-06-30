import { useNavigate } from 'react-router-dom';
import TabelaAlunos from './TabelaAlunos';

function RegistoPage({ alunos, editarAluno, gravarAluno, apagarAluno, editId }) {
  const navigate = useNavigate();

  return (
    <div className="registo-page">
      <h1>📋 Registos de Alunos</h1>
      <button onClick={() => navigate('/')}>← Voltar</button>
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