import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {FileBlob, SpreadsheetFile} from '@oai/artifact-tool';
const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const root = path.resolve(process.argv.find((a,i)=>i>1&&!a.startsWith('--')) || path.join(repo,'work/aco-calculo'));
await fs.mkdir(path.join(root,'work'),{recursive:true});
const out = `${root}/outputs`;
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(`${repo}/planilhas/Memorias_Unitarias_707_Revisao_Pilares.xlsx`));
await fs.mkdir(out,{recursive:true});
if(process.argv.includes('--antes')) {
  const img=await wb.render({sheetName:'Armaduras base',range:'A6:J10',scale:1,format:'png'});
  await fs.writeFile(`${root}/work/aco-antes.png`,new Uint8Array(await img.arrayBuffer()));
  process.exit(0);
}
const v=(s,c,x)=>s.getRange(c).values=[[x]], f=(s,c,x)=>s.getRange(c).formulas=[[x]];
function sheet(name,title,headers,widths){
 const s=wb.worksheets.add(name); s.showGridLines=false;
 const end=String.fromCharCode(64+headers.length);
 s.getRange(`A1:${end}65`).format.font={name:'Arial',size:10,color:'#203A55'};
 s.getRange(`A1:${end}65`).format.rowHeight=26;
 v(s,'A2',title);s.getRange('A2').format.font={size:16,bold:true};
 s.getRange(`A6:${end}6`).values=[headers];
 s.getRange(`A6:${end}6`).format={fill:'#203A55',font:{color:'#FFFFFF',bold:true},wrapText:true,rowHeight:50,verticalAlignment:'center'};
 widths.forEach((w,i)=>s.getRangeByIndexes(0,i,65,1).format.columnWidth=w);
 s.freezePanes.freezeRows(6);return s;
}
const em=sheet('Emendas calculadas','Aço longitudinal e emendas de 50Ø',
 ['Tipo','Grupo','N.º no tipo','Ø mm','kg/m tabelado','Base kg/m','50Ø m/varão','kg/emenda individual','kg se todos emendados','Varões emendados reais','Emendas kg reais','Fonte / aplicação'],[15,22,14,12,16,16,17,20,22,22,20,54]);
v(em,'A4','I é referência para uma emenda em cada varão do grupo. J exige contagem real por localização; vazio mantém K PENDENTE.');
v(em,'A5','Fonte: Des.05, PDF completo p.8; D05-MAPA-PILARES e D05-EMENDAS. Pesos tabelados da memória anterior.');
const arms=wb.worksheets.getItem('Armaduras base');
const mapping=[];
let r=7;
for(let a=7;a<=64;a++){
 const row=arms.getRange(`A${a}:D${a}`).values[0];
 if(!String(row[1]).startsWith('Longitudinal'))continue;
 v(em,`A${r}`,row[0]);v(em,`B${r}`,row[1]);
 f(em,`C${r}`,`='Armaduras base'!D${a}`); f(em,`D${r}`,`='Armaduras base'!C${a}`);
 f(em,`E${r}`,`='Armaduras base'!H${a}`);
 f(em,`F${r}`,`=C${r}*E${r}`);
 f(em,`G${r}`,`='Pormenores PDF'!$B$13*D${r}/1000`);
 f(em,`H${r}`,`=G${r}*E${r}`);f(em,`I${r}`,`=C${r}*H${r}`);
 f(em,`K${r}`,`=IF(AND(ISNUMBER(J${r}),J${r}>=0,J${r}<=C${r},J${r}=INT(J${r})),J${r}*H${r},"PENDENTE")`);
 v(em,`L${r}`,'50Ø apenas na emenda abrangida pelo pormenor; não repetir por metro.');
 mapping.push({row:r,type:row[0],n:row[3],diameter:row[2]});r++;
}
em.getRange(`E7:K${r-1}`).setNumberFormat('0.0000');em.getRange(`J7:J${r-1}`).setNumberFormat('0');
em.getRange(`J7:J${r-1}`).format.fill='#FFF2CC';em.getRange(`L7:L${r-1}`).format.wrapText=true;em.getRange(`A7:L${r-1}`).format.rowHeight=42;
const ct=sheet('Curvas e caudas','Cintas Ø8 — parcelas do desenvolvimento',
 ['Parcela','Ø mm','Diâmetro interior / Ø','Raio ao eixo m','Ângulo graus','Cauda / Ø','Arco m','Cauda m','Parcela m','Peso kg','Fonte / limite'],[32,12,18,18,15,14,16,16,18,16,59]);
v(ct,'A4','Cada linha é uma parcela geométrica. Não somar alternativas nem considerar estes valores o corte de uma cinta completa.');
v(ct,'A5','Fonte: PDF completo p.8, D05-FECHO-CINTAS. 90° e 135° são parcelas de cálculo, sem contagem aplicada ao elemento.');
const parts=[['Arco de 90°',90,0],['Arco de 135°',135,0],['Cauda de cinta 5Ø',0,5],['Cauda de gancho 6Ø',0,6],['Arco 135° + cauda 5Ø',135,5],['Arco 135° + cauda 6Ø',135,6]];
for(let i=0;i<parts.length;i++){
 const n=i+7,[label,angle,tail]=parts[i];v(ct,`A${n}`,label);
 f(ct,`B${n}`,"='Pormenores PDF'!$B$8");f(ct,`C${n}`,"='Pormenores PDF'!$B$20");
 f(ct,`D${n}`,`=(C${n}+1)*B${n}/2000`);v(ct,`E${n}`,angle);v(ct,`F${n}`,tail);
 f(ct,`G${n}`,`=PI()*D${n}*E${n}/180`);f(ct,`H${n}`,`=F${n}*B${n}/1000`);
 f(ct,`I${n}`,`=G${n}+H${n}`);f(ct,`J${n}`,`=I${n}*VLOOKUP(B${n},'Como utilizar'!$D$7:$E$14,2,FALSE)`);
 v(ct,`K${n}`,'Raio = (diâmetro interior + Ø)/2. A contagem de curvas/caudas pertence ao corte de cada peça.');
}
ct.getRange('D7:J12').setNumberFormat('0.000000');ct.getRange('E7:F12').setNumberFormat('0');ct.getRange('K7:K12').format.wrapText=true;ct.getRange('A7:K12').format.rowHeight=45;
v(ct,'A15','Corte completo = trechos retos entre tangências + arcos + caudas. Descontar tangências antes de adicionar curvas.');
v(ct,'A17','Cintas interiores, sobrepostas e fechos: PENDENTE a composição completa da peça. Nenhum corte foi liberado por aproximação.');
const resumo=sheet('Aço projeto por tipo','Pilares — parcelas calculadas e total pendente',
 ['Tipo','Longitudinal kg/m','50Ø em todos kg','Altura do troço m','Longitudinal reto kg','Cintas kg','Arranques e outros kg','Emendas reais kg','Total do troço kg','Pendência','Elemento / fonte'],[16,21,21,18,23,18,25,23,23,55,55]);
v(resumo,'A4','B e C são referências unitárias. Total de projeto exige altura, cintas, arranques e emendas reais confirmados.');
v(resumo,'A5','Cada linha calcula um troço identificado em K. Não representa o total das ocorrências desse tipo nem alimenta o auto.');
const ids=[...new Set(mapping.map(x=>x.type))];
for(let i=0;i<ids.length;i++){
 const n=i+7,id=ids[i];v(resumo,`A${n}`,id);
 f(resumo,`B${n}`,`=SUMIFS('Emendas calculadas'!$F$7:$F$${r-1},'Emendas calculadas'!$A$7:$A$${r-1},A${n})`);
 f(resumo,`C${n}`,`=SUMIFS('Emendas calculadas'!$I$7:$I$${r-1},'Emendas calculadas'!$A$7:$A$${r-1},A${n})`);
 f(resumo,`E${n}`,`=IF(AND(ISNUMBER(D${n}),D${n}>0),B${n}*D${n},"PENDENTE")`);
 f(resumo,`H${n}`,`=IF(COUNTIFS('Emendas calculadas'!$A$7:$A$${r-1},A${n},'Emendas calculadas'!$K$7:$K$${r-1},"PENDENTE")>0,"PENDENTE",SUMIFS('Emendas calculadas'!$K$7:$K$${r-1},'Emendas calculadas'!$A$7:$A$${r-1},A${n}))`);
 f(resumo,`I${n}`,`=IF(AND(ISNUMBER(E${n}),ISNUMBER(F${n}),F${n}>=0,ISNUMBER(G${n}),G${n}>=0,ISNUMBER(H${n}),K${n}<>""),SUM(E${n}:H${n}),"PENDENTE")`);
 f(resumo,`J${n}`,`=IF(I${n}="PENDENTE","Faltam altura, parcelas ou fonte do elemento","Parcelas preenchidas; conferir fonte por ocorrência")`);
}
resumo.getRange('B7:I25').setNumberFormat('0.0000');resumo.getRange('D7:D25').format.fill='#FFF2CC';resumo.getRange('F7:G25').format.fill='#FFF2CC';resumo.getRange('K7:K25').format.fill='#FFF2CC';resumo.getRange('J7:J25').format.wrapText=true;resumo.getRange('A7:J25').format.rowHeight=40;
const guide=wb.worksheets.getItem('Como utilizar');v(guide,'A30','Continuidade do cálculo de aço');v(guide,'B30','Novas folhas: Emendas calculadas, Curvas e caudas e Aço projeto por tipo. Parcial de projeto; alturas e cortes completos ainda pendentes.');guide.getRange('B30').format.wrapText=true;guide.getRange('A30:B30').format.rowHeight=70;
for(const [s,range] of [[em,`K7:K${r-1}`],[resumo,'E7:J25']])s.getRange(range).conditionalFormats.add('containsText',{text:'PENDENTE',format:{fill:'#FCE4D6',font:{color:'#9C2F20'}}});
wb.recalculate();
console.log((await wb.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#NUM!|#NULL!',options:{useRegex:true,maxResults:10},maxChars:1500})).ndjson);
// Exercise real dependencies in memory, then restore unknown project quantities.
const eq=(a,b)=>{if(Math.abs(a-b)>1e-8)throw Error(`Test failed: ${a} != ${b}`)};
eq(em.getRange('I7').values[0][0],7.5744);eq(em.getRange('I8').values[0][0],5.328);
v(em,'J7',3);eq(em.getRange('K7').values[0][0],3.7872);
v(em,'J7',null);if(em.getRange('K7').values[0][0]!=='PENDENTE')throw Error('Missing emenda was released');
v(resumo,'D7',3);eq(resumo.getRange('E7').values[0][0],55.044);
if(resumo.getRange('I7').values[0][0]!=='PENDENTE')throw Error('Partial total was released');v(resumo,'D7',null);
eq(ct.getRange('I11').values[0][0],Math.PI*.024*.75+.04);
wb.recalculate();
for(const [name,range,file] of [['Emendas calculadas','A6:I12','emendas'],['Curvas e caudas','A6:J12','curvas'],['Aço projeto por tipo','A6:J12','projeto'],['Como utilizar','A30:B30','guia']]){
 const img=await wb.render({sheetName:name,range,scale:1,format:'png'});
 await fs.writeFile(`${root}/work/aco-${file}.png`,new Uint8Array(await img.arrayBuffer()));
}
const output=await SpreadsheetFile.exportXlsx(wb);await output.save(`${out}/Memorias_Aco_707_Parcelas_Calculadas.xlsx`);
const results=mapping.map(x=>({tipo:x.type,grupo:em.getRange(`B${x.row}`).values[0][0],n:x.n,diametro:x.diameter,peso_linear:em.getRange(`E${x.row}`).values[0][0],kg_m:em.getRange(`F${x.row}`).values[0][0],emenda_m:em.getRange(`G${x.row}`).values[0][0],kg_emenda:em.getRange(`H${x.row}`).values[0][0],kg_emenda_grupo:em.getRange(`I${x.row}`).values[0][0],fonte:'EST-260928-1; p.8; D05-MAPA-PILARES; D05-EMENDAS',estado_total:'PENDENTE'}));
await fs.writeFile(`${root}/work/aco-resultados.json`,JSON.stringify(results,null,2));
console.log(JSON.stringify({groups:mapping.length,types:ids.length,output:'Memorias_Aco_707_Parcelas_Calculadas.xlsx',tests:'passed'}));
