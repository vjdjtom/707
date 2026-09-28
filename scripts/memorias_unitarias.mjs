import { fileURLToPath } from "node:url";
import fs from 'node:fs/promises';
import {Workbook,SpreadsheetFile} from '@oai/artifact-tool';
const root=fileURLToPath(new URL("../",import.meta.url));
await fs.mkdir(`${root}/work/modelo`,{recursive:true});
await fs.mkdir(`${root}/work/base`,{recursive:true});
await fs.mkdir(`${root}/planilhas`,{recursive:true});
const src=JSON.parse(await fs.readFile(`${root}/docs/dados_barba_extraidos.json`,'utf8'));
const wb=Workbook.create();
const [res,exe,cat,arm,extra,audit,guide]=['Resumo mensal','Execução','Tipos','Armaduras base','Acertos aço','Leitura das abas','Como utilizar'].map(n=>wb.worksheets.add(n));
const types=[],parts=[];
const sourceURL='https://github.com/vjdjtom/707/blob/ceaf79b91dfe08fc0ce4f22ac52be038b1ca1b35/planilhas/Barba_Atualizada.xlsx';
const v=(s,c,x)=>s.getRange(c).values=[[x]];const f=(s,c,x)=>s.getRange(c).formulas=[[x]];
const yellow='#FFF2CC',navy='#203A55';
function setup(s,end,title,rows=130){s.showGridLines=false;s.getRange(`A1:${end}${rows}`).format.font={name:'Arial',size:10,color:'#203A55'};s.getRange(`A1:${end}${rows}`).format.columnWidth=15;s.getRange(`A1:${end}${rows}`).format.rowHeight=25;s.getRange(`A1:${end}${rows}`).format.verticalAlignment='center';v(s,'A2',title);s.getRange('A2').format.font={size:16,bold:true};s.getRange(`A3:${end}3`).format.borders={bottom:{style:'thin',color:'#7893A9'}};}
function headers(s,r,vals){s.getRangeByIndexes(r-1,0,1,vals.length).values=[vals];s.getRangeByIndexes(r-1,0,1,vals.length).format={fill:navy,font:{bold:true,color:'#FFFFFF'},wrapText:true,rowHeight:48,horizontalAlignment:'center'};s.freezePanes.freezeRows(r);}
const input=(s,r)=>s.getRange(r).format.fill=yellow;
function add(t){t.row=types.length+7;types.push(t);return t;}
function part(t,name,dia,mult,spacing,cut,note='',source=t.source){parts.push({t,name,dia,mult,spacing,cut,note,source});}
function lin(t,r,qs,ds){qs.forEach((q,i)=>{if(r[q])part(t,`Longitudinal ${i+1}`,r[ds[i]],r[q],null,1,'Sem arranques ou emendas.');});}
const rows=n=>src[n].rows;
for(let i=5;i<=23;i++){
 const r=rows('PILARES')[i];const t=add({id:r.A,family:'Pilar',floor:r.B,unit:'m altura',shape:r.A.startsWith('P7-')&&r.A!=='P7-P0'?'Circular':'Pilar',b:r.D/100,h:r.E/100,l:1,c:r.F/100,source:`PILARES!A${i+1}:AS${i+1}`,note:r.AS+' Acertos locais e cortes das cintas por confirmar.'});
 lin(t,r,['J','L','N'],['K','M','O']);
 [['P','Q','R'],['S','T','U'],['V','W','X']].forEach(([n,d,s],j)=>{if(r[n])part(t,`Cinta ${j+1}`,r[d],r[n],r[s],null,'Preencher corte desenvolvido; considerar zonas a/2 e extremidades em Acertos aço.');});
}
for(let i=4;i<=11;i++){
 const r=rows('SAPATAS')[i],strip=i===11;
 const t=add({id:strip?'SAP-Pb1':r.A,family:strip?'Sapata contínua':'Sapata isolada',floor:'Fundações',unit:strip?'m comprimento':'un',shape:strip?'Sapata contínua':'Sapata',b:r.B,h:r.D,l:r.C,c:r.E,source:`SAPATAS!A${i+1}:AC${i+1}`,note:strip?'ALTERNATIVA a Pb.1-SAP de MUROS: não medir ambas; armaduras divergentes.':'Geometria da planilha; confirmar desenho. Cofragem considera 4 laterais. Cortes retos sem ganchos; validar.'});
 if(strip){t.b=r.C;t.l=1;t.block=true;}
 for(const [label,d,s] of [['Inferior','F','G'],['Superior','H','I']]){
  if(strip){part(t,`${label} transversal`,r[d],1,r[s],`=Tipos!F${t.row}-2*Tipos!I${t.row}`,'Faixa de 1 m, sem barras de extremidade.');part(t,`${label} longitudinal`,r[d],`=ROUNDUP((Tipos!F${t.row}-2*Tipos!I${t.row})/${r[s]},0)+1`,null,1,'Contagem pela largura, confirmar desenho.');}
  else{part(t,`${label} direção A`,r[d],`=ROUNDUP((Tipos!H${t.row}-2*Tipos!I${t.row})/${r[s]},0)+1`,null,`=Tipos!F${t.row}-2*Tipos!I${t.row}`,'Contagem arredondada para cima; sem ganchos/transpasses.');part(t,`${label} direção B`,r[d],`=ROUNDUP((Tipos!F${t.row}-2*Tipos!I${t.row})/${r[s]},0)+1`,null,`=Tipos!H${t.row}-2*Tipos!I${t.row}`,'Contagem arredondada para cima; sem ganchos/transpasses.');}
 }
 if(r.K)part(t,'Bordo',r.J,r.K,null,`=2*(Tipos!F${t.row}+Tipos!H${t.row}-4*Tipos!I${t.row})`,'Perímetro reto; confirmar dobras e cantos.');
}
for(let i=5;i<=10;i++){
 const r=rows('MUROS')[i];const wall=add({id:r.A+'-MURO',family:'Muro',floor:'Ver planta',unit:'m comprimento',shape:'Muro',b:r.D,h:r.E,l:1,c:0.03,source:`MUROS!A${i+1}:AB${i+1}`,note:'Altura fixa da fonte. Por 1 m em planta; 2 faces cofradas. Recobrimento 3 cm das notas gerais, confirmar. '+(r.A==='Pb.1'?'Sapata tratada apenas em Pb.1-SAP.':'')});
 part(wall,'Vertical — 2 faces',r.H,2,r.I,`=Tipos!G${wall.row}`,'Arranques e ancoragens medidos em Acertos aço.');part(wall,'Horizontal — 2 faces',r.J,`=2*(ROUNDUP((Tipos!G${wall.row}-2*Tipos!I${wall.row})/${r.K},0)+1)`,null,1,'Sem emendas; confirmar posição das barras extremas.');
 const t=add({id:r.A+'-SAP',family:'Sapata de muro',floor:'Fundações',unit:'m comprimento',shape:'Sapata contínua',b:r.G,h:r.F,l:1,c:0.05,source:wall.source,note:'Separada do paramento. Cofragem: duas laterais longitudinais; topos à parte. '+(r.A==='Pb.1'?'Não somar SAP-Pb1 (duplicado alternativo).':'')});
 for(const [label,d,s] of [['Inferior','L','M'],['Superior','N','O']]){part(t,label+' transversal',r[d],1,r[s],`=Tipos!F${t.row}-2*Tipos!I${t.row}`,'Faixa contínua; sem barra de extremidade.');part(t,label+' longitudinal',r[d],`=ROUNDUP((Tipos!F${t.row}-2*Tipos!I${t.row})/${r[s]},0)+1`,null,1,'Sem emendas.');}
 if(r.P)part(t,'Cintas da sapata',r.P,1,r.Q,null,'Falta corte desenvolvido confirmado.');
}
for(let i=15;i<=16;i++){
 const r=rows('MUROS')[i];const t=add({id:'Pa.2-'+(i===15?'P0-COB':'P-1-P0'),family:'Parede',floor:r.B,unit:'m altura',shape:'Parede',b:r.D,h:1,l:r.C,c:r.M,source:`MUROS!A${i+1}:T${i+1}`,note:'Por 1 m de altura. Duas faces principais; bordos à parte. Altura total não necessária ao coeficiente.'});
 part(t,'Vertical — 2 faces',r.G,`=2*(ROUNDUP((Tipos!H${t.row}-2*Tipos!I${t.row})/${r.H},0)+1)`,null,1,'Sem arranques/emendas.');part(t,'Horizontal — 2 faces',r.I,2,r.J,`=Tipos!H${t.row}-2*Tipos!I${t.row}`,'Sem extremidades adicionais.');part(t,'Cintas',r.K,1,r.L,null,'Confirmar corte e geometria.');
}
for(let i=5;i<=6;i++){
 const r=rows('VIGAS')[i];const t=add({id:r.A,family:'Viga',floor:r.B,unit:'m comprimento',shape:'Viga',b:r.D/100,h:r.E/100,l:1,c:r.F/100,source:`VIGAS!A${i+1}:AB${i+1}`,note:'Dados não confirmados no desenho 05. Cofragem: fundo + 2 laterais; descontar interseções.'});lin(t,r,['H','J','L'],['I','K','M']);part(t,'Estribos',r.O,r.N,r.P,null,'Preencher corte e acrescentar extremidades/zonas densificadas.');
}
for(let i=5;i<=7;i++){
 const r=rows('LAJES')[i];const t=add({id:r.A,family:'Laje',floor:r.C,unit:'m² planta',shape:r.B==='Aligeirada'?'Aligeirada':'Laje',b:1,h:r.G/100,l:1,c:r.H/100,source:`LAJES!A${i+1}:AQ${i+1}`,note:r.B==='Aligeirada'?'Fator de betão 0,65 da fonte NÃO adotado: preencher espessura equivalente calculada pelo sistema real.':'Betão por m² pela espessura. Cofragem de fundo 1 m²; bordos e vazios à parte.'});
 part(t,'Inferior X',r.J,1,r.K,1,'Somente malha repetitiva; emendas/ganchos à parte.');part(t,'Inferior Y',r.L,1,r.M,1,'Somente malha repetitiva; reforços superiores e temperatura em Acertos aço.');
}
setup(cat,'R','Tipos de elementos — base unitária',types.length+12);
v(cat,'A4','Fonte: '+sourceURL);v(cat,'A5','Base 1,00 m / 1,00 m² / 1 unidade. Quantidades de referência; completar aço e conferir critérios antes do auto.');
headers(cat,6,['Código tipo','Família','Piso / troço','Unidade base','Geometria','B ou Ø m','H m','L m','Recob. m','Esp. equivalente m','Betão m³/base','Cofragem m²/base','Limpeza m³/base','Aço kg/base','Estado aço','Origem na Barba','Observações','Uso']);
cat.getRange('A:A').format.columnWidth=23;cat.getRange('B:E').format.columnWidth=22;cat.getRange('O:O').format.columnWidth=25;cat.getRange('P:P').format.columnWidth=28;cat.getRange('Q:Q').format.columnWidth=65;cat.getRange('R:R').format.columnWidth=23;
for(const t of types){const r=t.row;cat.getRange(`A${r}:J${r}`).values=[[t.id,t.family,t.floor,t.unit,t.shape,t.b,t.h,t.l,t.c,null]];v(cat,`P${r}`,t.source);v(cat,`Q${r}`,t.note);v(cat,`R${r}`,t.block?'Não usar duplicado':'Conferir em projeto');cat.getRange(`Q${r}`).format.wrapText=true;cat.getRange(`A${r}:R${r}`).format.rowHeight=48;
 const vol=t.shape==='Circular'?`PI()*F${r}^2/4`:t.shape==='Parede'?`F${r}*H${r}`:t.shape==='Sapata'?`F${r}*G${r}*H${r}`:t.shape==='Laje'?`G${r}`:t.shape==='Aligeirada'?`IF(AND(ISNUMBER(J${r}),J${r}>0),J${r},"Pendente")`:`F${r}*G${r}`;
 const form=t.shape==='Circular'?`PI()*F${r}`:t.shape==='Pilar'?`2*(F${r}+G${r})`:t.shape==='Parede'?`2*H${r}`:t.shape==='Sapata'?`2*(F${r}+H${r})*G${r}`:t.shape==='Muro'||t.shape==='Sapata contínua'?`2*G${r}`:t.shape==='Viga'?`F${r}+2*G${r}`:'1';
 f(cat,`K${r}`,'='+vol);f(cat,`L${r}`,'='+form);f(cat,`M${r}`,t.shape==='Sapata'?`=F${r}*H${r}*0.05`:t.shape==='Sapata contínua'?`=F${r}*0.05`:'=0');
}
input(cat,`F7:J${types.length+6}`);cat.getRange(`F7:N${types.length+6}`).setNumberFormat('#,##0.000');
setup(arm,'L','Armaduras repetitivas — por unidade base',parts.length+12);
v(arm,'A4','kg/base = peças/base × corte unitário × peso linear. Frequências 1/passo não contam automaticamente as barras de extremidade.');
v(arm,'A5','Amarelo: rever dados. Cortes de cintas em falta ficam pendentes. Arranques, emendas, reforços locais e diferenças de contagem em Acertos aço.');
headers(arm,6,['Tipo','Componente','Ø mm','N.º / faces','Passo m (opcional)','Peças/base','Corte unit. m','Peso linear kg/m','Peso kg/base','Estado','Origem','Critério / pendência']);
arm.getRange('A:A').format.columnWidth=23;arm.getRange('B:B').format.columnWidth=30;arm.getRange('J:J').format.columnWidth=24;arm.getRange('K:K').format.columnWidth=28;arm.getRange('L:L').format.columnWidth=65;
const weights={6:0.222,8:0.395,10:0.617,12:0.888,16:1.578,20:2.466,25:3.853,32:6.313};
parts.forEach((p,i)=>{const r=i+7;v(arm,`A${r}`,p.t.id);v(arm,`B${r}`,p.name);v(arm,`C${r}`,p.dia);typeof p.mult==='string'?f(arm,`D${r}`,p.mult):v(arm,`D${r}`,p.mult);v(arm,`E${r}`,p.spacing);typeof p.cut==='string'?f(arm,`G${r}`,p.cut):v(arm,`G${r}`,p.cut);f(arm,`H${r}`,`=IF(COUNTIF('Como utilizar'!$D$7:$D$14,C${r})=0,"Pendente",VLOOKUP(C${r},'Como utilizar'!$D$7:$E$14,2,FALSE))`);v(arm,`K${r}`,p.source);v(arm,`L${r}`,p.note);f(arm,`F${r}`,`=IF(OR(NOT(ISNUMBER(D${r})),D${r}<=0),"Pendente",IF(E${r}="",D${r},IF(E${r}>0,D${r}/E${r},"Pendente")))`);f(arm,`J${r}`,`=IF(AND(ISNUMBER(F${r}),ISNUMBER(G${r}),G${r}>0,ISNUMBER(H${r}),H${r}>0),"Base calculada","Pendente")`);f(arm,`I${r}`,`=IF(J${r}="Pendente","Pendente",F${r}*G${r}*H${r})`);arm.getRange(`L${r}`).format.wrapText=true;arm.getRange(`A${r}:L${r}`).format.rowHeight=38;});
input(arm,`C7:E${parts.length+6}`);input(arm,`G7:G${parts.length+6}`);arm.getRange(`C7:I${parts.length+6}`).setNumberFormat('#,##0.000');
const ae=parts.length+6;
for(const t of types){let r=t.row;f(cat,`O${r}`,`=IF(COUNTIFS('Armaduras base'!$A$7:$A$${ae},A${r},'Armaduras base'!$J$7:$J$${ae},"Pendente")>0,"Pendente: cortes/dados","Base sem acertos locais")`);f(cat,`N${r}`,`=IF(O${r}="Pendente: cortes/dados","Pendente",SUMIF('Armaduras base'!$A$7:$A$${ae},A${r},'Armaduras base'!$I$7:$I$${ae}))`);}
setup(extra,'J','Acertos de aço do mês — memória de cálculo');
v(extra,'A4','Apenas parcelas não incluídas no coeficiente. Quantidade negativa = dedução justificada; conferir que não é medida novamente noutro mês.');
headers(extra,6,['Tipo','Parcela / localização','N.º varões (+/−)','Ø mm','Corte adicional m','Peso linear kg/m','Acerto kg','Estado','Desenho / registo','Justificação']);
extra.getRange('A:A').format.columnWidth=23;extra.getRange('B:B').format.columnWidth=32;extra.getRange('I:J').format.columnWidth=35;input(extra,'A7:E106');input(extra,'I7:J106');
extra.getRange('A7:A106').dataValidation={rule:{type:'list',formula1:`Tipos!$A$7:$A$${types.length+6}`}};
for(let r=7;r<=106;r++){f(extra,`F${r}`,`=IF(D${r}="","",IF(COUNTIF('Como utilizar'!$D$7:$D$14,D${r})=0,"Pendente",VLOOKUP(D${r},'Como utilizar'!$D$7:$E$14,2,FALSE)))`);f(extra,`H${r}`,`=IF(COUNTA(A${r}:E${r},I${r}:J${r})=0,"",IF(AND(COUNTIF(Tipos!$A$7:$A$${types.length+6},A${r})=1,B${r}<>"",ISNUMBER(C${r}),C${r}<>0,C${r}=INT(C${r}),ISNUMBER(F${r}),ISNUMBER(E${r}),E${r}>0,I${r}<>"",J${r}<>""),"OK","Pendente"))`);f(extra,`G${r}`,`=IF(H${r}="","",IF(H${r}="OK",C${r}*E${r}*F${r},"Pendente"))`);}
extra.getRange('C7:G106').setNumberFormat('#,##0.000');
setup(exe,'P','Execução mensal por tipo',types.length+12);
v(exe,'A4','Indicar separadamente a metragem executada de aço, betão e cofragem. Vazio = não registado; 0 = sem execução. Não preencher como exemplo real.');
v(exe,'A5','Cofragem e betão: acertos assinados em unidades finais, com memória nas observações. Fechar aço só depois de conferir contagens, nós e reforços.');
headers(exe,6,['Tipo','Unidade base','Exec. aço (base)','Exec. betão (base)','Exec. cofr. (base)','Aço base kg','Acertos aço kg','Aço total kg','Acerto betão m³','Betão total m³','Acerto cofr. m²','Cofragem total m²','Limpeza m³/base','Aço conferido?','Conferência','Registo / memória dos acertos']);
exe.getRange('A:A').format.columnWidth=23;exe.getRange('B:B').format.columnWidth=20;exe.getRange('N:O').format.columnWidth=23;exe.getRange('P:P').format.columnWidth=65;
const end=types.length+6;
for(const t of types){const r=t.row;f(exe,`A${r}`,`=Tipos!A${r}`);f(exe,`B${r}`,`=Tipos!D${r}`);
 f(exe,`F${r}`,`=IF(C${r}="","",IF(C${r}=0,0,IF(AND(ISNUMBER(C${r}),C${r}>0,ISNUMBER(Tipos!N${r})),C${r}*Tipos!N${r},"Pendente")))`);
 f(exe,`G${r}`,`=IF(COUNTIFS('Acertos aço'!$A$7:$A$106,A${r},'Acertos aço'!$H$7:$H$106,"Pendente")>0,"Pendente",SUMIF('Acertos aço'!$A$7:$A$106,A${r},'Acertos aço'!$G$7:$G$106))`);
 f(exe,`H${r}`,`=IF(AND(C${r}="",G${r}=0),"",IF(AND(ISNUMBER(F${r}),ISNUMBER(G${r}),OR(AND(F${r}=0,G${r}=0),N${r}="Sim")),F${r}+G${r},"Pendente"))`);
 f(exe,`J${r}`,`=IF(AND(D${r}="",I${r}=""),"",IF(AND(ISNUMBER(D${r}),D${r}>=0,OR(I${r}="",ISNUMBER(I${r})),OR(D${r}=0,ISNUMBER(Tipos!K${r}))),IF(D${r}=0,0,D${r}*Tipos!K${r})+N(I${r}),"Pendente"))`);
 f(exe,`L${r}`,`=IF(AND(E${r}="",K${r}=""),"",IF(AND(ISNUMBER(E${r}),E${r}>=0,OR(K${r}="",ISNUMBER(K${r}))),E${r}*Tipos!L${r}+N(K${r}),"Pendente"))`);
 // Cleaning concrete has its own execution input in the summary rather than reusing structural casting dates.
 f(exe,`M${r}`,`=Tipos!M${r}`);
 f(exe,`O${r}`,`=IF(COUNTA(C${r}:E${r},I${r},K${r},N${r},P${r})=0,IF(G${r}=0,"","Pendente"),IF(OR(Tipos!R${r}="Não usar duplicado",AND(B${r}="un",OR(AND(ISNUMBER(C${r}),C${r}<>INT(C${r})),AND(ISNUMBER(D${r}),D${r}<>INT(D${r})),AND(ISNUMBER(E${r}),E${r}<>INT(E${r})))),H${r}="Pendente",J${r}="Pendente",L${r}="Pendente",AND(ISNUMBER(H${r}),H${r}<0),AND(ISNUMBER(J${r}),J${r}<0),AND(ISNUMBER(L${r}),L${r}<0),P${r}=""),"Pendente","Conferir / registar"))`);
}
input(exe,`C7:E${end}`);input(exe,`I7:I${end}`);input(exe,`K7:K${end}`);input(exe,`N7:N${end}`);input(exe,`P7:P${end}`);exe.getRange(`N7:N${end}`).dataValidation={rule:{type:'list',values:['Sim','Não']}};exe.getRange(`C7:M${end}`).setNumberFormat('#,##0.000');
setup(res,'J','707 — resumo da execução mensal',end+15);res.tabColor=navy;
v(res,'A4','Início');input(res,'B4');v(res,'C4','Fim');input(res,'D4');v(res,'F4','Subempreiteiro');input(res,'G4:J4');res.getRange('B4').setNumberFormat('dd/mm/yyyy');res.getRange('D4').setNumberFormat('dd/mm/yyyy');
v(res,'A5','Quantidades deste período, sem preços. Todas as linhas de Execução e Acertos aço devem pertencer ao intervalo indicado.');
headers(res,7,['Tipo','Família','Aço kg','Betão m³','Cofragem m²','Exec. limpeza (base)','Betão limpeza m³','Referência de medição','Estado','']);
res.getRange('A:A').format.columnWidth=23;res.getRange('B:B').format.columnWidth=23;res.getRange('H:H').format.columnWidth=40;res.getRange('I:I').format.columnWidth=25;
types.forEach((t,i)=>{const r=i+8,k=t.row;f(res,`A${r}`,`=Tipos!A${k}`);f(res,`B${r}`,`=Tipos!B${k}`);for(const [to,from] of [['C','H'],['D','J'],['E','L'],['H','P']])f(res,`${to}${r}`,`=IF('Execução'!${from}${k}="","",'Execução'!${from}${k})`);f(res,`G${r}`,`=IF(F${r}="","",IF(AND(ISNUMBER(F${r}),F${r}>=0,Tipos!M${k}>0),F${r}*Tipos!M${k},"Pendente"))`);f(res,`I${r}`,`=IF(AND(C${r}="",D${r}="",E${r}="",G${r}="",'Execução'!O${k}=""),"",IF(OR($B$4="",$D$4="",$D$4<$B$4,'Execução'!O${k}="Pendente",G${r}="Pendente",AND(F${r}<>"",H${r}="")),"Pendente","Para conferência"))`);});
input(res,`F8:F${end+1}`);res.getRange(`C8:G${end+1}`).setNumberFormat('#,##0.000');const total=end+3;v(res,`A${total}`,'TOTAL DO PERÍODO');for(const col of ['C','D','E','G'])f(res,`${col}${total}`,`=IF(OR(COUNTIF(I8:I${end+1},"Pendente")>0,COUNTIF('Acertos aço'!H7:H106,"Pendente")>0),"Pendente",IF(COUNT(${col}8:${col}${end+1})=0,"",SUM(${col}8:${col}${end+1})))`);res.getRange(`A${total}:I${total}`).format.fill='#DFE8EF';
setup(audit,'D','Leitura das 18 abas da Barba',35);headers(audit,6,['Aba','Conteúdo encontrado','Uso no novo modelo','Pendência / risco']);audit.getRange('A:A').format.columnWidth=30;audit.getRange('B:D').format.columnWidth=58;
const findings=[
 ['MAPA_OBRA_707','71 linhas de contrato / títulos.','Referência contratual; não representa execução.','Artigos 4.3.1 e 4.3.2 repetidos; há trabalhos sem modelo geométrico (escadas, piscinas, Cupolex).'],
 ['PISOS','Piso 0 usado em PILARES não existe no cadastro.','Coeficientes por metro dispensam altura total.','Não copiar alturas inferidas; P8-P1 tem 3,90 m explícitos.'],
 ['PILARES (G)','8 registos paralelos, P1/P2/P3/P7.','Não somar com PILARES.','P7 Piso -1 usa fórmula circular com D=50 cm; diverge dos Ø30 cm de PILARES/notas.'],
 ['PILARES','19 troços de P1 a P11.','19 tipos por metro de altura.','Cabeçalhos AG/AH invertidos; cintas interiores calculadas como exteriores; cortes e zonas a/2 pendentes.'],
 ['SAPATAS','S1–S7 e Pb1.','S1–S7 por unidade; Pb1 por metro.','Pb1 sobrepõe-se a Pb.1 em MUROS e tem espaçamentos divergentes; alternativa bloqueada. S1: dimensão preenchida, nota diz VER PLANTA.'],
 ['MUROS','MS.1–4, Pb.1–2, duas Pa.2.','Muro e sapata separados; Pa.2 por metro de altura.','Notas L/h pendente estão desatualizadas em algumas linhas. Bases por metro evitam depender do comprimento total.'],
 ['VIGAS','V1 e V2.','Por metro de comprimento.','Faltam cortes e confirmação do desenho; V2 usa Piso 2 não cadastrado.'],
 ['LAJES','L1/L3 maciças, L2 aligeirada.','Por m²; bordos e reforços locais separados.','Fator 0,65 do betão aligeirado sem memória geométrica; não transferido. Armadura de temperatura não é malha detalhada.'],
 ['TABELA DE PESOS','Ø6 a Ø32, pesos kg/m.','Mesmos pesos usados em Armaduras base.','Fórmulas originais A2:B9 excluem Ø32 da linha 10.'],
 ['RESUMO GERAL','Soma das abas de levantamento.','Não reutilizar como medição do mês.','Sapatas contam A5:A11 mas totais incluem Pb1; risco de duplicação com MUROS.'],
 ['NOTAS DO PROJETO','Critérios e limitações do desenho 05.','Mantidos como pendências de validação.','Declara sapatas/muros/vigas não confirmados nesse desenho; faltam cortes/dobragens.'],
 ...['AUTO_GERAL_MEDICAO','SUB_COFRAGEM','SUB_ARMADURAS','SUB_BETAO','SUB_ESPECIAIS','AUTO_MARINEL','AUTO_SECULUM_IMPERDIVEL'].map(n=>[n,'Auto com contrato, anterior, mês, acumulado e preço.','Receber quantidades conferidas deste novo modelo.','Não ligado automaticamente: falta mapear tipos a artigos únicos e subempreiteiro.'])];
audit.getRange('A7:D24').values=findings;audit.getRange('A7:D24').format.wrapText=true;audit.getRange('A7:D24').format.rowHeight=65;
setup(guide,'E','Como usar as bases de 1,00',35);guide.getRange('A:A').format.columnWidth=28;guide.getRange('B:B').format.columnWidth=100;guide.getRange('C:C').format.columnWidth=4;guide.getRange('D:E').format.columnWidth=18;
headers(guide,6,['Passo','Critério']);
const tips=[['1. Fonte','Dados extraídos da Barba_Atualizada.xlsx, sem alterar o original. Tipos contém a aba/linha de origem; não é validação independente do projeto.'],['2. Escolher o tipo','P1-P0, P1-P1 etc. são troços diferentes. Utilizar o que corresponde à execução; não somar PILARES (G).'],['3. Unidade correta','Pilares/Pa.2: m de altura. Muros e vigas: m de comprimento. Lajes: m² em planta. Sapatas isoladas: unidades completas; não fracionar aço pela altura.'],['4. Exemplo P1','Secção 0,30 × 0,60: betão 0,180 m³/m; cofragem 1,800 m²/m. Para 2,50 m: 0,450 m³ e 4,500 m² (4 faces). Nenhuma execução real foi preenchida.'],['5. Aço por metro','Longitudinal P1: 6 × 1,578 + 10 × 0,888 = 18,348 kg/m. Este valor NÃO inclui cintas, arranques ou emendas. Total fica pendente até completar as cintas.'],['6. Frequência e contagem','1/passo é uma distribuição contínua. A contagem final é inteira; registar diferenças, barra inicial/final e zonas a/2 em Acertos aço, sem duplicar limites de troços.'],['7. Cortes','Preencher comprimento desenvolvido das cintas pelo mapa de corte/dobragem. Não atribuir à cinta interior o perímetro da exterior.'],['8. Arranques e emendas','Acertos aço: n.º de varões × comprimento adicional × kg/m. Incluir 50Ø ou dobra apenas onde o pormenor os prevê, uma única vez no troço executado.'],['9. Muros e lajes','Muros por metro assumem a altura integral indicada em Tipos. Execução parcial em altura exige tipo próprio ou memória específica. Lajes: reforços localizados e bordos à parte.'],['10. Executar no mês','Preencher C/D/E em Execução de forma independente. Acrescentar memória/data nas observações. Assinalar aço conferido só após conferir contagens e reforços.'],['11. Limpeza','Medir separadamente na coluna F do Resumo, pois pode ocorrer noutro mês. Coeficiente 5 cm das abas de levantamento; contrato MAPA refere 10 cm em artigo próprio: confirmar antes de faturar.'],['12. Deduções','I/K em Execução admitem acertos positivos/negativos de betão/cofragem, justificados em P. Não descontar vazios ou encontros sem memória.'],['13. Sapatas','Contagens propostas usam ROUNDUP para não exceder o espaçamento. A Barba usa INT: as quantidades podem divergir. Confirmar disposição/cortes em desenho; não considerar aprovação automática.'],['14. Pendências','Células Pendente não são zero. L2 precisa da espessura equivalente real. SAP-Pb1 está marcado como duplicado alternativo; usar Pb.1-SAP até resolver a fonte.'],['15. Fechar o mês','Conferir todas as memórias, arquivar a cópia mensal e transferir os quantitativos para os artigos do auto. Não atualizar coeficientes de um auto já fechado.'],['16. Cobertura','46 tipos da planilha. Não há geometria suficiente para escadas, piscinas, núcleos, Cupolex e restantes artigos; exigem desenhos/dados adicionais.'],['17. Capacidade','46 tipos pré-cadastrados, uma linha mensal por tipo, 100 acertos de aço. Para novos tipos, estender fórmulas e intervalos de todas as folhas.'],['18. Período','Um ficheiro por mês/subempreiteiro. O resumo não filtra datas individuais: todos os lançamentos devem pertencer ao período do cabeçalho.']];
guide.getRange('A7:B24').values=tips;guide.getRange('A7:B24').format.wrapText=true;guide.getRange('A7:B24').format.rowHeight=65;headers(guide,6,['Passo','Critério']);guide.getRange('D6:E6').values=[['Ø mm','kg/m']];guide.getRange('D7:E14').values=Object.entries(weights).map(([d,w])=>[+d,w]);guide.getRange('E7:E14').setNumberFormat('0.000');v(guide,'D16','Fonte pesos');v(guide,'D17','TABELA DE PESOS');
for(const s of [cat,arm,exe,extra,res])s.getUsedRange().conditionalFormats.add('containsText',{text:'Pendente',format:{fill:'#FCE4D6',font:{color:'#9C2F20'}}});
// Verify formulas and representative unit conversions, then restore blank monthly inputs.
wb.recalculate();
function eq(s,c,x){const actual=s.getRange(c).values[0][0];if(typeof x==='number'?(typeof actual!=='number'||Math.abs(actual-x)>1e-8):actual!==x)throw Error(`${s.name}!${c}=${actual}; expected ${x}`);}
eq(cat,'K7',0.18);eq(cat,'L7',1.8);eq(cat,'N7','Pendente');
v(exe,'D7',2.5);v(exe,'E7',2.5);v(exe,'P7','TESTE TEMPORÁRIO');wb.recalculate();eq(exe,'J7',0.45);eq(exe,'L7',4.5);v(exe,'C7',2.5);wb.recalculate();eq(exe,'H7','Pendente');
const sp=types.find(t=>t.id==='S1'),circ=types.find(t=>t.id==='P7-P1');eq(cat,`K${sp.row}`,5.28);eq(cat,`L${sp.row}`,5.84);eq(cat,`K${circ.row}`,Math.PI*.3**2/4);
// Temporary synthetic cut lengths test the full steel chain; no synthetic data is exported.
v(arm,"G9",1.2);v(arm,"G10",0.8);v(exe,"N7","Sim");
extra.getRange("A7:E7").values=[["P1-P0","TESTE emenda",2,16,0.8]];v(extra,"I7","TESTE");v(extra,"J7","TESTE temporário");
wb.recalculate();eq(cat,"N7",22.298);eq(extra,"G7",2.5248);eq(exe,"H7",58.2698);
v(arm,"C7",20);wb.recalculate();eq(arm,"H7",2.466);v(arm,"C7",16);
for(const cell of ["G9","G10"])arm.getRange(cell).clear({applyTo:"contents"});
exe.getRange("N7").clear({applyTo:"contents"});extra.getRange("A7:E7").clear({applyTo:"contents"});extra.getRange("I7:J7").clear({applyTo:"contents"});
v(exe,`D${sp.row}`,0.5);v(exe,`P${sp.row}`,"TESTE sapata parcial");wb.recalculate();eq(exe,`O${sp.row}`,"Pendente");exe.getRange(`D${sp.row}`).clear({applyTo:"contents"});exe.getRange(`P${sp.row}`).clear({applyTo:"contents"});
for(const cell of ['C7','D7','E7','P7'])exe.getRange(cell).clear({applyTo:'contents'});
wb.recalculate();
console.log(JSON.stringify({types:types.length,armatureComponents:parts.length,tests:'P1 1m/2.5m; incomplete steel; S1 unit; circular P7 verified'}));
console.log((await wb.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!',options:{useRegex:true,maxResults:20},maxChars:3000})).ndjson);
const dest=`${root}/planilhas/Memorias_Unitarias_707.xlsx`;await(await SpreadsheetFile.exportXlsx(wb)).save(dest);
for(const [s,range] of [[res,'A1:I12'],[exe,'A1:P10'],[cat,'A1:R10'],[arm,'A1:L12'],[extra,'A1:J10'],[audit,'A1:D12'],[guide,'A1:E11']]){let img=await wb.render({sheetName:s.name,range,scale:1,format:'png'});await fs.writeFile(`${root}/work/modelo/unit-${s.name}.png`,new Uint8Array(await img.arrayBuffer()));}
await fs.writeFile(`${root}/work/base/types.json`,JSON.stringify(types,null,2));
console.log(dest);
