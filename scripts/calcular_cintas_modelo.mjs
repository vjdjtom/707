import fs from 'node:fs/promises';
import {FileBlob,SpreadsheetFile} from '@oai/artifact-tool';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const root=path.resolve(process.argv.find((a,i)=>i>1&&!a.startsWith('--'))||path.join(repo,'work/cintas'));
await fs.mkdir(path.join(root,'work'),{recursive:true});
await fs.mkdir(path.join(root,'outputs'),{recursive:true});
const wb=await SpreadsheetFile.importXlsx(await FileBlob.load(`${repo}/planilhas/Memorias_Aco_707_Parcelas_Calculadas.xlsx`));
const v=(s,c,x)=>s.getRange(c).values=[[x]], f=(s,c,x)=>s.getRange(c).formulas=[[x]];
if(process.argv.includes('--antes')){const p=await wb.render({sheetName:'Curvas e caudas',range:'A6:J12',scale:1,format:'png'});await fs.writeFile(`${root}/work/cintas-antes.png`,new Uint8Array(await p.arrayBuffer()));process.exit(0);}
function init(name,title,head,widths){const s=wb.worksheets.add(name);s.showGridLines=false;const end=String.fromCharCode(64+head.length);s.getRange(`A1:${end}50`).format.font={name:'Arial',size:10,color:'#203A55'};s.getRange(`A1:${end}50`).format.rowHeight=28;v(s,'A2',title);s.getRange('A2').format.font={size:16,bold:true};s.getRange(`A6:${end}6`).values=[head];s.getRange(`A6:${end}6`).format={fill:'#203A55',font:{bold:true,color:'#FFFFFF'},wrapText:true,rowHeight:52,verticalAlignment:'center'};widths.forEach((w,i)=>s.getRangeByIndexes(0,i,50,1).format.columnWidth=w);s.freezePanes.freezeRows(6);return s;}
const c=init('Cintas retangulares','Desenvolvimento geométrico de cintas Ø8', ['Tipo / peça','B m','H m','Recobrimento m','Ø mm','Raio eixo m','B ao eixo m','H ao eixo m','Retos m','Arcos m','Caudas m','Corte modelo m','kg por cinta','kg/m a 0,20','kg/m a 0,10'],[27,11,11,19,11,17,17,17,16,16,16,20,18,19,19]);
v(c,'A4','Modelo: três cantos de 90°, dois fechos de 135° e duas caudas 5Ø; mandril 5Ø em todas as curvas.');
v(c,'A5','Des.05 p.8: quadro, fecho e recobrimentos. Aplicação por ocorrência PENDENTE; confirmar forma, exposição e mandril dos cantos.');
const geoms=[['P1/P8 exterior',.3,.6],['P2 exterior',.4,.7],['P3/P4/P5 simples',.4,.2],['P6 simples',.3,.3],['P7 inferior simples',.5,.3]];
let records=[];
for(let i=0;i<10;i++){
 const r=i+7,g=geoms[Math.floor(i/2)];v(c,`A${r}`,g[0]);v(c,`B${r}`,g[1]);v(c,`C${r}`,g[2]);
 f(c,`D${r}`,`='Pormenores PDF'!$B$${i%2?21:7}`);f(c,`E${r}`,"='Pormenores PDF'!$B$8");
 f(c,`F${r}`,`=('Pormenores PDF'!$B$20+1)*E${r}/2000`);
 f(c,`G${r}`,`=B${r}-2*D${r}-E${r}/1000`);f(c,`H${r}`,`=C${r}-2*D${r}-E${r}/1000`);
 f(c,`I${r}`,`=2*(G${r}+H${r})-8*F${r}`);
 f(c,`J${r}`,`=3*PI()*F${r}`);
 f(c,`K${r}`,`=2*'Pormenores PDF'!$B$18*E${r}/1000`);
 f(c,`L${r}`,`=IF(AND(G${r}>2*F${r},H${r}>2*F${r}),SUM(I${r}:K${r}),"PENDENTE")`);
 f(c,`M${r}`,`=IF(ISNUMBER(L${r}),L${r}*VLOOKUP(E${r},'Como utilizar'!$D$7:$E$14,2,FALSE),"PENDENTE")`);
 f(c,`N${r}`,`=IF(ISNUMBER(M${r}),M${r}/'Pormenores PDF'!$B$9,"PENDENTE")`);
 f(c,`O${r}`,`=IF(ISNUMBER(M${r}),M${r}/'Pormenores PDF'!$B$10,"PENDENTE")`);
}
c.getRange('B7:O16').setNumberFormat('0.000000');c.getRange('B7:D16').setNumberFormat('0.000');c.getRange('E7:E16').setNumberFormat('0');
v(c,'A19','Retos: 2(B_eixo + H_eixo) − 8R. Arcos: 3 × πR/2 + 2 × 3πR/4 = 3πR. Caudas: 2 × 5Ø.');
v(c,'A21','N/O são frequências por metro, sem cintas de extremidade. Quantidade inteira exige zonas e posições reais.');
v(c,'A23','P1/P2/P8: falta a cinta interior. P7 circular e P9/P10/P11 sobrepostos não estão representados neste modelo.');
v(c,'A25','Os cortes calculados não foram transferidos para Armaduras base: mandril dos cantos e aplicação do fecho ainda requerem confirmação.');
const z=init('A E8 níveis','Fração A — P1 junto aos eixos E e 8', ['Troço','Nível inferior m','Nível superior m','Entre níveis m','Longitudinal kg/m','Referência reta kg','Ajuste de corte m','Corte real m','Total aço kg','Fonte / estado'],[22,21,21,20,24,23,23,21,22,65]);
v(z,'A4','Diferenças de níveis estruturais: não são alturas livres nem comprimentos finais dos varões.');
v(z,'A5','Fontes: des.07 p.10 (P1 E/8, níveis P0/P1); des.08 p.11 (corte B-B, nível superior da viga no eixo 8).');
for(const [r,label,lo,hi] of [[7,'P0 a P1',-.2,3.22],[8,'P1 a cobertura',3.22,6.45]]){
 v(z,`A${r}`,label);v(z,`B${r}`,lo);v(z,`C${r}`,hi);f(z,`D${r}`,`=C${r}-B${r}`);
 f(z,`E${r}`,"='Aço projeto por tipo'!B7");f(z,`F${r}`,`=D${r}*E${r}`);
 v(z,`G${r}`,'PENDENTE');v(z,`H${r}`,'PENDENTE');v(z,`I${r}`,'PENDENTE');
 v(z,`J${r}`,'Níveis lidos; associação local da cobertura depende de continuidade da viga V4. Confirmar faces e corte por grupo de Ø.');
}
z.getRange('B7:F8').setNumberFormat('0.0000');z.getRange('J7:J8').format.wrapText=true;z.getRange('A7:J8').format.rowHeight=64;
v(z,'A11','A referência reta quantifica apenas a distância entre níveis. Emendas, curvaturas, faces de término e cintas permanecem fora deste valor.');
const eq=(a,b)=>{if(Math.abs(a-b)>1e-8)throw Error(`${a} != ${b}`)};
wb.recalculate();eq(c.getRange('L11').values[0][0],1.042194671058465);eq(c.getRange('L7').values[0][0]-c.getRange('L8').values[0][0],.16);
const old=c.getRange('B11').values[0][0];v(c,'B11',.01);if(c.getRange('L11').values[0][0]!=='PENDENTE')throw Error('Geometria inválida liberada');v(c,'B11',old);
eq(z.getRange('D7').values[0][0],3.42);eq(z.getRange('D8').values[0][0],3.23);eq(z.getRange('F7').values[0][0],3.42*18.348);
wb.recalculate();
for(let i=7;i<=16;i++)records.push({tipo:c.getRange(`A${i}`).values[0][0],recobrimento_m:c.getRange(`D${i}`).values[0][0],corte_modelo_m:c.getRange(`L${i}`).values[0][0],kg_por_cinta:c.getRange(`M${i}`).values[0][0],estado_aplicacao:'PENDENTE',criterio:'3x90 + 2x135; mandril5Ø; duas caudas5Ø; Ø8',fonte:'D05-MAPA-PILARES; D05-FECHO-CINTAS; p.8'});
console.log((await wb.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#NUM!',options:{useRegex:true,maxResults:10},maxChars:1500})).ndjson);
for(const [sheet,range,file] of [['Cintas retangulares','A6:H16','geometria'],['Cintas retangulares','I6:O16','cortes'],['A E8 níveis','A6:J8','niveis']]){const p=await wb.render({sheetName:sheet,range,scale:1,format:'png'});await fs.writeFile(`${root}/work/cintas-${file}.png`,new Uint8Array(await p.arrayBuffer()));}
await fs.writeFile(`${root}/work/cintas-resultados.json`,JSON.stringify(records,null,2));
const o=await SpreadsheetFile.exportXlsx(wb);await o.save(`${root}/outputs/Memorias_Aco_707_Cintas_e_Niveis.xlsx`);
console.log('10 cortes de modelo; 2 intervalos de níveis; testes passaram; aplicação final PENDENTE.');
