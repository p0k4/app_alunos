import { Link } from 'react-router-dom';
import TabelaAlunos from './TabelaAlunos';

function RegistosPage({ alunos, editarAluno, gravarAluno, onApagar, editIndex }) {
  return (
    <div className="app-container">
      <h1>Registos de Alunos 📋</h1>
      
      <Link to="/">
        <button
          style={{
            marginBottom: '20px',
            padding: '10px',
            backgroundColor: 'green',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          ← Voltar
        </button>
      </Link>

      <TabelaAlunos
        alunos={alunos}
        onEditar={editarAluno}
        onGravar={gravarAluno}
          onApagar={onApagar}
        editIndex={editIndex}
      />
    </div>
  );
}

export default RegistosPage;