import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FormPage from './FormPage';
import RegistoPage from './RegistoPage';
import './App.css';

function App() {
  const [alunos, setAlunos] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const adicionarAluno = (aluno) => {
    setAlunos([...alunos, aluno]);
  };

  const editarAluno = (index) => {
    setEditIndex(index);
  };

  const gravarAluno = (index, alunoAtualizado) => {
    const novosAlunos = [...alunos];
    novosAlunos[index] = alunoAtualizado;
    setAlunos(novosAlunos);
    setEditIndex(null);
  };

  const apagarAluno = (index) => {
    setAlunos((prev) => prev.filter((_, i) => i !== index));
    setEditIndex(null); // se estiver em edição, limpa
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<FormPage alunos={alunos} adicionarAluno={adicionarAluno} />}
        />
        <Route
          path="/registos"
          element={
            <RegistoPage
              alunos={alunos}
              editarAluno={editarAluno}
              gravarAluno={gravarAluno}
              onApagar={apagarAluno}
              editIndex={editIndex}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;