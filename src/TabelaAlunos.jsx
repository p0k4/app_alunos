import { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './TabelaAlunos.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faFileCsv, faCircleLeft, faPenToSquare, faTrash, faCheck, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

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
        <button className="voltar-btn" onClick={() => window.history.back()}>
          <FontAwesomeIcon icon={faCircleLeft} /> Voltar</button>
        <div className="export-buttons">
          <button onClick={() => exportPDF(alunos)}>
            <FontAwesomeIcon icon={faFilePdf} /> Exportar PDF
          </button>
          <button onClick={() => exportCSV(alunos)}>
            <FontAwesomeIcon icon={faFileCsv} /> Exportar CSV</button>
        </div>
        <div className="input-container">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
          <input
            type="text"
            placeholder="Pesquisar aluno..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="input-pesquisa"
          />
        </div>
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
                      <button className="btn-gravar" onClick={handleGravarClick}>
                        <FontAwesomeIcon icon={faCheck} /> Gravar
                      </button>
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
                    <td className="acoes">
                      <div className="acoes-botoes">
                        <button className="btn-editar" onClick={() => handleEditClick(aluno)}>
                          <FontAwesomeIcon icon={faPenToSquare} /> Editar
                        </button>
                        <button className="btn-apagar" onClick={() => {
                          if (window.confirm(`⚠️ Atenção!\nDeseja mesmo remover o aluno "${aluno.nomeCompleto}"?`)) {
                            onApagar(aluno.id);
                          }
                        }}>
                          <FontAwesomeIcon icon={faTrash} /> Apagar
                        </button>
                      </div>
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

  const wrapText = (text, limit = 40) => {
    if (!text) return '';
    return text.replace(new RegExp(`(.{1,${limit}})(\\s|$)`, 'g'), '$1\n').trim();
  };

  const tableRows = alunos.map((aluno) => [
    formatarData(aluno.dataRenovacao),
    wrapText(aluno.nomeCompleto),
    formatarData(aluno.dataNascimento),
    aluno.contato,
    wrapText(aluno.email),
    aluno.nivel,
    wrapText(aluno.observacoes)
  ]);

autoTable(doc, {
  head: [tableColumn],
  body: tableRows,
  startY: 20,
  theme: 'grid',
  margin: { left: 20, right: 20 },
  styles: { fontSize: 10 },
  headStyles: { fillColor: [11, 61, 87] },
  columnStyles: {
    6: { cellWidth: 100, overflow: 'linebreak' } // Observações maior e quebra automático
  }
});

  doc.save('Registos_Alunos.pdf');
}

function exportCSV(alunos) {
  const header = [
    'Data de Renovação',
    'Nome Completo',
    'Data de Nascimento',
    'Nível',
    'Contato',
    'Email',
    'Observações',
  ];

  const escapeCSV = (text) => {
    if (text == null) return '';
    let str = String(text).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = alunos.map((aluno) =>
    [
      escapeCSV(formatarData(aluno.dataRenovacao)),
      escapeCSV(aluno.nomeCompleto),
      escapeCSV(formatarData(aluno.dataNascimento)),
      escapeCSV(aluno.nivel),
      escapeCSV(aluno.contato),
      escapeCSV(aluno.email),
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