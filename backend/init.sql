-- backend/init.sql
CREATE TABLE IF NOT EXISTS alunos (
  id SERIAL PRIMARY KEY,
  data_renovacao DATE,
  nome_completo TEXT,
  data_nascimento DATE,
  contato TEXT,
  email TEXT,
  nivel TEXT,
  observacoes TEXT
);
