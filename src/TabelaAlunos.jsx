import { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './TabelaAlunos.css';

function formatarData(dataISO) {
  if (!dataISO) return '';
  const [year, month, day] = dataISO.slice(0, 10).split('-');
  return `${day}-${month}-${year}`;
}

function normalizarAlunoParaEnvio(aluno) {
  return {
    ...aluno,
    dataRenovacao: formatarData(aluno.dataRenovacao),
    dataNascimento: formatarData(aluno.dataNascimento),
  };
}

function TabelaAlunos({ alunos, onEditar, onGravar, onApagar, editId }) {
  const [draftAluno, setDraftAluno] = useState(null);
  const [filtro, setFiltro] = useState('');

  const handleEditClick = (aluno) => {
    setDraftAluno({
      ...aluno,
      dataRenovacao: formatarData(aluno.dataRenovacao),
      dataNascimento: formatarData(aluno.dataNascimento)
    });
    onEditar(aluno.id);
  };

  const handleInputChange = (campo, valor) => {
    setDraftAluno((prev) => ({
      ...prev,
      [campo]: valor
    }));
  };

  const handleGravarClick = () => {
    if (!draftAluno) return;
    const alunoLimpo = normalizarAlunoParaEnvio(draftAluno);
    onGravar(alunoLimpo.id, alunoLimpo);
    setDraftAluno(null);
  };

  const alunosFiltrados = alunos.filter((aluno) => {
    const termo = filtro.toLowerCase();
    return (
      aluno.nomeCompleto?.toLowerCase().includes(termo) ||
      aluno.email?.toLowerCase().includes(termo) ||
      aluno.nivel?.toLowerCase().includes(termo) ||
      aluno.contato?.toLowerCase().includes(termo) ||
      aluno.observacoes?.toLowerCase().includes(termo) ||
      formatarData(aluno.dataRenovacao).includes(termo) ||
      formatarData(aluno.dataNascimento).includes(termo)
    );
  });

  if (!alunos || alunos.length === 0) {
    return <p className="aviso">Sem alunos registados ainda.</p>;
  }

  return (
    <div>
      <div className="top-bar">
        <button className="voltar-btn" onClick={() => window.history.back()}>← Voltar</button>
        <div className="export-buttons">
          <button onClick={() => exportPDF(alunos)}>📄 Exportar PDF</button>
          <button onClick={() => exportCSV(alunos)}>📑 Exportar CSV</button>
        </div>
        <input
          type="text"
          placeholder="🔍 Pesquisar aluno..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="input-pesquisa"
        />
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
            <th className="col-observacoes">Observações</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {alunosFiltrados.map((aluno) => {
            const emEdicao = editId === aluno.id && draftAluno && draftAluno.id === aluno.id;

            return (
              <tr key={aluno.id}>
                {emEdicao ? (
                  <>
                    <td><input type="date" value={draftAluno.dataRenovacao || ''} onChange={(e) => handleInputChange('dataRenovacao', e.target.value)} /></td>
                    <td><input value={draftAluno.nomeCompleto || ''} onChange={(e) => handleInputChange('nomeCompleto', e.target.value)} /></td>
                    <td><input type="date" value={draftAluno.dataNascimento || ''} onChange={(e) => handleInputChange('dataNascimento', e.target.value)} /></td>
                    <td><input value={draftAluno.contato || ''} onChange={(e) => handleInputChange('contato', e.target.value)} /></td>
                    <td><input value={draftAluno.email || ''} onChange={(e) => handleInputChange('email', e.target.value)} /></td>
                    <td><input value={draftAluno.nivel || ''} onChange={(e) => handleInputChange('nivel', e.target.value)} /></td>
                    <td><textarea value={draftAluno.observacoes || ''} onChange={(e) => handleInputChange('observacoes', e.target.value)} /></td>
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
                    <td className="col-observacoes">{aluno.observacoes}</td>
                    <th className="acoes">
  <button onClick={() => handleEditClick(aluno)}>✏️ Editar</button>
  <button onClick={() => onApagar(aluno.id)}>🗑️ Apagar</button>
</th>
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