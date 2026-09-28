import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {FileBlob,SpreadsheetFile} from '@oai/artifact-tool';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
await fs.mkdir(`${root}/work/pilares`,{recursive:true});
const wb=await SpreadsheetFile.importXlsx(await FileBlob.load(`${root}/planilhas/Memorias_Unitarias_707.xlsx`));
const cat=wb.worksheets.getItem('Tipos'),arm=wb.worksheets.getItem('Armaduras base'),ext=wb.worksheets.getItem('Acertos aço'),guide=wb.worksheets.getItem('Como utilizar'),audit=wb.worksheets.getItem('Leitura das abas');
const before=await wb.render({sheetName:'Armaduras base',range:'A6:L10',scale:1,format:'png'});await fs.writeFile(`${root}/work/pilares/antes.png`,new Uint8Array(await before.arrayBuffer()));
if(process.argv.includes('--inspect'))process.exit(0);
const v=(s,c,x)=>s.getRange(c).values=[[x]], f=(s,c,x)=>s.getRange(c).formulas=[[x]];
const blue='#203A55',yellow='#FFF2CC';
function base(s,end,title){s.showGridLines=false;s.getRange(`A1:${end}115`).format.font={name:'Arial',size:10,color:blue};s.getRange(`A1:${end}115`).format.columnWidth=16;s.getRange(`A1:${end}115`).format.rowHeight=25;s.getRange(`A1:${end}115`).format.verticalAlignment='center';v(s,'A2',title);s.getRange('A2').format.font={size:16,bold:true};s.getRange(`A3:${end}3`).format.borders={bottom:{style:'thin',color:'#7893A9'}};}
function head(s,r,labels){s.getRangeByIndexes(r-1,0,1,labels.length).values=[labels];s.getRangeByIndexes(r-1,0,1,labels.length).format={fill:blue,font:{bold:true,color:'#FFFFFF'},wrapText:true,horizontalAlignment:'center',rowHeight:45};}
const refs=wb.worksheets.add('Pormenores PDF');base(refs,'E','Pormenores dos pilares — desenho 05');
refs.getRange('A:A').format.columnWidth=43;refs.getRange('B:C').format.columnWidth=15;refs.getRange('D:D').format.columnWidth=45;refs.getRange('E:E').format.columnWidth=85;
v(refs,'A4','FERCA, L-337/21, desenho 05, revisão –, abril 2025. Leitura direta do PDF fornecido pelo utilizador.');
v(refs,'A5','Fonte: https://github.com/vjdjtom/707/blob/main/docs/mapa_de_pilares.pdf');
head(refs,6,['Parâmetro / detalhe','Valor','Unidade','Local no desenho','Aplicação e limite']);
const params=[
 ['Recobrimento de vigas e pilares',0.03,'m','Notas — recobrimentos','Faces em contacto com solo: 0,05 m. Conferir o caso real.'],
 ['Diâmetro das cintas do quadro',8,'mm','Quadro P1–P11','Não define por si o comprimento desenvolvido das cintas.'],
 ['Passo normal a',0.20,'m','Quadro P1–P11','Usar fora das zonas densificadas.'],
 ['Passo densificado a/2',null,'m','Pormenores de pilares','0,10 m quando a=0,20 m. Contar por zona.'],
 ['Zona de 0,60 m',0.60,'m','Continuidade / variação / último / nascer','Aplicar somente nas faces do nó indicadas no pormenor correspondente.'],
 ['Zona no arranque de fundação',0.80,'m','Pormenor de arranque de pilar','Difere da zona genérica de 0,60 m. Não aplicar ambas ao mesmo intervalo.'],
 ['Emenda indicada',50,'×Ø','Continuidade / variação de secção','Aplicar às barras e ao nó efetivamente abrangidos. Não repetir por metro.'],
 ['Trecho horizontal no último troço',0.30,'m','Pormenor do último troço de pilar','É uma cota do segmento; não inclui automaticamente todo o desenvolvimento da dobra.'],
 ['Trecho horizontal do arranque',0.30,'m','Pormenor de arranque de pilar','Completar com parte embebida e desenvolvimento de curvas, conforme corte.'],
 ['Trecho horizontal ao nascer em laje',0.50,'m','Pormenor de pilar a nascer em laje','Não é um transpasse genérico de 0,50 m.'],
 ['Cota de embebimento ao nascer em parede',1.20,'m','Pormenor de pilar a nascer em parede','Confirmar orientação do corte e desenvolvimento completo da barra.'],
 ['Cauda indicada no fecho de cinta',5,'×Ø','Pormenor de fecho — cinta','Substitui a hipótese genérica de caudas 10Ø para este detalhe. Não basta para fechar todos os cortes.'],
 ['Cauda indicada no gancho',6,'×Ø','Pormenor de fecho — gancho','Distinguir gancho de cinta. Não aplicar esta cota a todas as peças.'],
 ['Diâmetro interior de dobragem',5,'×Ø','Pormenor de fecho','Medir comprimento pela linha média; não somar perímetros e caudas sem tratar curvas.'],
 ['Recobrimento de faces em contacto com solo',0.05,'m','Notas — recobrimentos','Depende de exposição, não apenas do nome do piso.'],
 ['Recobrimento de lajes e paredes',0.025,'m','Notas — recobrimentos','Diverge de algumas entradas anteriores. Rever na etapa própria desses elementos.'],
];
refs.getRange('A7:E22').values=params;f(refs,'B10','=B9/2');refs.getRange('A7:E22').format.wrapText=true;refs.getRange('A7:E22').format.rowHeight=54;refs.getRange('B7:B22').setNumberFormat('0.000');
v(refs,'A25','Alturas dos troços');v(refs,'E25','Não são fornecidas no quadro. A altura de 3,90 m do P8-P1 vem da planilha, não deste PDF.');refs.getRange('E25').format.wrapText=true;refs.getRange('A25:E25').format.rowHeight=45;
v(refs,'A27','Cortes de cintas ainda pendentes');v(refs,'E27','Cintas interiores de P1/P2/P8 e sobreposições de P9/P10/P11 não têm cotas internas suficientes para corte final. Não medir pela escala gráfica.');refs.getRange('E27').format.wrapText=true;refs.getRange('A27:E27').format.rowHeight=55;
// Confirmed geometry and longitudinal data: existing numeric entries agree with the drawing.
for(let r=7;r<=25;r++){
 const id=cat.getRange(`A${r}`).values[0][0];const p=Number(id.match(/^P(\d+)/)[1]);
 v(cat,`R${r}`,'Secção / long. conferidos');v(cat,`P${r}`,`Des.05 — quadro ${id}; Barba PILARES linha ${r-1}`);
 let text='Quadro do PDF: secção e armadura longitudinal conferidas; cintas Ø8, a=0,20 m. Altura não cotada no PDF. ';
 if([1,2,8].includes(p))text+='Cinta exterior e interior: cortes distintos, interior sem cotas de desenvolvimento.';
 else if([9,10,11].includes(p))text+='Cintas sobrepostas: representar o comprimento somado de todas as peças do conjunto, não uma cinta exterior única.';
 else if(p===7&&id!=='P7-P0')text+='Cinta circular Ø30; não identificada como espiral. Corte/fecho a confirmar.';
 else text+='Cinta simples representada. Corte final depende da linha média, curvas e fecho; não copiado por aproximação.';
 if(['P6-P0','P7-P0'].includes(id))text+=' Encontro com parede: conferir faces efetivamente cofradas.';
 v(cat,`Q${r}`,text);cat.getRange(`A${r}:R${r}`).format.rowHeight=65;
}
for(let r=7;r<=64;r++){
 const id=arm.getRange(`A${r}`).values[0][0],name=arm.getRange(`B${r}`).values[0][0];
 v(arm,`K${r}`,`Des.05 — quadro ${id}`);
 if(name.startsWith('Longitudinal'))v(arm,`L${r}`,'Quantidade/Ø conferidos no PDF. Base reta de 1 m; emendas, embebimentos e dobras medidos separadamente.');
 else{
  const p=Number(id.match(/^P(\d+)/)[1]);
  f(arm,`E${r}`,"='Pormenores PDF'!$B$9");
  if([9,10,11].includes(p)){v(arm,`B${r}`,'Conjunto de cintas sobrepostas');v(arm,`L${r}`,'Corte unitário = soma dos cortes de todas as peças do conjunto representado. Dimensões internas pendentes.');}
  else v(arm,`L${r}`,'Passo normal conferido no PDF. Nas zonas a/2 usar contagem real e registar diferença em Acertos aço. Corte permanece por confirmar.');
 }
 arm.getRange(`A${r}:L${r}`).format.rowHeight=44;arm.getRange(`L${r}`).format.wrapText=true;
}
// Extend existing adjustments with source-backed segment formulas; no new executed quantities.
ext.getRange('K1:L106').format.font={name:'Arial',size:10,color:blue};ext.getRange('K:K').format.columnWidth=26;ext.getRange('L:L').format.columnWidth=22;
head(ext,6,['Tipo','Parcela / localização','N.º varões (+/−)','Ø mm','Comp. adicional m','Peso linear kg/m','Acerto kg','Estado','Desenho / registo','Justificação','Critério do comprimento','Comprimento livre m']);
v(ext,'A4','Emendas/segmentos: selecionar o critério em K. Compor curvas/embebimentos à parte. Cintas: indicar diferença face à base já medida.');
ext.getRange('K7:K106').format.fill=yellow;ext.getRange('L7:L106').format.fill=yellow;ext.getRange('E7:E106').format.fill='#EEF3F7';
ext.getRange('K7:K106').dataValidation={rule:{type:'list',values:['Livre','Emenda 50Ø','Segmento 0,30 m','Segmento 0,50 m']}};
for(let r=7;r<=106;r++){
 f(ext,`E${r}`,`=IF(K${r}="","",IF(K${r}="Livre",IF(AND(ISNUMBER(L${r}),L${r}>0),L${r},"Pendente"),IF(K${r}="Emenda 50Ø",IF(AND(ISNUMBER(D${r}),D${r}>0),'Pormenores PDF'!$B$13*D${r}/1000,"Pendente"),IF(K${r}="Segmento 0,30 m",'Pormenores PDF'!$B$14,IF(K${r}="Segmento 0,50 m",'Pormenores PDF'!$B$16,"Pendente")))))`);
 f(ext,`H${r}`,`=IF(COUNTA(A${r}:D${r},I${r}:L${r})=0,"",IF(AND(COUNTIF(Tipos!$A$7:$A$52,A${r})=1,B${r}<>"",ISNUMBER(C${r}),C${r}<>0,C${r}=INT(C${r}),ISNUMBER(F${r}),ISNUMBER(E${r}),E${r}>0,I${r}<>"",J${r}<>""),"OK","Pendente"))`);
}
ext.getRange('L7:L106').setNumberFormat('0.000');
// Count actual ties by station; shared boundary belongs to the previous interval.
const zones=wb.worksheets.add('Contagem de cintas');base(zones,'K','Cintas — contagem por zona e por mês');
v(zones,'A4','Uma linha por zona de passo constante e por peça/conjunto. Cotar tudo a partir da mesma origem no troço.');
v(zones,'A5','Vazio em E = nenhuma cinta anterior nessa zona. J compara a contagem real com a base 1/a já usada; transferir só a diferença para Acertos aço.');
head(zones,7,['Tipo','Peça / zona','Primeira cinta x₀ m','Passo da zona m','Limite anterior m','Limite atual m','Conjuntos por nível','N.º anterior','N.º acumulado','N.º do mês','Registo / origem']);
zones.getRange('A:A').format.columnWidth=23;zones.getRange('B:B').format.columnWidth=30;zones.getRange('K:K').format.columnWidth=55;
zones.getRange('A8:G107').format.fill=yellow;zones.getRange('K8:K107').format.fill=yellow;
zones.getRange('A8:A107').dataValidation={rule:{type:'list',formula1:'Tipos!$A$7:$A$25'}};
zones.getRange('D8:D107').dataValidation={rule:{type:'decimal',operator:'between',formula1:0.001,formula2:1}};
for(let r=8;r<=107;r++){
 const valid=`AND(ISNUMBER(C${r}),ISNUMBER(D${r}),D${r}>0,ISNUMBER(F${r}),F${r}>=C${r},ISNUMBER(G${r}),G${r}>0,G${r}=INT(G${r}),OR(E${r}="",AND(ISNUMBER(E${r}),E${r}<=F${r})))`;
 f(zones,`H${r}`,`=IF(COUNTA(A${r}:G${r},K${r})=0,"",IF(${valid},IF(E${r}="",0,IF(E${r}<C${r},0,(INT(ROUND((E${r}-C${r})/D${r},8))+1)*G${r})),"Pendente"))`);
 f(zones,`I${r}`,`=IF(COUNTA(A${r}:G${r},K${r})=0,"",IF(${valid},(INT(ROUND((F${r}-C${r})/D${r},8))+1)*G${r},"Pendente"))`);
 f(zones,`J${r}`,`=IF(I${r}="","",IF(AND(ISNUMBER(H${r}),ISNUMBER(I${r})),I${r}-H${r},"Pendente"))`);
}
v(zones,'A110','Para acerto de peso');v(zones,'B111','Acerto = (n.º real total − n.º já incluído em aço base) × corte × kg/m. Não copiar o n.º total como acréscimo.');
v(zones,'B112','Base normal incluída = metros de aço medidos × conjuntos/a. Se a diferença for fracionária, justificar a reconciliação em comprimento/peso.');
v(zones,'B113','As zonas não podem repetir a mesma cinta de fronteira. Usar a posição real da primeira cinta de cada zona.');
zones.getRange('C8:F107').setNumberFormat('0.000');zones.getRange('G8:J107').setNumberFormat('0');zones.freezePanes.freezeRows(7);
// Correct the helper instruction: J is actual monthly count, not automatic delta.
v(zones,'A5','Vazio em E = nenhuma cinta anterior nessa zona. J dá contagem real do mês; calcular o acerto face à base normal antes de transferir.');
zones.getRange('H8:J107').conditionalFormats.add('containsText',{text:'Pendente',format:{fill:'#FCE4D6',font:{color:'#9C2F20'}}});
// Correction of the prior blanket claim about drawing coverage; unrelated geometries remain unchanged.
v(audit,'D17','PDF conferido nesta revisão: inclui muros MS/Pb, paredes Pa e escada E1. A alegação anterior de ausência de muros estava incorreta. Vigas V1/V2 e sapatas S1–S7 não identificadas.');
v(guide,'B7','Barba como base e PDF FERCA L-337/21-05 conferido para os 19 troços de pilares. Ver Pormenores PDF; secções/armadura longitudinal confirmadas, cortes e alturas finais ainda pendentes.');
v(guide,'B12','Contagem de cintas por posições e zonas de passo constante na folha própria. Passo normal 0,20; densificado 0,10. Arranque de fundação: zona 0,80 m; demais detalhes indicados: 0,60 m.');
v(guide,'B14','Em Acertos aço, escolher K: Livre, Emenda 50Ø ou segmento cotado. Livre usa L. E é fórmula. Os segmentos de 0,30/0,50 m não substituem o desenvolvimento completo da dobra.');
v(guide,'B22','46 tipos da Barba. O PDF contém muros/parede/escada E1; esta revisão conferiu os pilares. Rever os restantes elementos em etapa própria, sem supor que estão ausentes do desenho.');
// Source audit report stored in workbook adjacent to reference criteria.
head(refs,30,['Pilar / troço','Secção','Longitudinal','Cintas no quadro','Pendência de corte']);
const summaries=[['P1 (3 troços)','30×60','6Ø16 + 10Ø12','Exterior + interior, Ø8//0,20','Interior não cotada; conferir desenvolvimento de ambas.'],['P2 (2 troços)','40×70','28Ø16','Exterior + interior, Ø8//0,20','Interior não cotada.'],['P3 (1 troço)','40×20','6Ø16 + 6Ø12','Retangular simples Ø8//0,20','Desenvolvimento do fecho / curva.'],['P4 (2 troços)','20×40','6Ø16 + 6Ø12','Retangular simples Ø8//0,20','Desenvolvimento do fecho / curva.'],['P5 (1 troço)','20×40','6Ø16 + 6Ø12','Retangular simples Ø8//0,20','Desenvolvimento do fecho / curva.'],['P6 (2 troços)','30×30','8Ø20 + 4Ø16','Retangular Ø8//0,20','Encontro inferior com parede; conferir corte.'],['P7-P0','50×30','10Ø16','Retangular Ø8//0,20','Encontro com parede.'],['P7-P1 / P7-COB','Ø30','7Ø16','Circular Ø8//0,20','Não assumir espiral; confirmar corte e fecho.'],['P8 (2 troços)','30×60','6Ø16 + 10Ø12','Exterior + interior Ø8//0,20','Interior não cotada. H=3,90 m não vem deste PDF.'],['P9-COB','130×20','16Ø16 + 14Ø10','Conjunto sobreposto Ø8//0,20','Somar peças; dimensões internas por confirmar.'],['P10-COB','20×100','24Ø16','Conjunto sobreposto Ø8//0,20','Somar peças; dimensões internas por confirmar.'],['P11-COB','20×80','8Ø16 + 12Ø12','Conjunto sobreposto Ø8//0,20','Somar peças; dimensões internas por confirmar.']];
refs.getRange('A31:E42').values=summaries;refs.getRange('A31:E42').format.wrapText=true;refs.getRange('A31:E42').format.rowHeight=55;
wb.recalculate();
function eq(s,c,n){const a=s.getRange(c).values[0][0];if(typeof n==='number'?(typeof a!=='number'||Math.abs(a-n)>1e-8):a!==n)throw Error(`${s.name}!${c} ${a} != ${n}`);}
eq(cat,'K7',0.18);eq(cat,'L7',1.8);eq(cat,'N7','Pendente');eq(arm,'I7',9.468);eq(arm,'I8',8.88);eq(refs,'B10',0.1);
ext.getRange('A7:D7').values=[['P1-P0','Teste temporário emenda',6,16]];v(ext,'I7','Teste');v(ext,'J7','Teste');v(ext,'K7','Emenda 50Ø');wb.recalculate();eq(ext,'E7',0.8);eq(ext,'G7',7.5744);v(ext,'K7','Segmento 0,30 m');wb.recalculate();eq(ext,'G7',2.8404);v(ext,'K7','Livre');v(ext,'L7',1.2);wb.recalculate();eq(ext,'G7',11.3616);
zones.getRange('A8:G8').values=[['P1-P0','Zona teste',0,0.1,null,0.8,1]];wb.recalculate();eq(zones,'J8',9);v(zones,'E8',0.4);wb.recalculate();eq(zones,'H8',5);eq(zones,'J8',4);
ext.getRange('A7:D7').clear({applyTo:'contents'});ext.getRange('I7:L7').clear({applyTo:'contents'});zones.getRange('A8:G8').clear({applyTo:'contents'});wb.recalculate();eq(ext,'G7','');eq(zones,'J8','');
console.log((await wb.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!',options:{useRegex:true,maxResults:20},maxChars:2000})).ndjson);
const dest=`${root}/planilhas/Memorias_Unitarias_707_Revisao_Pilares.xlsx`;await(await SpreadsheetFile.exportXlsx(wb)).save(dest);
for(const [name,range] of [['Tipos','A6:R10'],['Armaduras base','A6:L10'],['Acertos aço','A1:L9'],['Pormenores PDF','A1:E22'],['Contagem de cintas','A1:K10'],['Como utilizar','A7:B14'],['Leitura das abas','A16:D18']]){const im=await wb.render({sheetName:name,range,scale:1,format:'png'});await fs.writeFile(`${root}/work/pilares/rev-${name}.png`,new Uint8Array(await im.arrayBuffer()));}
console.log('Tests passed: geometry preserved, longitudinal weights, 50d and segments, monthly zone boundary count; all synthetic inputs removed.');
