# Revisão dos critérios de cálculo — obra 707

Revisão documental de 29/09/2026. Substitui a análise original de [e7c3897](https://github.com/vjdjtom/707/blob/e7c3897ae54a484be9a2e6d2e3f010c125859aa9/ANALISE_NORMAS.md), preservada no histórico.

Esta revisão corrige expressões e conclusões do documento anterior. Não altera as planilhas nem certifica conformidade estrutural. A edição normativa contratual e o Anexo Nacional aplicável continuam PENDENTES de confirmação. As referências EC2 abaixo dizem respeito à primeira geração tratada no material citado; não presumir aplicação de uma edição mais recente.

## 1. Quantidades geométricas e perdas

Para secções constantes: volume = área × comprimento. Retângulo: A = B × H; círculo: A = πD²/4. Deduzir interseções e vazios conforme geometria e critério de medição, evitando duplicação entre elementos.

Perdas de compra devem ter campo próprio, separado da quantidade de projeto e da execução medida. Não acrescentar desperdício automaticamente ao auto. A alegação anterior de que a NP EN 206 ou o LNEC definem 2%–5% para este caso não foi sustentada por uma cláusula verificável e foi retirada. Não adotar percentagem sem origem documentada.

## 2. Emendas e ancoragens

No material técnico do JRC, diapositivos 7, 8 e 16, as expressões de referência são:

- lb,rqd = (φ/4) × σsd/fbd
- fbd = 2,25 × η1 × η2 × fctd
- l0 = max(α1 × α2 × α3 × α5 × α6 × lb,rqd; l0,min)
- l0,min = max(0,30 × α6 × lb,rqd; 15φ; 200 mm)

A versão anterior multiplicava pelo mínimo em vez de lb,rqd e confundia mínimos de ancoragem com sobreposição. Fonte: [JRC — Arrieta, Detailing, 2011](https://eurocodes.jrc.ec.europa.eu/sites/default/files/2022-06/05_EC2WS_Arrieta_Detailing.pdf).

Não considerar σsd automaticamente igual à resistência de cálculo do aço. Retira-se também a expressão anterior fctd = fctk/(1,5 × γc), não validada: valores e coeficientes devem provir da edição contratual. Um comprimento em mm não pode ser usado como multiplicador adimensional de φ.

O fator 50φ fica limitado às emendas identificadas no projeto, conforme [revisão do desenho 05](docs/REVISAO_PILARES_PDF.md). Não é uma regra universal portuguesa demonstrada neste documento. Contar apenas as emendas efetivas e excluir parcelas já incluídas no corte.

## 3. Ganchos e cortes desenvolvidos

Retirada a equivalência geral entre gancho a 135° e comprimento curvo de 10φ. Cauda reta, arco de dobragem e comprimento total do fecho são parcelas distintas. O material JRC trata a ancoragem de cintas em 8.5 e identifica comprimentos depois da curva, nos diapositivos 13–14; não sustenta a interpretação anterior.

Para cada peça, registrar forma, dimensões, diâmetro, raio de dobragem, caudas e fonte. Com raio ao eixo R e ângulo θ em radianos:

L_arco = R × θ
L_corte = soma dos trechos retos entre tangências + soma dos arcos + caudas

Não adicionar novamente caudas ou arcos já incluídos em outras parcelas. A leitura existente do desenho 05 registra 5φ, 6φ e diâmetro interior de dobragem 5φ; é necessário identificar a função de cada cota na peça antes de compor o corte. Cintas interiores e sobrepostas são peças próprias.

## 4. Recobrimento e perímetro

Sendo c a distância da face do betão à superfície exterior da cinta e φ o seu diâmetro em metros, o eixo da cinta fica a c + φ/2 da face.

Comparação geométrica simplificada, antes dos ajustes de cantos e fecho:

- Retângulo: P_eixo = 2 × [(B − 2c − φ) + (H − 2c − φ)].
- Círculo: P_eixo = π × (D − 2c − φ).

Usar apenas c produz perímetro MAIOR: diferença 4φ no retângulo e πφ no círculo. Para φ = 8 mm: 32 mm e aproximadamente 25,133 mm, respetivamente. O sinal da conclusão anterior estava invertido.

Estes perímetros não são cortes finais: cantos arredondados, abertura e fecho precisam de desenvolvimento. A expressão anterior de correção duplicava a parcela dos ganchos. Quando g é um comprimento adicional completo por gancho e n a quantidade, somar n × g uma única vez.

## 5. Contagem de cintas por posições

Não trocar ROUNDUP por ROUNDDOWN sem definir a disposição.

Para posições fixas x0 + k × s, com k inteiro não negativo, a contagem até x é zero se x < x0; caso contrário é floor((x − x0)/s) + 1. Em cálculo decimal, tratar a tolerância de divisão nos limites. O mês é a diferença entre contagens acumuladas. Zonas adjacentes não podem contar duas vezes a posição comum.

Se duas posições extremas distam L e é necessário redistribuir intervalos não superiores a s, são necessários ceil(L/s) intervalos e ceil(L/s) + 1 posições. Isso define outra disposição, não a contagem de uma sequência já fixada.

Exemplo aritmético: L = 1,05 m, s = 0,20 m. A sequência de 0 a 1,00 m contém 6 posições; exigir também a extremidade de 1,05 m requer outra posição ou redistribuição, totalizando pelo menos 7 posições. Não deduzir daí um espaçamento admissível normativo.

Na obra, usar as zonas e posições do desenho. A folha Contagem de cintas já separa posição inicial, passo e limites anterior/atual. Os acertos devem descontar a quantidade já incluída na base por metro.

## 6. Massa linear e arredondamento

Com densidade adotada de 7850 kg/m³ e φ em mm:

m = (π/4) × 7850 × 10^-6 × φ² = 0,00616537558267 × φ² kg/m.

O coeficiente 0,006162 da derivação anterior estava incorreto. 0,00617 é uma aproximação; 0,006165375 é a aproximação mais precisa usada no modelo de auto. A memória unitária utiliza pesos tabelados arredondados, por exemplo Ø16 = 1,578 kg/m. Registrar qual convenção alimenta cada resultado e não misturar métodos silenciosamente.

Para 28Ø16 por metro: fórmula geométrica = 44,193412 kg/m; tabela a 1,578 = 44,184 kg/m. A diferença é arredondamento, não mudança da armadura. Não alterar retroativamente autos aprovados.

## 7. Aplicação e pendências

Para fechar uma massa: quantidade de peças × corte unitário confirmado × massa linear adotada. Registrar elemento/fração/piso, marca da peça, revisão/página do desenho, número de peças e critério de corte.

Continuam PENDENTES alturas por ocorrência, cortes desenvolvidos, contagens por zona e interfaces ainda não confirmadas. Perdas de compra e execução mensal são registos separados. Este documento não libera quantitativos nem transforma dados em falta em zero.

Referências locais: [cadastro 01–06](docs/CADASTRO_ESTABILIDADE_01_06_20260929.md), [critérios documentais](base_tecnica/estabilidade_20260928/criterios_e_notas.csv) e [continuidade](docs/CONTINUIDADE_AUTOS.md).

## 8. Verificação desta revisão

Conferidas as expressões de sobreposição e a distinção entre cauda e curva no material JRC. Verificados por cálculo independente o sinal da correção de perímetro, os dois exemplos de contagem e a massa linear. Eliminadas secções repetidas e tabela danificada. Não foram alterados XLSX, dados de execução ou critérios de projeto.
