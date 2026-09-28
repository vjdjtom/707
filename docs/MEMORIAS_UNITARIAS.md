# Memórias unitárias — 707

## Pedido e entrega
O utilizador pediu verificar as abas da Barba_Atualizada e preparar tipos por 1,00 m, para multiplicar pela metragem efetivamente executada no mês.
Entrega: [Memorias_Unitarias_707.xlsx](../planilhas/Memorias_Unitarias_707.xlsx).
A Barba original permanece intacta. Foram examinadas as 18 abas, os valores e as fórmulas. Não foi feita nova validação independente dos desenhos PDF.

## Estrutura e cobertura
46 tipos cadastrados (45 utilizáveis + SAP-Pb1 como alternativa duplicada bloqueada) e 152 componentes de armadura.
- 19 troços de pilares P1–P11: por metro de altura.
- S1–S7: por unidade completa; não fracionar o aço pela altura betonada.
- SAP-Pb1: por metro, alternativa da aba SAPATAS, não somar a Pb.1-SAP.
- MS.1–MS.4 e Pb.1–Pb.2: 6 paramentos + 6 sapatas separados, por metro de comprimento.
- Duas paredes Pa.2: por metro de altura.
- V1/V2: por metro de comprimento.
- L1–L3: por metro quadrado de planta.

Escadas, piscinas, núcleos, Cupolex e outros artigos do MAPA não têm geometria suficiente para cadastrar tipos confirmados. Não foram inventados.

## Exemplo P1
Por 1 m: betão = 0,30 × 0,60 = 0,180 m³; cofragem de 4 faces = 2 × (0,30 + 0,60) = 1,800 m².
Com 2,50 m executados: 0,450 m³ e 4,500 m².
Aço longitudinal repetitivo: 6 × 1,578 + 10 × 0,888 = 18,348 kg/m. NÃO é aço total.
As cintas exigem cortes desenvolvidos confirmados, incluindo a cinta interior distinta da exterior. Enquanto faltarem, o total de aço fica pendente.

## Decisões de cálculo
Separar coeficiente repetitivo e parcelas locais:
- peças por base × comprimento de corte × peso linear;
- cintas por metro: conjuntos / passo, sem adicionar +1 por cada metro;
- diferenças de contagem inteira, zonas a/2, arranques, emendas e reforços em Acertos aço;
- o utilizador confirma o aço depois de conferir as contagens e os acertos. Confirmação não substitui preenchimento dos cortes;
- pesos lineares da TABELA DE PESOS, incluindo Ø32;
- sapatas: contagens propostas ROUNDUP para não exceder o passo, em vez de INT da fonte. Confirmar disposição e cortes antes da medição;
- muros por metro pressupõem a altura integral indicada; altura parcial exige tipo específico/memória própria;
- cofragem de lajes: fundo por m². Bordos, encontros e deduções são acertos separados;
- betão de limpeza medido separadamente, sem acompanhar automaticamente a data do betão estrutural;
- L2 aligeirada: não adotado o fator arbitrário 0,65; preencher espessura equivalente obtida da geometria real;
- execuções de aço, betão e cofragem são independentes, em colunas distintas;
- nenhum mês, metragem executada real ou preço foi inventado.

## Achados nas abas originais
1. PISOS não cadastra Piso 0 usado pelos pilares nem Piso 2 usado por V2.
2. PILARES (G) é um levantamento paralelo: não somar com PILARES. P7 circular usa 50 cm nessa aba, divergindo dos 30 cm de PILARES/notas.
3. Cabeçalhos de comprimento/quantidade de cintas em PILARES estão invertidos; fórmulas de cintas interiores repetem o perímetro exterior.
4. SAPATAS Pb1 e MUROS Pb.1 têm mesma geometria geral de base mas espaçamentos de malhas divergentes. Potencial dupla contagem.
5. S1 tem dimensões preenchidas mas a nota ainda diz VER PLANTA.
6. Em MUROS há valores de L/h preenchidos com notas ainda dizendo pendente.
7. Referências originais aos pesos A2:B9 deixam de fora Ø32 em B10.
8. RESUMO GERAL conta sete sapatas mas soma também Pb1, além do risco de repetir sua sapata nos muros.
9. Betão de limpeza: 5 cm no levantamento e 10 cm em artigo do MAPA; compatibilizar.
10. A própria NOTAS DO PROJETO declara sapatas, muros e vigas não confirmados pelo desenho 05.
11. Autos existentes recebem dados por artigo, não por tipo geométrico. Ainda falta mapear os tipos aos artigos únicos e subempreiteiros; não foi criada ligação automática potencialmente errada.

## Uso
1. Ler Leitura das abas e Como utilizar.
2. Conferir Tipos e completar Armaduras base.
3. Em Execução, inserir unidades executadas por material e referência de medição.
4. Registar os acertos locais do aço, e as memórias de deduções/acréscimos de betão/cofragem.
5. Preencher período/subempreiteiro no Resumo e a execução independente de betão de limpeza.
6. Conferir e transferir quantidades para o auto contratual.

Um ficheiro por mês/subempreiteiro. O resumo não filtra datas de lançamentos: todas as entradas devem pertencer ao cabeçalho.
Capacidade: 46 tipos e 100 linhas de acertos; ampliações exigem atualizar intervalos. Guardar meses fechados sem reparametrizar as bases.

## Testes
P1 a 1 m e 2,5 m; S1 por unidade (5,28 m³ e 5,84 m²); P7 circular; bloqueio de aço incompleto; cadeia do aço com cortes fictícios temporários, acertos de emenda e mudança de diâmetro; bloqueio de meia unidade de sapata.
Os dados sintéticos dos testes foram removidos antes da exportação. Inspeção visual das sete folhas e procura de erros de fórmula. Verificados valores guardados no XLSX. Não testado interativamente no Excel nativo.

## Reprodutibilidade
O script scripts/memorias_unitarias.mjs usa @oai/artifact-tool do runtime Codex e a extração docs/dados_barba_extraidos.json. A extração preserva valores e fórmulas da fonte para rastreabilidade; não representa dados recalculados. Executar apenas para regenerar o modelo, nunca para sobrescrever um mês preenchido. O XLSX é utilizável diretamente sem o script.

## Revisão posterior pelo PDF — 28/09/2026

As referências acima à ausência de conferência do PDF descrevem a etapa inicial. Usar agora o [modelo revisto](../planilhas/Memorias_Unitarias_707_Revisao_Pilares.xlsx) e a [conferência dos pilares](REVISAO_PILARES_PDF.md). O PDF contém muros MS/Pb, paredes Pa e escada E1; a declaração da aba NOTAS DO PROJETO citada no achado 10 não deve ser tomada como prova de ausência desses elementos. Na revisão, Acertos aço!E é fórmula, K seleciona o critério e L recebe o comprimento livre.
