# Revisão das fórmulas — MUROS

Atualizado em 08/10/2026.

## Entrega

Foi criada uma cópia corrigida e independente da folha de muros:

- `planilhas/MUROS_707_Corrigido.xlsx`

A planilha original `planilhas/Barba_Atualizada.xlsx` foi preservada sem alterações.

A revisão usa como fonte os dados da folha **MUROS** preservados em `docs/dados_barba_extraidos.json` e os critérios já documentados em `docs/CONTINUIDADE_AUTOS.md` e `docs/MEMORIAS_UNITARIAS.md`.

## Principais problemas encontrados

1. **Contagens com INT**  
   A fonte utilizava expressões do tipo `INT(vão/espaçamento)+1`. Quando o vão não é múltiplo do espaçamento, isso pode produzir um espaçamento real superior ao indicado no projeto.

2. **PENDENTE tratado como zero em fórmulas antigas**  
   Dimensões em falta podiam originar zero e permitir subtotais aparentemente fechados. Nesta revisão, uma dimensão obrigatória em falta mantém a parcela e os totais como `PENDENTE`.

3. **Empalmes em elementos longos**  
   A fórmula original acrescentava apenas um `50Ø` quando o comprimento ultrapassava 12 m. Para um elemento longo, como o Pb.1 atualmente registado com 63,00 m, isso não representa necessariamente o plano real de cortes e empalmes. A revisão exige **corte final por varão** quando o comprimento ultrapassa o limite parametrizado.

4. **Malhas de sapatas**  
   As contagens passam a usar dimensão útil e `ROUNDUP`, com cobrimento parametrizado. Os comprimentos longitudinais acima de 12 m ficam pendentes até ser introduzido o corte final.

5. **Cofragem e betão de limpeza**  
   O número de faces de cofragem do paramento e a espessura do betão de limpeza passaram a ser parâmetros visíveis. A espessura de limpeza permanece em 0,05 m, herdada da planilha, mas existe divergência documentada com artigo contratual de 0,10 m; deve ser compatibilizada antes de um auto real.

6. **Erros #VALUE! em Pa.2 com altura pendente**  
   As fórmulas foram reorganizadas em `IF` aninhados para que nenhuma operação aritmética seja executada sobre o texto `PENDENTE`.

## Fórmulas e critérios implementados

- Contagem de barras: `ROUNDUP(vão útil / espaçamento; 0) + 1`.
- Peso de aço: quantidade × corte final por varão × peso linear.
- Os cortes finais opcionais, quando preenchidos, têm prioridade e devem já incluir dobras, ganchos e transpasses aplicáveis.
- Para comprimentos acima de 12 m, não é inventado um número de empalmes: o corte final fica `PENDENTE`.
- Betão do muro: `n × L × e × h`.
- Betão da sapata: `n × L × b × h_sap`.
- Betão de limpeza: `n × L × b × espessura_limpeza`.
- Cofragem do paramento: `n × L × h × nº_faces`.
- `PENDENTE` não equivale a zero e bloqueia subtotais e total geral.

## Dados preservados da fonte

Foram mantidos os valores atuais do levantamento sem inventar dimensões:

- MS.1: L = 6,47 m.
- MS.2, MS.3, MS.4 e Pb.2: comprimento continua `PENDENTE`.
- Pb.1: L = 63,00 m na extração atual, apesar da observação antiga ainda dizer “L pendente”; requer confirmação do desenho e cortes finais.
- Pa.2 Piso 0→Cob: h = 7,20 m na extração atual, apesar da nota antiga ainda dizer “h pendente”; requer confirmação pelas cotas dos pisos.
- Pa.2 Piso -1→0: altura continua `PENDENTE`.

## Verificação de cálculo

Com os dados atuais, a linha MS.1 recalcula:

- aço vertical: 216,567 kg;
- aço horizontal: 175,648 kg;
- malha inferior da sapata: 42,585 kg;
- malha superior da sapata: 42,585 kg;
- cintas: 37,541 kg;
- aço total: 514,926 kg;
- betão do muro: 4,076 m³;
- betão da sapata: 2,070 m³;
- betão de limpeza: 0,259 m³;
- cofragem do paramento: 40,761 m².

A linha Pa.2 Piso 0→Cob, usando provisoriamente os dados que já estavam preenchidos, recalcula:

- aço longitudinal: 227,232 kg;
- aço de distribuição: 33,787 kg;
- cintas: 44,904 kg;
- aço total: 305,923 kg;
- betão: 2,304 m³;
- cofragem: 11,520 m².

Estes resultados são **quantitativos de projeto/levantamento**, não execução mensal nem auto aprovado.

## Testes

- A folha `MUROS` foi recalculada no motor de planilhas.
- Foi efetuada procura específica por `#REF!`, `#DIV/0!`, `#VALUE!`, `#NAME?` e `#N/A` na folha `MUROS`: nenhum erro encontrado.
- As linhas com dados obrigatórios em falta permanecem `PENDENTE`.
- O ficheiro não altera autos anteriores nem a planilha fonte.

## Pendências antes de usar em medição real

- confirmar comprimentos MS.2, MS.3, MS.4 e Pb.2;
- confirmar L = 63,00 m de Pb.1 e definir os cortes/empalmes reais;
- confirmar as alturas de Pa.2 pelas cotas do projeto;
- confirmar cortes desenvolvidos, dobras, ganchos e zonas especiais;
- compatibilizar betão de limpeza de 0,05 m com o artigo contratual que indica 0,10 m;
- confirmar quais faces são efetivamente cofradas em cada elemento;
- conferir as geometrias com o desenho estrutural antes de transferir quantidades para um auto.
