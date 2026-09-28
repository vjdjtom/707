# Revisão dos pilares — desenho 05

Revisão de 28/09/2026. Entrega: [Memorias_Unitarias_707_Revisao_Pilares.xlsx](../planilhas/Memorias_Unitarias_707_Revisao_Pilares.xlsx).

## Fonte e alcance
Conferência visual do PDF fornecido pelo utilizador, FERCA L-337/21, desenho 05, revisão –, abril de 2025. O ficheiro é idêntico a [mapa_de_pilares.pdf](mapa_de_pilares.pdf) já guardado no repositório (Git blob e47c0f3122b4df74a079f1fb62c110052ad1942e).

Foram conferidos os 19 troços dos pilares P1–P11. Mantidos os 46 tipos e 152 componentes da base Barba. Esta revisão não altera as geometrias dos restantes elementos nem constitui aprovação de projeto ou auto real.

Correção da leitura anterior: o desenho contém muros MS/Pb, paredes Pa e escada E1. A afirmação de ausência de muros estava incorreta. Os restantes elementos precisam de conferência própria. Não foram identificadas as sapatas S1–S7 nem as vigas V1/V2 neste desenho.

## Dados confirmados
- P1 e P8: 30×60 cm, 6Ø16 + 10Ø12; cintas exterior e interior.
- P2: 40×70 cm, 28Ø16; cintas exterior e interior.
- P3: 40×20 cm; P4/P5: 20×40 cm; 6Ø16 + 6Ø12.
- P6: 30×30 cm, 8Ø20 + 4Ø16; encontro inferior com parede.
- P7 inferior: 50×30 cm, 10Ø16; superior/cobertura: circular Ø30 cm, 7Ø16. Cinta circular, sem assumir espiral.
- P9: 130×20 cm, 16Ø16 + 14Ø10; P10: 20×100 cm, 24Ø16; P11: 20×80 cm, 8Ø16 + 12Ø12. Cintas sobrepostas: o corte do conjunto deve somar todas as peças.

Cintas Ø8, passo normal a=0,20 m; zonas densificadas a/2=0,10 m. O arranque de fundação mostra zona de 0,80 m; outros pormenores mostram 0,60 m nas faces indicadas. Não aplicar densificação indistintamente a todos os nós.

Emenda indicada: 50Ø. Segmentos horizontais: 0,30 m no último troço/arranque; 0,50 m ao nascer em laje. Ao nascer em parede, consta cota de embebimento de 1,20 m. Estes segmentos não equivalem ao desenvolvimento completo das barras.

Fecho: cauda da cinta 5Ø, gancho 6Ø, diâmetro interior de dobragem 5Ø. A hipótese genérica de 10Ø não deve substituir o pormenor. Recobrimentos: pilares/vigas 0,030 m; paredes/lajes 0,025 m; faces em contacto com solo 0,050 m.

## Utilização das novas folhas
Em **Pormenores PDF**, consultar valores, referência e limites de aplicação. Em **Acertos aço**, escolher o critério na coluna K: Livre (comprimento em L), Emenda 50Ø, Segmento 0,30 m ou Segmento 0,50 m. A coluna E passou a fórmula. Indicar número de varões, diâmetro, localização, fonte e justificação. Registar apenas comprimentos adicionais que não estejam já incluídos no corte base.

Em **Contagem de cintas**, uma linha representa uma zona de passo constante. C é a posição da primeira cinta, D o passo, E o limite anteriormente medido, F o atual e G o número de conjuntos por nível. As coordenadas usam a mesma origem. E vazio significa nenhuma cinta anteriormente medida nessa zona. A contagem acumulada é (INT(ROUND((F−C)/D;8))+1)×G, quando F≥C. O número mensal é acumulado menos anterior. Evitar sobreposição das zonas e dos seus extremos.

Esta folha não transfere acertos automaticamente. O aço base já inclui metros×conjuntos/passo normal. Acerto = (contagem real − contagem incluída na base) × corte desenvolvido × peso linear. Nunca somar novamente toda a contagem real. Se a diferença for fracionária, converter a diferença absoluta de peças em comprimento adicional e usar uma linha Livre com um varão equivalente e sinal adequado; identificar explicitamente que se trata de reconciliação contabilística de comprimento, não de um varão físico.

Continuar a preencher **Execução** separadamente para aço, betão e cofragem. Todas as entradas pertencem ao mês/subempreiteiro do cabeçalho. Guardar um ficheiro por período e preservar os autos fechados.

## Pendências mantidas
Alturas dos troços não estão cotadas no quadro. Os 3,90 m de P8-P1 provêm da planilha, não deste PDF. Cintas interiores e sobrepostas carecem de cotas desenvolvidas; não obter cortes por escala gráfica. Mesmo cintas simples precisam de desenvolvimento coerente de curvas e fecho. O aço total continua Pendente até completar esses cortes. Conferir as faces efetivamente cofradas nos encontros com paredes.

P1 por metro mantém 0,180 m³ de betão e 1,800 m² de cofragem (quatro faces). O aço longitudinal é 18,348 kg/m, sem cintas, arranques ou emendas: não é aço total.

## Verificação e reprodução
Testados geometria P1, aço longitudinal, emenda de 6Ø16 com 0,80 m (7,5744 kg), segmento de 0,30 m (2,8404 kg) e comprimento livre de 1,20 m (11,3616 kg). Testada contagem em 0–0,80 m a cada 0,10 m: 9 posições; 5 anteriores até 0,40 m e 4 no período seguinte. Entradas sintéticas removidas. Inspeção visual das folhas alteradas; nenhuma ocorrência de erro de fórmula encontrada. Confirmados valores guardados no XLSX e preservação das folhas Execução/Resumo e das fórmulas geométricas. Não testado interativamente no Excel nativo.

O script [revisao_pilares_pdf.mjs](../scripts/revisao_pilares_pdf.mjs) importa o modelo unitário em branco e exporta a revisão; requer @oai/artifact-tool. Usar apenas para regenerar o modelo, nunca para sobrescrever medições preenchidas.
