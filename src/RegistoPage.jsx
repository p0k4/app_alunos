
import TabelaAlunos from './TabelaAlunos';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxArchive } from '@fortawesome/free-solid-svg-icons';


function RegistoPage({ alunos, editarAluno, gravarAluno, apagarAluno, editId }) {

  return (
    <div className="registo-page">
      <h1><FontAwesomeIcon icon={faBoxArchive} /> Registos de Alunos</h1>
<div className="registo-topo">
  <div className="top-bar">

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