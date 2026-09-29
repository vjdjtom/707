1. Volume de betão

  Fórmula na planilha
  =F{r}*H{r}*(1+Parametros!$C$12)
  - F{r} = área da seção (m²)
  - H{r} = altura do troco (m)
  - Parametros!$C$12 = perda / desperdício de betão (default 0,00)
  
  Conformidade
  - O cálculo de volume = área × altura está correto.
  - O fator de desperdício é uma boa prática de obra; o valor deve ser definido conforme o Anexo Nacional
    da NP EN 206‑1 ou orientações do LNEC (ex.: 2 %–5 % para betão bombeado).
  - Não há correção necessária, apenas assegurar que o percentual de perda seja preenchido com o valor
    adequado ao projeto.

  Fontes
  - CT 115 – Eurocódigos Estruturais (LNEC): https://www.lnec.pt/services/normreg/norm/ct115
  - NP EN 206‑1:2013+A2:2021 (Betão – Especificação, desempenho, produção e conformidade) – disponível
    para consulta no catálogo do IPQ: https://www.ipq.pt/servicos-ipq/consultar-o-catalogo-de-normas/

  ---

  2. Área e perímetro da seção
  
  Fórmulas na planilha
  Área: =IF(C{r}="Circular",PI()*(D{r}/2)^2,D{r}*E{r})
  Perímetro: =IF(C{r}="Circular",PI()*D{r},2*(D{r}+E{r}))
  - D{r} e E{r} são as dimensões B e H (ou diâmetro para circular).
  - Para seção circular, usa‑se a fórmula exata de área e perímetro.
  - Para retangular, área = B×H e perímetro = 2(B+H).
  
  Conformidade
  - Totalmente conforme com a definição geométrica das seções.
  - Nenhuma correção necessária.

  ---

  3. Comprimento de sobreposição (lap) das barras longitudinais

  Fórmula na planilha
  =IF(K{r}=0,0,{lap_mult_cell}*L{r}/1000)
  - {lap_mult_cell} = Parametros!$C$7 (default 50)
  - L{r} = diâmetro da barra (mm)
  - Resultado em metros.

  Verificação normativa (EC2 – NP EN 1992‑1‑1)
  O comprimento de sobreposição básico (l0) é dado por:
  l0 = α1·α2·α3·α5·α6·lb,min   ≥ lb,min
  lb,min = max(0.3·α6·lb,req ; 10·φ ; 100 mm)
  lb,req = (φ/4)·(σsd / fbd)
  onde:
  - σsd = tensão de projeto do aço = fyk / γs
  - fbd = resistência à aderência de projeto = 2.25·η1·η2·fctd
  - fctd = fctk / (1.5·γc)
  - φ = diâmetro nominal da barra (mm)
  
  Os fatores α1–α6 dependem do tipo de barra, do revestimento, do confinamento por transversais etc.

  Prática nacional portuguesa
  Muitos projetistas adotam, como valor de consolidação no Anexo Nacional português, um comprimento de
  sobreposição simplificado de 50·φ para barras em tração (B500B) quando as condições de aderência são
  normais. Esse valor está amplamente presente em orientações do LNEC e em guias de boa prática.

  Conclusão
  - O fator 50 usado na planilha está de acordo com a simplificação mais comum adotada na prática
    portuguesa (e pode ser encontrado em exemplos do LNEC).
  - Se o projeto exigir um cálculo rigoroso, recomenda‑se substituir o fator 50 por:
  = {lap_mult_cell}*L{r}/1000
    onde {lap_mult_cell} deveria ser preenchido com o valor resultante da expressão completa de l0 (ou,
    alternativamente, com o valor especificado no Anexo Nacional da NP EN 1992‑1‑1 para Portugal). 
  - Sugestão: criar uma célula em “Parametros” que calcule automaticamente lb,min e l0 a partir das
    propriedades do aço e do betão (fck, fyk, γs, γc, etc.) e usar esse resultado como multiplicador.

  Fontes
  - NP EN 1992‑1‑1:2005+A1:2014 (Eurocódigo 2 – Projeto de estruturas de betão) – secção 8.4.3.
  - Anexo Nacional da NP EN 1992‑1‑1 (disponível no IPQ).
  - CT 115 – LNEC (orientações de aplicação).
  
  ---

  4. Comprimento de gancho das cintas/estribos

  Fórmula na planilha (para cada gancho, dois ganchos por cinta)
  {hook_mult_cell}*Y{r}/1000
  - {hook_mult_cell} = Parametros!$C$8 (default 10)
  - Y{r} = diâmetro da cinta (mm)
  - Resultado em metros por gancho.

  Verificação normativa (EC2 – NP EN 1992‑1‑1)
  Para ganchos normais (ângulo 135° ≈ standard hook), o comprimento mínimo da parte curva do gancho
  (medido ao longo do eixo da barra) é:
  lhook ≥ 10·φ   (para ganchos de 135°)
  (ver Figura 8.2 da EC2 e o parágrafo 8.2). Alguns países adotam 8·φ para ganchos de 90°; o valor 10·φ é
  amplamente utilizado para ganchos de 135°. 

  Conformidade
  - O valor 10·φ usado na planilha está em acordo com a recomendação geral da EC2 para ganchos de 135°.
  - Nenhuma correção necessária, desde que o gancho realmente seja de 135°. Se o projeto utilizar outro
    tipo de gancho (ex.: 90° ou 180°), o multiplicador deve ser ajustado conforme a tabela 8.2 da EC2.

  Fontes
  - NP EN 1992‑1‑1:2005+A1:2014, secção 8.2 (formas ganchadas e dobradas).
  - CT 115 – LNEC.
  
  ---

  5. Número de cintas/estribos

  Fórmula na planilha
  =IF(H{r}=0,0,ROUNDUP(H{r}/Z{r},0)+1)
  - H{r} = altura do troco (m)
  - Z{r} = espaçamento entre cintas (m)
  - ROUNDUP arredonda para o número inteiro superior.
  
  Análise
  Esta expressão fornece:
  - Uma cinta na base (cota 0)
  - Uma cinta a cada espaçamento Z
  - Uma cinta no topo (cota H)

  É equivalente a n = ⌈H/Z⌉ + 1.

  Comparação com EC2
  Para vigas e colunas, o número mínimo de estribos necessários para garantir que o espaçamento máximo não
  seja ultrapassado é:
  n = ⌊H / s⌋ + 1
  onde s é o espaçamento máximo permitido (geralmente s ≤ 0,75·d ou s ≤ 60 mm para carga de cisalhamento,
  etc.). 
  A diferença entre ⌈H/Z⌉+1 e ⌊H/Z⌋+1 ocorre quando H é múltiplo exato de Z:
  - Se H/Z é inteiro, ⌈H/Z⌉ = H/Z, então a planilha dá n = H/Z + 1.
  - A expressão exata dá n = H/Z + 1 também (pois ⌊H/Z⌋ = H/Z).
  - Portanto, para esse caso, ambas são idênticas.
  - Quando H/Z não é inteiro, ⌈H/Z⌉ = ⌊H/Z⌋+1, então a planilha dá n = (⌊H/Z⌋+1)+1 = ⌊H/Z⌋+2, ou seja, uma
    cinta a mais do que o mínimo estritamente necessário.

  Conclusão
  - A fórmula usada é levemente conservadora (pode acrescentar uma cinta extra quando a altura não é
    múltiplo exato do espaçamento).
  - Isso não é incorreto do ponto de vista da segurança; apenas pode levar a um ligeiro sobrecusto.
  - Se quiser otimizar exatamente o número mínimo, substitua por:
  =IF(H{r}=0,0,ROUNDDOWN(H{r}/Z{r},0)+1)
    (em Excel, ROUNDDOWN é equivalente a INT para números positivos).
  - Recomendação: manter a fórmula atual se a margem de conservadorismo for aceitável; caso contrário,
    adotar a versão com ROUNDDOWN.

  Fontes
  - NP EN 1992‑1‑1:2005+A1:2014, secção 9.2.2 (detalhamento de barras de cisalhamento).
  - CT 115 – LNEC.

  ---

  6. Comprimento de uma cinta/estribo (perímetro interior + ganchos)

  Fórmula na planilha
  =IF(C{r}="Circular",
        PI()*(D{r}-2*{cover_cell}) + {hook_count_cell}*{hook_mult_cell}*Y{r}/1000,
        2*((D{r}-2*{cover_cell})+(E{r}-2*{cover_cell})) + {hook_count_cell}*{hook_mult_cell}*Y{r}/1000)
  - {cover_cell} = Parametros!$C$5 (default 0,030 m = 30 mm)
  - {hook_count_cell} = Parametros!$C$9 (default 2) 
  - {hook_mult_cell} = Parametros!$C$8 (default 10)

  Análise
  - Para seção circular: comprimento = π · (diâmetro interno) + 2 · comprimento de gancho.
  - Para seção retangular: comprimento = 2·[(B‑2·cover)+(H‑2·cover)] + 2·comprimento de gancho.
    Isso corresponde ao perímetro do ponto médio da barra situado a uma distância cover da superfície
    externa do betão (ou seja, a linha média da barra fica no contorno interno reduzido pelo
    recobrimento).
  - O comprimento de gancho é calculado como n_ganchos × (10·φ) convertendo mm para m.
  
  Conformidade com EC2
  - A EC2 indica que o comprimento das dobras/ganchos deve ser medido ao longo do eixo da barra, e o
    perímetro das estribos deve ser baseado no eixo da barra (não na superfície externa nem no interno).
  - Se considerarmos que o centro da barra fica a cover + φ/2 da superfície externa, o perímetro exato
    seria:
    - Circular: π·[D − 2·(cover + φ/2)]
    - Retangular: 2·[(B − 2·(cover + φ/2)) + (H − 2·(cover + φ/2))]
    
  - A planilha usa D‑2·cover e H‑2·cover, ou seja, considera o centro da barra na superfície interna do
    betão (ignorando o raio da barra). Isso resulta em um comprimento ligeiramente menor (por cerca de π·φ
    para circular ou 2·φ para cada lado retangular).
  - Na prática, a diferença é pequena (para φ = 8 mm, a redução é ~25 mm num estribo retangular de
    0,30×0,60 m – menos de 1 % do perímetro total). Muitos projetistas adotam a simplificação cover
    apenas, considerando suficientemente conservadora porque o gancho adiciona comprimento extra.

  Conformidade

  - A abordagem é aceitável para uso prático, embora tecnicamente subestime o perímetro em uma quantidade
    pequena.
  - Se desejar maior precisão, ajuste as fórmulas para subtrair 2*(cover_cell + Y{r}/2000) (ou seja, cover
    + raio da barra).
  - Exemplo de correção para seção retangular:
  =2*((D{r}-2*($Parametros!$C$5 + Y{r}/2000))+(E{r}-2*($Parametros!$C$5 + Y{r}/2000))) +
  2*$Parametros!$C$9*$Parametros!$C$8*Y{r}/1000
    (análoga para circular).

  Fontes
  - NP EN 1992‑1‑1:2005+A1:2014, secção 8.2 (formas ganchadas e dobradas) e secção 9.2 (detalhamento de
    estruturas de betão).
  - CT 115 – LNEC.
  
  ---

  7. Peso linear do aço (fórmula usada na planilha)

  Fórmula na planilha
  =0.00617*L{r}^2
  - L{r} = diâmetro em mm
  - Resultado em kg/m.

  Verificação
  Derivação:
   peso linear = (π/4)·d²·ρ
                = (π/4)·(d/1000)²·7850
                = 0,006162·d²  ≈ 0,00617·d²
  - Totalmente correta.
  - Nenhuma correção necessária.

  Fontes
  - Qualquer texto de propriedades do aço para construção (ex.: Eurocódigo 3, ou tabelas de perfis).
  
  ---

  8. Aplicação dos fatores de desperdício (concreto e aço)

  Fórmulas na planilha
  - Volume betão: multiplica por (1+Parametros!$C$12)
  - Peso de aço longitudinal: multiplica por (1+Parametros!$C$13)
  - Peso de cintas: multiplica por (1+Parametros!$C$13)
  
  Conformidade
  - É boa prática incluir perdas de materiais; os percentuais devem ser definidos com base no plano de
    obra ou orientações do LNEC. 
  - Não há correção necessária, desde que os valores sejam preenchidos adequadamente.

  ---

  Resumo das eventuais correções sugeridas

  Item: Comprimento de sobreposição (lap)
  Fórmula atual: =IF(K=0,0, {lap_mult}*L/1000) com {lap_mult}=50
  Sugestão de ajuste (se desejar maior rigor normativo): Substituir o valor fixo 50 por um cálculo baseado
  
  em lb,min e fatores α1…α6 (ou usar o valor especificado no Anexo Nacional português).
  Comentário: Mais alinhado ao EC2; o valor 50 é já uma simplificação amplamente usada.
  Fórmula na planilha
  =0.00617*L{r}^2
  - L{r} = diâmetro em mm
  - Resultado em kg/m.

  Verificação
  Derivação:
   peso linear = (π/4)·d²·ρ
                = (π/4)·(d/1000)²·7850
                = 0,006162·d²  ≈ 0,00617·d²
  - Totalmente correta.
  - Nenhuma correção necessária.

  Fontes
  - Qualquer texto de propriedades do aço para construção (ex.: Eurocódigo 3, ou tabelas de perfis).

  ---

  8. Aplicação dos fatores de desperdício (concreto e aço)

  Fórmulas na planilha
  - Volume betão: multiplica por (1+Parametros!$C$12)
  - Peso de aço longitudinal: multiplica por (1+Parametros!$C$13)
  - Peso de cintas: multiplica por (1+Parametros!$C$13)

  Conformidade
  - É boa prática incluir perdas de materiais; os percentuais devem ser definidos com base no plano de obra ou orientações do LNEC.
  - Não há correção necessária, desde que os valores sejam preenchidos adequadamente.

  ---

  Resumo das eventuais correções sugeridas

  ┌─────────────────────────────┬─────────────────────────────────────────────┬──────────────────────────────────────────────────────────────────────────────────┬────────────────────────────────────────────┐
  │            Item             │                Fórmula atual                │              Sugestão de ajuste (se desejar maior rigor normativo)               │                 Comentário                 │
  ├─────────────────────────────┼─────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────┼────────────────────────────────────────────┤
  │ Comprimento de sobreposição │ =IF(K=0,0, {lap_mult}*L/1000) com           │ Substituir o valor fixo 50 por um cálculo baseado em lb,min e fatores α1…α6 (ou  │ Mais alinhado ao EC2; o valor 50 é já uma  │
  │  (lap)                      │ {lap_mult}=50                               │ usar o valor especificado no Anexo Nacional português).                          │ simplificação amplamente usada.            │
  ├─────────────────────────────┼─────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────┼────────────────────────────────────────────┤
  │ Número de estribos          │ =IF(H=0,0,ROUNDUP(H/Z,0)+1)                 │ Usar =IF(H=0,0,ROUNDDOWN(H/Z,0)+1) para obter o número mínimo exato (ou manter a │ Diferença de, no máximo, uma cinta por     │
  │                             │                                             │  atual se a conservadorismo for aceitável).                                      │ troco.                                     │
  ├─────────────────────────────┼─────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────┼────────────────────────────────────────────┤
  │ Comprimento da cinta        │ Usa D-2·cover e H-2·cover (ou               │ Ajustar para D-2·(cover + φ/2) e H-2·(cover + φ/2) (ou equivalente para          │ Correção de poucos milímetros; impacta     │
  │ (perímetro)                 │ PI()*(D-2·cover) para circular)             │ circular) para considerar o eixo da barra.                                       │ raramente o resultado final.               │
  ├─────────────────────────────┼─────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────┼────────────────────────────────────────────┤
  │ Outros (volume, peso        │ Já conforme com as normas / boas práticas.  │ Nenhuma alteração necessária.                                                    │ —                      │                         │                                         │ (ou manter a atual se a conservadorismo for aceitável).              │ por troco.                          │
  ├─────────────────────────┼─────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────┼─────────────────────────────────────┤
  │ Comprimento da cinta    │ Usa D-2·cover e H-2·cover (ou           │ Ajustar para D-2·(cover + φ/2) e H-2·(cover + φ/2) (ou equivalente   │ Correção de poucos milímetros;      │
  │ (perímetro)             │ PI()*(D-2·cover) para circular)         │ para circular) para considerar o eixo da barra.                      │ impacta raramente o resultado       │
  │                         │                                         │                                                                      │ final.                              │
  ├─────────────────────────┼─────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────┼─────────────────────────────────────┤
  │ Outros (volume, peso    │ Já conforme com as normas / boas        │ Nenhuma alteração necessária.                                        │ —                                   │
  │ linear, ganchos, etc.)  │ práticas.                               │                                                                      │                                     │
  └─────────────────────────┴─────────────────────────────────────────┴──────────────────────────────────────────────────────────────────────┴─────────────────────────────────────┘

  ---
