# Continuidade — autos mensais da obra 707

## Revisão de ANALISE_NORMAS.md — 29/09/2026

Revisado o documento recebido da main no commit e7c3897, com ligação permanente ao original. Corrigidos mínimos de sobreposição, interpretação de ganchos, sinal da correção do perímetro, duplicação de ganchos, contagem por posições e coeficiente da massa linear. Retiradas atribuições normativas sem cláusula verificável e separados desperdício de compra e execução medida. Conferência com material técnico JRC e verificações aritméticas de contagem, perímetro e massa. A edição contratual/Anexo Nacional e os cortes reais continuam PENDENTES. Esta etapa altera apenas documentação; as planilhas e os quantitativos não foram atualizados.

Atualizado em 28/09/2026.

## Objetivo acordado
Preparar autos de medição com o que foi efetivamente executado no mês, com memórias de cálculo de aço (kg), betão (m³) e cofragem (m²), por elemento, troço e piso. Quantidades de projeto não equivalem a execução. Aço, cofragem e betão podem ser medidos em meses distintos para o mesmo elemento.

## Orientação do utilizador
Guardar no GitHub as entregas e o resumo das decisões, critérios, testes e pendências após cada etapa concluída deste projeto. Não depender apenas do histórico da conversa. Esta orientação foi expressamente pedida pelo utilizador.

## Entregas
- [Modelo em branco](../planilhas/Modelo_Auto_Mensal_707.xlsx).
- [Exemplo fictício de setembro de 2026](../planilhas/Auto_Mensal_707_TESTE_Setembro_2026.xlsx).

As entregas são independentes de Barba_Atualizada.xlsx e Quantitativos_Pilares.xlsx. Os ficheiros anteriores não foram alterados.
As cinco folhas são Auto mensal, Aço, Betão, Cofragem e Como preencher.
Capacidade preparada: 30 artigos no auto (linhas 13–42) e 100 linhas por memória (8–107). Ampliar exige estender também os intervalos das fórmulas.

## Critérios implementados
- Um ficheiro por subempreiteiro e período.
- Entradas amarelas; restantes resultados calculados.
- Código único por artigo/material/preço.
- Anterior = acumulado aprovado até antes do período, introduzido explicitamente (zero no primeiro auto).
- Mês = soma de memórias válidas dentro das datas de início e fim.
- Acumulado = anterior + mês; saldo = contrato − acumulado.
- Aço = número de varões × (trecho reto + dobras/ganchos + transpasses por varão) × 0,006165375 × diâmetro².
- Comprimentos em metros e diâmetros em milímetros. Não duplicar transpasses ou ganchos já incluídos no comprimento.
- Betão retangular = número × B × H × comprimento/altura executada − dedução total da linha.
- Betão circular = número × π × diâmetro² / 4 × altura executada − dedução.
- Cofragem = número de faces iguais × comprimento × altura/largura − dedução total da linha.
- Só considerar as faces efetivamente cofradas e os critérios de medição contratuais.
- Dobras/transpasses e deduções vazios significam zero. Dimensões obrigatórias em falta geram pendência.
- Valor = quantidade sem arredondamento prévio × preço, arredondado aos cêntimos por artigo.
- Total antes de IVA, retenções, adiantamentos ou outros ajustes. Estes não estão implementados.
- Linhas fora do período são excluídas e contadas no auto. Pendências impedem o total de aparecer como um valor final.
- Não há controlo automático de duplicação entre ficheiros de meses diferentes; conferir contra autos aprovados.
- Não regenerar ou sobrescrever autos aprovados. Guardar cópia fechada de cada mês.

## Exemplo de teste — dados inteiramente fictícios
Setembro de 2026, Empresa Exemplo, contrato fictício, TESTE-01. Não é medição real nem auto aprovado.
- Aço e cofragem em P1, P2 e P3. Betão apenas em P1 e P2.
- Por pilar: 8 varões Ø16 com 3,00 m retos + 0,80 m de transpasse; 16 cintas Ø8 com 1,04 m + 0,16 m de ganchos.
- Betão por pilar betonado: 0,30 × 0,40 × 3,00 = 0,360 m³.
- Cofragem por pilar: 2 × 0,30 × 3,00 + 2 × 0,40 × 3,00 = 4,200 m².
- Uma linha de aço de 31/08/2026 demonstra a exclusão do período; representa parte do anterior fictício.

| Material | Contrato | Anterior | Setembro | Preço unitário | Valor mensal |
|---|---:|---:|---:|---:|---:|
| Aço (kg) | 1500 | 120 | 166,6722816 | 2,00 € | 333,34 € |
| Betão (m³) | 20 | 5 | 0,720 | 125,00 € | 90,00 € |
| Cofragem (m²) | 200 | 20 | 12,600 | 28,00 € | 352,80 € |

Total: **776,14 €**. Zero linhas pendentes e uma fora do período.

## Verificações realizadas
Recalculo no motor de planilhas da ferramenta; comparação independente de quantidades e valores; falta de dimensão; exclusão por data; betão circular; ausência de erros de fórmula detetados; inspeção visual das folhas.
Na cópia preenchida foram preservadas todas as 1019 fórmulas, as cinco folhas e três validações de listas; o total guardado no XLSX foi verificado.
Não foi realizada validação interativa no Excel nativo. Os scripts de construção usaram @oai/artifact-tool no ambiente Codex; os XLSX contêm as fórmulas e podem ser usados diretamente.

## Análise inicial do código existente — ainda não corrigido
- adicionar_autos_marinel_seculum.py apaga e recria as duas abas dos autos e guarda no mesmo ficheiro: perde entradas manuais numa reexecução.
- As divergências do mapa apenas geram avisos; o processo continua com ligações por posição de linha.
- Datas/número do auto são fixos.
- gerar_quantitativos_pilares.py sobrescreve a planilha e repõe alturas a zero.
- O gerador calcula aço de transpasses com alturas zero: cerca de 235,995 kg no conjunto dos dados embutidos.
- Parametros!C11 é sobrescrita com 0,030 apesar da identificação como fórmula de peso linear.
A revisão inicial foi do README e dos dois scripts. Não houve conferência interna das planilhas originais nem comparação com o desenho PDF.

## Próximos dados necessários
Para converter o teste em auto real: período, subempreiteiro, artigos/preços e critérios do contrato, anterior aprovado, elementos e quantidades efetivamente executados, dimensões e desenhos/pormenores de armaduras com referências de medição.
Não inventar preços, alturas ou medições reais. Manter exemplos assinalados como fictícios.


## Atualização — bases unitárias por elemento
Foi verificada internamente a Barba_Atualizada.xlsx (18 abas) e criado [Memorias_Unitarias_707.xlsx](../planilhas/Memorias_Unitarias_707.xlsx), com 46 tipos e 152 componentes de armadura. Ver [MEMORIAS_UNITARIAS.md](MEMORIAS_UNITARIAS.md) para a análise, decisões, testes e pendências. O aço separa a base repetitiva dos acertos locais; cortes em falta ficam pendentes. A fonte original e os autos anteriores permanecem intactos. As limitações da revisão inicial acima referem-se à etapa anterior: esta nova etapa leu as planilhas, mas não fez conferência independente do PDF.

## Atualização — conferência dos pilares no PDF

Criado [Memorias_Unitarias_707_Revisao_Pilares.xlsx](../planilhas/Memorias_Unitarias_707_Revisao_Pilares.xlsx), com nove folhas. Conferidos 19 troços, secções e armadura longitudinal. Acrescentados critérios do desenho 05 para emendas/segmentos e folha de contagem de cintas por zona e mês. Cortes desenvolvidos e alturas continuam pendentes; aço total não foi finalizado. O PDF contém muros, paredes e escada E1, corrigindo a declaração anterior de ausência de muros. Os restantes elementos aguardam conferência detalhada. Ver [REVISAO_PILARES_PDF.md](REVISAO_PILARES_PDF.md) para fontes, uso, testes e próximos passos. Original Barba e entregas anteriores preservados. Nenhuma execução real adicionada.

## Atualização de 29/09/2026 - PDF completo e desenhos 01-06

Criado o [lote documental de estabilidade](../base_tecnica/estabilidade_20260928/README.md) a partir do PDF completo preservado no repositório, com hash, 6 desenhos e 45 regiões de evidência. Inclui mapas S1-S7, LF1/VF1/LF2, 130 ocorrências gráficas de fundações, 19 troços típicos de pilares, 6 muros, 3 variantes de paredes, 23 troços metálicos e 9 pormenores de ligação. Ver [relatório da etapa](CADASTRO_ESTABILIDADE_01_06_20260929.md).

As ocorrências gráficas ainda têm eixos exatos, cotas e interfaces pendentes. Não equivalem a elementos de execução. Detectadas divergências de chumbadouros no pormenor C e de dimensões de chapa no H; ambas ficaram PENDENTES. Nenhum quantitativo final ou auto foi gerado. Preservados os históricos, tipos/armaduras anteriores e a execução. Próxima continuidade: resolver as pendências por elemento, cruzando geometria e cortes 07-26 quando necessário, antes de calcular ou importar execução.

## Atualização de 29/09/2026 — implantação das fundações e retificação D/E

Foi criada a visão vigente de implantação em [implantacao_fundacoes_20260929](../base_tecnica/implantacao_fundacoes_20260929/). A leitura dos desenhos 13 e 15 confirmou que a fração D usa os eixos 25–32 e a fração E usa os eixos 33–40; as 25 ocorrências afetadas foram retificadas numa tabela nova, mantendo os IDs, o CSV histórico e os hashes anteriores.

O lote registra 10 grades de fração, 106 intervalos entre eixos, 140 referências de apoios, 10 cotas pontuais e 130 ocorrências consolidadas. Os eixos de apoio foram separados do centro geométrico da sapata. Dimensões nominais por tipo podem ser consultadas, mas limites líquidos, cotas altimétricas de referência, centros de sapata, volumes e qualquer medição de execução continuam PENDENTES. Nenhuma execução ou quantitativo final foi criado.

Validações executadas: `validar_implantacao_fundacoes.py`, `validar_base_tecnica.py`, verificação de espaços no diff e compilação sintática do novo validador. Próxima etapa: cruzar cada apoio com a definição geométrica e cortes dos desenhos 07–26, liberando somente os campos confirmados por evidência.
