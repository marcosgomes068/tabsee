const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, 'data', 'input', 'Controle_Qualidade_Frigorifico.xlsx');

try {
  console.log('Lendo arquivo:', filePath);
  const workbook = XLSX.readFile(filePath);
  
  console.log('\nPlanilhas encontradas:', workbook.SheetNames);
  
  workbook.SheetNames.forEach(sheetName => {
    console.log(`\n=== Planilha: ${sheetName} ===`);
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    console.log(`Linhas: ${data.length}`);
    
    if (data.length > 0) {
      const columns = Object.keys(data[0]);
      console.log(`Colunas (${columns.length}):`, columns);
      
      // Verificar tipos
      const numericCols = columns.filter(col => typeof data[0][col] === 'number');
      const textCols = columns.filter(col => typeof data[0][col] === 'string');
      
      console.log(`  - Numéricas: ${numericCols.length}`, numericCols);
      console.log(`  - Texto: ${textCols.length}`, textCols);
      
      console.log('\nPrimeira linha de dados:');
      console.log(JSON.stringify(data[0], null, 2));
    }
  });
  
  console.log('\n✅ Arquivo processado com sucesso!');
} catch (error) {
  console.error('❌ Erro ao processar arquivo:', error.message);
  console.error(error);
}
