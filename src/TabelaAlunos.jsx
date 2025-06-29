import { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './TabelaAlunos.css';

function TabelaAlunos({ alunos, onEditar, onGravar, onApagar, editIndex }) {
  const [draftAluno, setDraftAluno] = useState(null);

  const handleEditClick = (index) => {
    setDraftAluno({ ...alunos[index] });  // cria cópia para edição
    onEditar(index);
  };

  const handleInputChange = (campo, valor) => {
    setDraftAluno(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const handleGravarClick = (index) => {
    onGravar(index, draftAluno);
    setDraftAluno(null);
  };

  if (alunos.length === 0) {
    return <p className="aviso">Sem alunos registados ainda.</p>;
  }

  return (
    <div>
      <div className="export-buttons">
        <button onClick={() => exportPDF(alunos)}>📄 Exportar PDF</button>
        <button onClick={() => exportCSV(alunos)}>📑 Exportar CSV</button>
      </div>

      <table>
        <colgroup>
          <col className="col-renovacao" />
          <col className="col-nome" />
          <col className="col-nascimento" />
          <col className="col-contato" />
          <col className="col-email" />
          <col className="col-nivel" />
          <col className="col-observacoes" />
          <col className="col-acoes" />
        </colgroup>

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
          {alunos.map((aluno, index) => (
            <tr key={index}>
              {editIndex === index ? (
                <>
                  <td><input value={draftAluno.dataRenovacao} onChange={(e) => handleInputChange('dataRenovacao', e.target.value)} /></td>
                  <td><input value={draftAluno.nomeCompleto} onChange={(e) => handleInputChange('nomeCompleto', e.target.value)} /></td>
                  <td><input value={draftAluno.dataNascimento} onChange={(e) => handleInputChange('dataNascimento', e.target.value)} /></td>
                  <td><input value={draftAluno.contato} onChange={(e) => handleInputChange('contato', e.target.value)} /></td>
                  <td><input value={draftAluno.email} onChange={(e) => handleInputChange('email', e.target.value)} /></td>
                  <td><input value={draftAluno.nivel} onChange={(e) => handleInputChange('nivel', e.target.value)} /></td>
                  <td><input value={draftAluno.observacoes} onChange={(e) => handleInputChange('observacoes', e.target.value)} /></td>
                  <td>
                    <button onClick={() => handleGravarClick(index)}>💾 Gravar</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{aluno.dataRenovacao}</td>
                  <td>{aluno.nomeCompleto}</td>
                  <td>{aluno.dataNascimento}</td>
                  <td>{aluno.contato}</td>
                  <td>{aluno.email}</td>
                  <td>{aluno.nivel}</td>
                  <td>{aluno.observacoes}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
  <button
    style={{
      display: 'inline-block',
      marginRight: '5px'
    }}
    onClick={() => handleEditClick(index)}
  >
    ✏️Editar
  </button>
  
  <button
    style={{
      display: 'inline-block'
    }}
    onClick={() => onApagar(index)}
  >
    🗑️Apagar
  </button>
</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

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
    aluno.dataRenovacao,
    aluno.nomeCompleto,
    aluno.dataNascimento,
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
    headStyles: { fillColor: [11, 61, 87] }
  });

  doc.save('Registos_Alunos.pdf');
}

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
    if (isNumber) {
      str = `="${str}"`;
    }
    return `"${str}"`;
  };

  const rows = alunos.map((aluno) =>
    [
      escapeCSV(aluno.dataRenovacao),
      escapeCSV(aluno.nomeCompleto),
      escapeCSV(aluno.dataNascimento),
      escapeCSV(aluno.contato, true),
      escapeCSV(aluno.email),
      escapeCSV(aluno.nivel),
      escapeCSV(aluno.observacoes),
    ].join(';')  // ⚡ separador ponto e vírgula!
  );

  // ⚡ Adiciona BOM para UTF-8
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