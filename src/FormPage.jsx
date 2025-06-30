import { Link } from 'react-router-dom';
import FormAluno from './FormAluno';
import './App.css';

function FormPage({ adicionarAluno }) {
  return (
    <div className="app-container">
      {/* <h1>Registo de Alunos 📚</h1> */}
      <FormAluno onAdicionar={adicionarAluno} />
      
     
    </div>
  );
}

export default FormPage;