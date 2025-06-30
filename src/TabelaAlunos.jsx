import { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './TabelaAlunos.css';

// Formata data ISO ➜ yyyy-mm-dd
function formatarData(dataISO) {
  if (!dataISO) return '';
  return String(dataISO).slice(0, 10);
}

// Normaliza o draft antes de gravar
function normalizarAlunoParaEnvio(aluno) {
  return {
    ...aluno,
    dataRenovacao: formatarData(aluno.dataRenovacao),
    dataNascimento: formatarData(aluno.dataNascimento),
  };
}

function TabelaAlunos({ alunos, onEditar, onGravar, onApagar, editId }) {
  const [draftAluno, setDraftAluno] = useState(null);

  // Iniciar edição com dados formatados
  const handleEditClick = (aluno) => {
    setDraftAluno({
      ...aluno,
      dataRenovacao: formatarData(aluno.dataRenovacao),
      dataNascimento: formatarData(aluno.dataNascimento)
    });
    onEditar(aluno.id);
  };

  // Atualizar inputs
  const handleInputChange = (campo, valor) => {
    setDraftAluno((prev) => ({
      ...prev,
      [campo]: valor
    }));
  };

  // Gravar alterações
  const handleGravarClick = () => {
    if (!draftAluno) return;
    const alunoLimpo = normalizarAlunoParaEnvio(draftAluno);
    onGravar(alunoLimpo.id, alunoLimpo);
    setDraftAluno(null);
  };

  // Sem alunos
  if (!alunos || alunos.length === 0) {
    return <p className="aviso">Sem alunos registados ainda.</p>;
  }

  return (
    <div>
      <div className="export-buttons">
        <button onClick={() => exportPDF(alunos)}>📄 Exportar PDF</button>
        <button onClick={() => exportCSV(alunos)}>📑 Exportar CSV</button>
      </div>

      <table className="tabela-alunos">
        <thead>
          <tr>
            <th>Data de Renovação</th>
            <th>Nome Completo</th>
            <th>Data de Nascimento</th>
            <th>Contato</th>
            <th>Email</th>
            <th>Nível</th>
            <th>Observações</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {alunos.map((aluno) => {
            const emEdicao = editId === aluno.id && draftAluno && draftAluno.id === aluno.id;

            return (
              <tr key={aluno.id}>
                {emEdicao ? (
                  <>
                    <td>
                      <input
                        type="date"
                        value={draftAluno.dataRenovacao || ''}
                        onChange={(e) => handleInputChange('dataRenovacao', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        value={draftAluno.nomeCompleto || ''}
                        onChange={(e) => handleInputChange('nomeCompleto', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        value={draftAluno.dataNascimento || ''}
                        onChange={(e) => handleInputChange('dataNascimento', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        value={draftAluno.contato || ''}
                        onChange={(e) => handleInputChange('contato', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        value={draftAluno.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        value={draftAluno.nivel || ''}
                        onChange={(e) => handleInputChange('nivel', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        value={draftAluno.observacoes || ''}
                        onChange={(e) => handleInputChange('observacoes', e.target.value)}
                      />
                    </td>
                    <td>
                      <button onClick={handleGravarClick}>💾 Gravar</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{formatarData(aluno.dataRenovacao)}</td>
                    <td>{aluno.nomeCompleto}</td>
                    <td>{formatarData(aluno.dataNascimento)}</td>
                    <td>{aluno.contato}</td>
                    <td>{aluno.email}</td>
                    <td>{aluno.nivel}</td>
                    <td>{aluno.observacoes}</td>
                    <td>
                      <button onClick={() => handleEditClick(aluno)}>✏️ Editar</button>
                      <button onClick={() => onApagar(aluno.id)}>🗑️ Apagar</button>
                    </td>
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// EXPORT PDF
function exportPDF(alunos) {
  const doc = new jsPDF({ orientation: 'landscape' });
  doc.text('Registos de Alunos', 14, 16);

  const tableColumn = [
    'Data de Renovação',
    'Nome Completo',
    'Data de Nascimento',
    'Contato',
    'Email',
    'Nível',
    'Observações',
  ];

  const tableRows = alunos.map((aluno) => [
    formatarData(aluno.dataRenovacao),
    aluno.nomeCompleto,
    formatarData(aluno.dataNascimento),
    aluno.contato,
    aluno.email,
    aluno.nivel,
    aluno.observacoes,
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 20,
    theme: 'grid',
    margin: { left: 20, right: 20 },
    tableWidth: 'wrap',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [11, 61, 87] },
  });

  doc.save('Registos_Alunos.pdf');
}

// EXPORT CSV
function exportCSV(alunos) {
  const header = [
    'Data de Renovação',
    'Nome Completo',
    'Data de Nascimento',
    'Contato',
    'Email',
    'Nível',
    'Observações',
  ];

  const escapeCSV = (text, isNumber = false) => {
    if (text == null) return '';
    let str = String(text).replace(/"/g, '""');
    if (isNumber) str = `="${str}"`;
    return `"${str}"`;
  };

  const rows = alunos.map((aluno) =>
    [
      escapeCSV(formatarData(aluno.dataRenovacao)),
      escapeCSV(aluno.nomeCompleto),
      escapeCSV(formatarData(aluno.dataNascimento)),
      escapeCSV(aluno.contato, true),
      escapeCSV(aluno.email),
      escapeCSV(aluno.nivel),
      escapeCSV(aluno.observacoes),
    ].join(';')
  );

  const BOM = '\uFEFF';
  const csvContent = BOM + [header.join(';'), ...rows].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', 'Registos_Alunos.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default TabelaAlunos;