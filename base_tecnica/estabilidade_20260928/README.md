# Cadastro documental de estabilidade: desenhos 01 a 06

Lote de leitura de 29/09/2026. Fonte principal: [PDF completo, 63 páginas](../../docs/fontes/estabilidade_20260928/Estabilidade_260928_1.pdf). Identidade, SHA-256, convenções e esquema de cada tabela estão em [manifesto.json](manifesto.json).

## Como ler os estados

`CONFIRMADO` significa que a indicação foi lida no desenho. Não significa aprovação do projetista, confirmação em obra, comprimento de fabrico ou quantidade executada.

`PENDENTE` é desconhecido ou não compatibilizado; nunca zero. `NAO_APLICAVEL` é diferente de desconhecido. Campos numéricos usam vírgula decimal e unidades no nome. CSV: UTF-8, delimitador `;`. Os textos `literal` conservam a notação do projeto e não devem ser somados por um parser automático.

Não há quantitativos finais liberados neste lote. A leitura confirmada de uma dimensão não elimina as pendências de localização, interseções, comprimentos de corte ou contagem. `estado_quantitativo=PENDENTE` bloqueia a utilização automática em autos.

## Conteúdo

| Arquivo | Registros | Uso |
|---|---:|---|
| desenhos.csv | 6 | Número, revisão, data, frações e página PDF |
| evidencias.csv | 45 | Localizadores gráficos por desenho e região da página |
| tipos_sapatas.csv | 28 | S1-S7 transcritas em cada desenho 01-04; são sete tipos, não 28 sapatas |
| tipos_ligacoes_fundacao.csv | 12 | LF1, VF1 e LF2, separadas por desenho |
| ocorrencias_fundacoes.csv | 130 | Observações gráficas de sapatas nas dez frações; 126 com tipo identificado e 4 com tipo pendente |
| trocos_tipos_pilares.csv | 19 | Aplicabilidade dos tipos P1-P11 por intervalo de pisos e ligação ao cadastro legado |
| tipos_muros.csv | 6 | Pb.1, Pb.2, Ms.1-Ms.4: secções, limites e chamadas de armadura |
| tipos_paredes.csv | 3 | Pa.1 e dois troços de Pa.2, incluindo mudança para secção em L |
| trocos_tipos_metalicos.csv | 23 | Quadros A-E e F-J tratados separadamente |
| pormenores_metalicos.csv | 9 | A-I: chapas, chumbadouros e conflitos |
| criterios_e_notas.csv | 13 | Cintas, emendas, fundações, N.E., materiais, recobrimentos e ligação HEB200 |
| pendencias.csv | 23 | Bloqueios identificados e ação necessária |

Os nomes dos arquivos são parte do esquema. `manifesto.json` lista exatamente as colunas e o número de registros esperado. Acrescentar dados requer revisar também o manifesto e a documentação; uma revisão posterior da fonte deve originar novo lote, preservando este.

## Rastreabilidade

`registro → evidencia_id → fonte_id + desenho + revisão + página + caixa → PDF original com SHA-256`.

As caixas usam pontos da exportação PDF: origem superior esquerda, página de 800 × 600 pontos, páginas numeradas a partir de 1. Elas localizam evidências; **não são coordenadas da obra nem escala para medir comprimentos**. O campo localizador e a designação/tipo identificam o item dentro da caixa. Uma caixa pode abranger vários detalhes para conservar o contexto.

```sh
python3 scripts/validar_base_tecnica.py
python3 scripts/validar_estabilidade_01_06.py
python3 scripts/test_validar_estabilidade_01_06.py
```

Os validadores usam apenas a biblioteca padrão do Python. Para reproduzir as ampliações, instalar PyMuPDF em ambiente isolado e executar:

```sh
python3 scripts/renderizar_evidencias_estabilidade.py --saida /caminho/novo/para/conferencia
```

O renderizador verifica o hash antes de abrir o PDF e recusa sobrescrever imagens existentes. Opcionalmente usar `--evidencia D06-PORMENOR-C`.

## Tipos, observações e elementos físicos

- `D01-S2` identifica a transcrição do tipo S2 no desenho 01. A mesma definição em D02 não é outra unidade física.
- `OBS-D01-A-S2-01` identifica a observação da sapata conjunta dos dois P2 na fração A. Não é um ID de elemento liberado para execução.
- `faixa_eixos_da_fracao` delimita a região examinada; não substitui os dois eixos exatos da ocorrência. Os localizadores A/B/C/D nas plantas do grupo posterior correspondem aos eixos com apóstrofo mostrados na fonte.
- Eixos exatos, cotas individualizadas, limites líquidos e interfaces permanecem pendentes no cadastro de observações. Não presumir duas sapatas por haver dois pilares numa S2/S6/S7 conjunta.
- S1 inclui geometrias em planta; o mapa diz `VER PLANTA`. Não substituir por retângulo padrão nem somar fundações contínuas de muros e sapatas sobrepostas.
- Sob PM2 e PM5 nas frações F e G foram vistas bases, mas a designação do tipo não ficou confirmada. A dimensão aparente/análoga não autoriza preencher S5.
- Os quadros de pilares são **tipológicos**. Não multiplicar linhas pelos números de frações e não criar instâncias apenas por existir um tipo.

Os arquivos originais `elementos.csv`, `execucao.csv`, `tipos_pilares.csv` e `armaduras_tipos.csv` estão preservados. Este lote adiciona rastreabilidade e tipos de outras famílias sem inventar execução mensal.

## Conflitos que exigem esclarecimento

1. **D06-C:** planta indica 6 chumbadouros Ø12; secção C indica 4. Quantidade adotada permanece `PENDENTE`.
2. **D06-H:** chamada da chapa 260×260×10 mm; planta cotada 300×360 mm. Dimensões adotadas permanecem `PENDENTE`.
3. **Aço em perfil:** a subclasse completa após S355 não foi normalizada a partir da chamada pouco clara.

As dimensões 3,02 / 2,82 / 2,92 / 6,27 / 2,97 / 0,97 m são cotas impressas nos quadros metálicos. Não foram recalculadas a partir de cotas de piso nem declaradas como comprimentos de corte. Chapas, ancoragens, ligações intermediárias e massas continuam separados.

Ver [relatório da etapa](../../docs/CADASTRO_ESTABILIDADE_01_06_20260929.md) para verificações e limites.
