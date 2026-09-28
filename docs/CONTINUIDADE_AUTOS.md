# Continuidade — autos mensais da obra 707

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
