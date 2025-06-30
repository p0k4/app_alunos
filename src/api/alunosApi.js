import axios from 'axios';

const BASE_URL = 'http://localhost:3001';

// 🔁 Backend ➜ Frontend
function toCamelCase(aluno) {
  return {
    id: aluno.id,
    dataRenovacao: aluno.data_renovacao ? aluno.data_renovacao.slice(0, 10) : '',
    nomeCompleto: aluno.nome_completo,
    dataNascimento: aluno.data_nascimento ? aluno.data_nascimento.slice(0, 10) : '',
    contato: aluno.contato,
    email: aluno.email,
    nivel: aluno.nivel,
    observacoes: aluno.observacoes
  };
}

// 🔁 Frontend ➜ Backend
function toSnakeCase(aluno) {
  return {
    data_renovacao: aluno.dataRenovacao,
    nome_completo: aluno.nomeCompleto,
    data_nascimento: aluno.dataNascimento,
    contato: aluno.contato,
    email: aluno.email,
    nivel: aluno.nivel,
    observacoes: aluno.observacoes
  };
}

export const getAlunos = () =>
  axios.get(`${BASE_URL}/alunos`).then(res =>
    res.data.map(toCamelCase)
  );

export const addAluno = (aluno) =>
  axios.post(`${BASE_URL}/alunos`, toSnakeCase(aluno))
    .then(res => toCamelCase(res.data));

export const updateAluno = (id, aluno) =>
  axios.put(`${BASE_URL}/alunos/${id}`, toSnakeCase(aluno))
    .then(res => toCamelCase(res.data));

export const deleteAluno = (id) =>
  axios.delete(`${BASE_URL}/alunos/${id}`).then(res => res.data);