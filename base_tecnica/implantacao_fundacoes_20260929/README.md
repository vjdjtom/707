# Implantação das fundações — revisão 29/09/2026

Este lote consolida a leitura das plantas de fundações dos desenhos 01–04 e corrige uma inversão encontrada no lote documental anterior: os registros identificados como D/E estavam trocados. A visão vigente é `ocorrencias_consolidadas.csv`; o histórico original permanece intacto e cada uma das 25 correções está em `retificacoes.csv`.

Os desenhos 13 e 15 (definição geométrica) confirmam a correspondência: D ocupa os eixos 25–32 e E os eixos 33–40. F/G usam eixos com uma marca (`'`); E usa eixos com duas marcas (`''`). As referências de apoio separam a linha do eixo de qualquer afastamento cotado. Um apoio junto a uma borda não foi transformado em centro da sapata.

`limites_sapatas.csv` registra apenas dimensões nominais do tipo. Polígonos líquidos, encontros com muros/vigas, descontagens, escavação e volumes continuam `PENDENTE`. `referencias_apoios.csv` não libera elementos físicos para execução. Nenhum quantitativo ou auto foi gerado.

O manifesto preserva o hash da fonte e dos CSV anteriores, além de indicar o arquivo vigente. Use:

```sh
python3 scripts/validar_implantacao_fundacoes.py
```

IDs históricos não foram renumerados. Em caso de dúvida, a referência de fonte deve ser lida na caixa indicada em `evidencias.csv`; os números de eixo são identificadores e não coordenadas de pixel.
