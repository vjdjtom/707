# 707 Vila Moderna - Quantitativos e Autos de Medição

Projeto de levantamento de quantidades (betão, aço, cofragem) e autos de medição.

## Estrutura
- planilhas/Barba_Atualizada.xlsx: planilha principal (18 abas, inclui AUTO_MARINEL e AUTO_SECULUM_IMPERDIVEL)
- planilhas/Quantitativos_Pilares.xlsx: quantitativos dos pilares P1 a P11
- scripts/: scripts Python (openpyxl) que geram as planilhas
- docs/mapa_de_pilares.pdf: desenho base (Ferca, L-337/21, des. 05)

## Pendências
- Alturas dos troços dos pilares (célula amarela, coluna H)
- Comprimentos L dos muros Ms.2, Ms.3, Ms.4 e Pb.2, e alturas das paredes Pa.2 na aba MUROS
- Códigos de artigo duplicados no MAPA_OBRA_707 (4.1.1.x, 4.3.1, 4.3.2)

## Uso
pip install openpyxl
cd scripts && python adicionar_autos_marinel_seculum.py

## Autos mensais de execução

- [Modelo em branco](planilhas/Modelo_Auto_Mensal_707.xlsx)
- [Exemplo fictício — setembro de 2026](planilhas/Auto_Mensal_707_TESTE_Setembro_2026.xlsx)
- [Contexto, critérios, testes e pendências](docs/CONTINUIDADE_AUTOS.md)

Os modelos medem aço, betão e cofragem efetivamente executados no período, com memórias por elemento e piso. O exemplo é fictício e não constitui auto aprovado. Preservar os autos fechados e atualizar o registo de continuidade a cada entrega.
