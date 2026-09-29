# Arquitetura da base técnica — Obra 707

## Objetivo

Transformar o repositório num sistema rastreável de:

`Projeto → Elemento → Memória → Quantidade de projeto → Execução → Auto`

sem apagar a base histórica existente.

## Camadas

### 1. Projeto / fonte
As peças desenhadas e documentos técnicos são a fonte primária. Quando uma informação não está confirmada no desenho correspondente, o estado deve permanecer `PENDENTE`.

### 2. Tipos estruturais
Um tipo descreve a geometria e a composição repetitiva, por exemplo `P1`, `P2`, `P9`.

Nesta primeira migração foram cadastrados somente tipos de pilares que já tinham conferência explícita no desenho 05.

### 3. Elementos reais
Cada instância construída recebe um `elemento_id` único, com fração, piso, eixos, dimensão/altura e desenho de origem.

Não criar uma instância real apenas por existir um tipo. A localização e a extensão do elemento precisam estar confirmadas.

### 4. Memória de cálculo
A memória é calculada a partir do tipo + dimensões reais + acertos locais.

Para aço:

`kg = N × L × 0,006165375 × Ø²`

Os acertos locais (emendas, arranques, dobras, cintas densificadas, reforços de bordo etc.) devem ficar separados da base repetitiva quando não fizerem parte do comprimento base.

### 5. Quantidade de projeto
É o limite técnico do elemento conforme projeto. Não é execução e não deve ser reescrito quando um mês fecha.

### 6. Execução
`execucao.csv` registra somente o que ocorreu fisicamente em determinado período.

Aço, betão e cofragem são independentes. Para o mesmo elemento podem ter datas e percentagens diferentes.

Formas permitidas de medição:

- `PERCENTAGEM`
- `QUANTIDADE`
- `COMPRIMENTO`
- `UNIDADES`

### 7. Artigos e auto
Os artigos de contrato ligam material/unidade/preço/subempreiteiro à medição. O auto deve ser gerado a partir da execução validada, nunca ser usado como base primária da medição.

## Estados padronizados

- `CONFIRMADO`: suportado por desenho/memória verificada.
- `PENDENTE`: dado necessário ainda não confirmado.
- `HIPOTESE`: cálculo assumido, não utilizável como medição final sem validação.
- `FECHADO`: execução/auto encerrado e não sobrescrevível.

`PENDENTE` nunca equivale a zero.

## Regras de não duplicação

1. `elemento_id` é único.
2. `execucao_id` é único.
3. Um auto fechado não é regenerado.
4. Execução acumulada por elemento/material não pode ultrapassar a quantidade de projeto sem uma justificação/revisão documentada.
5. Uma linha de execução deve referenciar um `elemento_id` existente.
6. Uma armadura deve referenciar um `tipo_id` existente.

## Primeira migração implementada

Nesta etapa entraram apenas dados de pilares confirmados no desenho 05:

- P1/P8: 30×60 cm, 6Ø16 + 10Ø12;
- P2: 40×70 cm, 28Ø16;
- P3: 40×20 cm, 6Ø16 + 6Ø12;
- P4/P5: 20×40 cm, 6Ø16 + 6Ø12;
- P6: 30×30 cm, 8Ø20 + 4Ø16;
- P7 inferior: 50×30 cm, 10Ø16;
- P7 superior: circular Ø30 cm, 7Ø16;
- P9: 130×20 cm, 16Ø16 + 14Ø10;
- P10: 20×100 cm, 24Ø16;
- P11: 20×80 cm, 8Ø16 + 12Ø12.

O aço cadastrado nesta fase corresponde à armadura longitudinal por metro. Cintas, emendas, arranques e desenvolvimentos ainda incompletos não foram somados silenciosamente.

## Próximas migrações

1. Criar as instâncias reais dos pilares com piso/eixos/alturas confirmados.
2. Migrar sapatas, muros, paredes e vigas por desenho próprio.
3. Modelar lajes por painel, incluindo geometria líquida, bandas, zonas maciças/aligeiradas e grupos de armaduras independentes.
4. Vincular artigos reais do contrato e subempreiteiros.
5. Importar a execução mensal e gerar autos exclusivamente dessa camada.
