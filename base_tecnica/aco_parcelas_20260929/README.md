# Aço — parcelas calculadas em 29/09/2026

Entrega: [Memorias_Aco_707_Parcelas_Calculadas.xlsx](../../planilhas/Memorias_Aco_707_Parcelas_Calculadas.xlsx). Nova versão da memória de pilares, sem sobrescrever a anterior. Estado: PARCIAL; total de aço da obra PENDENTE.

Fonte principal: PDF completo Estabilidade_260928_1.pdf, página 8, desenho 05; evidências D05-MAPA-PILARES, D05-EMENDAS e D05-FECHO-CINTAS. SHA256 do PDF: be35a8fcf8f1c9bffec93659edb3065c124f0c56defd42a0c18aa084b2f7ca01.

## Cálculo entregue

- 32 grupos longitudinais para os 19 troços típicos, com massa por metro, comprimento de emenda 50Ø, massa por emenda individual e massa de referência caso todos os varões do grupo tenham uma emenda.
- O CSV emendas_por_grupo.csv reproduz os resultados calculados. Números decimais usam ponto; separador de campos é ponto e vírgula.
- Cintas Ø8: diâmetro interior 5Ø = 0,040 m; raio ao eixo = 0,024 m; arco de 90° = 0,037699 m; arco de 135° = 0,056549 m; caudas 5Ø = 0,040 m e 6Ø = 0,048 m. As linhas combinadas são alternativas geométricas, não peças adicionais.
- P1: 6 × 0,80 × 1,578 + 10 × 0,60 × 0,888 = 12,9024 kg se todos os seus varões forem emendados uma vez. Não é quantidade aplicada automaticamente a cada piso.

Pesos tabelados da memória original foram mantidos para consistência. Não misturar estes resultados com o coeficiente geométrico sem registrar a mudança de convenção. Cada linha da folha Aço projeto por tipo serve para um troço identificado; não soma todas as ocorrências de um tipo. Não existe transferência automática ao auto.

## Limites que impedem fechar o total

As parcelas de curvas não definem, sozinhas, o corte desenvolvido de uma cinta. Faltam a composição do fecho, segmentos entre tangências e dimensões das cintas interiores/sobrepostas. Nenhum corte completo foi inferido por escala. As alturas por ocorrência, arranques e localização real das emendas também precisam de confirmação cruzada nas plantas e cortes. O desenho 08 foi inspecionado, mas os níveis não foram propagados indistintamente a todos os pilares.

Sapatas, paredes, vigas e lajes não foram recalculadas nesta etapa. Os valores legados dessas famílias nas abas anteriores não foram promovidos a quantitativos confirmados. A execução permanece vazia.

## Verificação

Testados em memória: emenda de 6Ø16 = 7,5744 kg; alteração para 3 varões = 3,7872 kg; retirada da quantidade devolve PENDENTE; P1 com 3 m de teste produz 55,044 kg longitudinais, mas não libera total sem outras parcelas. Dados de teste removidos antes da exportação. Conferidos 12 separadores, ausência de erros de fórmula e preservação dos valores/fórmulas anteriores, exceto a nota de continuidade em Como utilizar. Inspeção visual das três folhas novas e nota alterada. O recálculo independente deve ser registrado na continuidade após sua execução.
