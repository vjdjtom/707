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
