import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FormPage from './FormPage';
import RegistoPage from './RegistoPage';
import {
  getAlunos,
  addAluno,
  updateAluno,
  deleteAluno
} from './api/alunosApi';

function App() {
  const [alunos, setAlunos] = useState([]);
  const [editId, setEditId] = useState(null);

  // Carrega ao iniciar
  useEffect(() => {
    getAlunos()
      .then(setAlunos)
      .catch((error) => console.error('Erro ao carregar alunos:', error));
  }, []);

  // Adiciona aluno
  const adicionarAluno = async (aluno) => {
    try {
      const novo = await addAluno(aluno);
      setAlunos((prev) => [...prev, novo]);
    } catch (error) {
      console.error('Erro ao adicionar aluno:', error);
    }
  };

  // Inicia edição
  const editarAluno = (id) => {
    setEditId(id);
  };

  // Grava aluno editado
  const gravarAluno = async (id, alunoAtualizado) => {
    try {
      const atualizado = await updateAluno(id, alunoAtualizado);
      setAlunos((prev) =>
        prev.map((a) => (a.id === id ? atualizado : a))
      );
      setEditId(null);
      alert('✅ Alteração efetuada com sucesso!');
    } catch (error) {
      console.error('Erro ao gravar aluno:', error);
    }
  };

  // Apaga aluno
  const apagarAluno = async (id) => {
    try {
      await deleteAluno(id);
      setAlunos((prev) => prev.filter((a) => a.id !== id));
      setEditId(null);
    } catch (error) {
      console.error('Erro ao apagar aluno:', error);
    }
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
              apagarAluno={apagarAluno}
              editId={editId}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;