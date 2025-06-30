import express from 'express';
import cors from 'cors';
import pg from 'pg';

const { Pool } = pg;

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'martins',
  host: 'localhost',
  database: 'rnv_db',
  password: 'bdrn.admin',
  port: 5432
});

pool.connect()
  .then(() => console.log('✅ Conectado ao PostgreSQL!'))
  .catch(err => console.error('❌ Erro ao conectar ao PostgreSQL', err));

// GET
app.get('/alunos', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM alunos ORDER BY id ASC');
    res.json(resultado.rows);
  } catch (error) {
    console.error('Erro ao buscar alunos:', error);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// POST
app.post('/alunos', async (req, res) => {
  const {
    data_renovacao,
    nome_completo,
    data_nascimento,
    contato,
    email,
    nivel,
    observacoes
  } = req.body;

  try {
    const resultado = await pool.query(
      `INSERT INTO alunos (data_renovacao, nome_completo, data_nascimento, contato, email, nivel, observacoes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [data_renovacao, nome_completo, data_nascimento, contato, email, nivel, observacoes]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error('❌ Erro ao inserir aluno:', error);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// PUT
app.put('/alunos/:id', async (req, res) => {
  const { id } = req.params;
  const {
    data_renovacao,
    nome_completo,
    data_nascimento,
    contato,
    email,
    nivel,
    observacoes
  } = req.body;

  try {
    const resultado = await pool.query(
      `UPDATE alunos SET
         data_renovacao = $1,
         nome_completo = $2,
         data_nascimento = $3,
         contato = $4,
         email = $5,
         nivel = $6,
         observacoes = $7
       WHERE id = $8
       RETURNING *`,
      [data_renovacao, nome_completo, data_nascimento, contato, email, nivel, observacoes, id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar aluno:', error);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// DELETE
app.delete('/alunos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await pool.query(
      'DELETE FROM alunos WHERE id = $1 RETURNING *',
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }

    res.json({ message: 'Aluno apagado com sucesso' });
  } catch (error) {
    console.error('Erro ao apagar aluno:', error);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Servidor a correr em http://localhost:${port}`);
});