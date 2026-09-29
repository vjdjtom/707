# Base técnica mestre — Obra 707

Esta pasta separa **dados de projeto**, **memórias de cálculo**, **execução física** e **autos mensais**.

## Princípios

1. Quantidade de projeto nunca é substituída pela quantidade executada.
2. Aço, betão e cofragem podem ser executados e medidos em datas diferentes.
3. Cada elemento real deve receber um `elemento_id` único.
4. Cada registo deve indicar a fonte (`desenho_fonte`) e o estado da verificação.
5. `PENDENTE` não significa zero.
6. Autos fechados/aprovados não são regenerados nem sobrescritos.
7. A base histórica em `planilhas/` permanece preservada.

## Ficheiros

- `tipos_pilares.csv`: tipos de pilares já confirmados no desenho 05, com geometria e aço longitudinal por metro.
- `armaduras_tipos.csv`: decomposição das armaduras longitudinais confirmadas por tipo.
- `elementos.csv`: cadastro mestre de instâncias reais da obra. Começa vazio até piso/eixos/altura serem confirmados.
- `execucao.csv`: registo mensal do executado por elemento e material.
- `artigos_contrato.csv`: ligação entre códigos de contrato, unidades, preços e subempreiteiros.

## Identificação recomendada

Formato: `FRAÇÃO-PISO-TIPO-NÚMERO`, por exemplo `F-P0-P-01` ou `F-P0-LA-01`.

O ID só deve ser criado quando a localização do elemento estiver confirmada no desenho.

## Regra do aço

Peso linear calculado por:

`kg = N × L × 0,006165375 × Ø²`

com `L` em metros e `Ø` em milímetros.

Para pilares, os valores atualmente cadastrados representam apenas **armadura longitudinal por metro**. Cintas, emendas, arranques, dobras e acertos locais permanecem separados e não estão embutidos nesses valores, salvo indicação explícita.
