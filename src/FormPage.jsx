import { Link } from 'react-router-dom';
import FormAluno from './FormAluno';

function FormPage({ adicionarAluno }) {
  return (
    <div className="app-container">
      <h1>Registo de Alunos 📚</h1>
      <FormAluno onAdicionar={adicionarAluno} />
      
      <Link to="/registos">
        <button style={{ marginTop: '20px', padding: '10px', backgroundColor: '#0b3d57', color: 'white', border: 'none', borderRadius: '4px' }}>
          Ver Registos
        </button>
      </Link>
    </div>
  );
}

export default FormPage;