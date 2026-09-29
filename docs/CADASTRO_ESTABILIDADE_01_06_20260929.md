# Cadastro de estabilidade - desenhos 01 a 06

Data da leitura: 29/09/2026. Branch: `reestrutura-base-tecnica`. Base da etapa: `86e4859ee454d69dc99621a5013cd887372e7dfb`.

## Fonte primária e mapeamento

Foi recuperado o anexo **Estabilidade 260928(1).pdf** da conversa referenciada e preservado integralmente em [docs/fontes/estabilidade_20260928/Estabilidade_260928_1.pdf](fontes/estabilidade_20260928/Estabilidade_260928_1.pdf). Tem 63 páginas; as três primeiras são a lista de peças desenhadas. O manifesto registra o hash e o tamanho do arquivo original. Nenhuma geometria foi extraída medindo pixels.

| Desenho | Página PDF | Conteúdo | Revisão/data |
|---|---:|---|---|
| 01 | 4 | Fundações A, B e C | A, 25/09/2026 |
| 02 | 5 | Fundações D e E | A, 25/09/2026 |
| 03 | 6 | Fundações F e G | A, 25/09/2026 |
| 04 | 7 | Fundações H, I e J | A, 25/09/2026 |
| 05 | 8 | Quadro de pilares; paredes Pb/Pa; muros Ms; outros pormenores | A, 25/09/2026 |
| 06 | 9 | Quadro de pilares metálicos | A, 09/07/2026 |

As datas foram conferidas no índice; não se atribuiu automaticamente a data de 25/09 ao desenho 06. O PDF exporta o texto das pranchas como elementos gráficos, sem camada de texto pesquisável nas páginas examinadas. A leitura foi visual, com ampliações dos mapas e dos pormenores.

## Resultado por família

**Fundações:** os mapas S1-S7 coincidem nas quatro pranchas. S1 remete para a planta; A/B permanecem pendentes. S2 = 5,00×2,90×0,60 m; S3 = 1,50×1,80×0,40 m; S4 = 1,60×1,40×0,40 m; S5 = 1,00×1,00×0,40 m; S6 = 1,00×2,08×0,40 m; S7 = 2,48×1,00×0,40 m. Foram transcritas as armaduras Ai, As e Ab, a tensão admissível indicada de 0,25 MPa e as secções LF1, LF2 e VF1. O valor de tensão é especificação lida, não verificação geotécnica nova.

Foram cadastradas 130 observações gráficas de sapatas nas dez frações, com referência à região de planta e ao apoio correspondente. Quatro bases sob PM2/PM5 em F/G ficaram sem tipo confirmado. Não se declara que essas observações sejam um inventário físico completo: fundações contínuas, polígonos S1, encontros e descontagens precisam ser segmentados e conciliados. Uma S2 conjunta não é contabilizada duas vezes por apoiar dois P2.

**Pilares de betão:** foram reconferidas as secções e armaduras longitudinais dos 12 tipos/variantes do cadastro anterior. Foram acrescentados 19 troços típicos por piso e o passo geral de cintas Ø8//0,20, com remissão aos pormenores de zonas a/2. P7 muda de 0,50×0,30 m no troço inferior para circular Ø0,30 m nos superiores. A ausência de alturas reais impede fechar betão, cofragem e aço totais. Os valores por metro anteriormente cadastrados permanecem intactos.

**Muros e paredes:** cadastro de Pb.1, Pb.2, Ms.1-Ms.4 e Pa.1/Pa.2, incluindo a secção em L de Pa.2 do Piso 0 à cobertura. Cotas MAX./MIN. dos pormenores não foram convertidas em alturas de execução. A notação `1+2x3Ø16//0.10` das paredes foi mantida literalmente, sem conversão ambígua numa quantidade total. Chamadas de armadura dos muros foram registradas; a decomposição completa por face, zona e forma ainda é pendente.

**Metálicos:** os grupos A-E e F-J foram separados, pois o mesmo PM tem diferentes troços e ligações entre os dois quadros. Foram registrados 23 troços, nove pormenores A-I e a ligação da viga de sala HEB200 com chapa 250×300×16 mm e 3UØ16. Perfil SHS 160×10 confirmado. Massa linear e comprimento de fabrico não foram inventados.

## Divergências da própria fonte

- Pormenor C: 6 chumbadouros Ø12 na planta versus 4 na secção C. Ambas as indicações preservadas, quantidade adotada pendente.
- Pormenor H: chamada 260×260×10 versus cotas de planta 300×360. Dimensões finais pendentes.
- Subclasse completa do aço em perfil após S355: leitura insuficientemente segura, pendente.

Esses conflitos não alteram automaticamente os dados históricos e não são resolvidos escolhendo a indicação mais conveniente.

## Limites e continuidade

A etapa entrega um cadastro documental rastreável, não uma memória final de quantitativos. Todas as tabelas relevantes mantêm `estado_quantitativo=PENDENTE`.

As 23 pendências em [pendencias.csv](../base_tecnica/estabilidade_20260928/pendencias.csv) cobrem eixos/cotas por fração, polígonos S1, interseções, desenvolvimentos, contagem de cintas, alturas/extensões de muros e paredes, cortes metálicos, conflitos C/H e itens adicionais. Para resolver as instâncias de pilares, cruzar também a definição geométrica e os cortes dos desenhos 07-26. As bases já observadas nas plantas 01-04 são o ponto de partida, não devem ser recadastradas como novas ocorrências.

O desenho 05 também contém escadas E1-E4 e menções a lajes de vigotas/secção de túnel. Seu detalhamento não foi incorporado às famílias pedidas; permanece explicitamente registrado como pendente de lote próprio. N.E. foi transcrito sem expandir a sigla ou afirmar sua correspondência com o título. O quadro de soldaduras está presente no 06; a aplicação de cordões a cada ligação não foi confirmada.

Os autos, planilhas, PDF antigo de pilares, tipos e armaduras anteriores e registros de execução foram preservados. Nenhuma medição real, preço, altura suposta ou aprovação foi adicionada. A branch principal não é alterada por esta etapa.

## Verificações

- Validação do SHA-256/tamanho do PDF original, desenho/página/revisão e caixas de evidência.
- Integridade dos IDs, referências entre tabelas, campos obrigatórios, estados e unidades/decimais.
- Conciliação das secções dos 19 troços com os 12 tipos do cadastro legado.
- Barreiras contra promoção automática de observações a elementos e contra liberação de quantitativos pendentes.
- Testes de corrupção de fonte, referência inexistente, página trocada, duplicação, falso zero de conflito, promoção indevida, decimal inválido e liberação indevida.
- Reprodução das 45 ampliações a partir do PDF preservado; inspeção das regiões de mapas e pormenores relevantes.

Executar `python3 scripts/validar_base_tecnica.py` para validar a base anterior e o novo lote. O validador documental também funciona separadamente. A integridade dos arquivos não substitui a resolução técnica das pendências.
