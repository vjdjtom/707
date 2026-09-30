# Cintas e níveis — 30/09/2026

Entrega: [planilha com 14 abas](../../planilhas/Memorias_Aco_707_Cintas_e_Niveis.xlsx). Preserva as 12 abas da versão anterior, sem inserir execução real.

## Cintas: cálculo condicional

`cortes_modelo.csv` contém cinco geometrias em duas alternativas de recobrimento (30 e 50 mm). O recobrimento aplicável não foi atribuído automaticamente a elementos. Fonte: desenho 05, página 8 do PDF completo. Secções e fecho foram lidos; a aplicação do mandril 5Ø a todos os cantos permanece PENDENTE. Não constitui lista de corte liberada.

Modelo geométrico: Ø8, três curvas de 90°, dois fechos de 135° e duas caudas 5Ø. Raio ao eixo R=(5+1)Ø/2. B_eixo=B−2c−Ø; H_eixo=H−2c−Ø. Retos=2(B_eixo+H_eixo)−8R; arcos=3πR; caudas=10Ø. L é a soma dessas três parcelas. Dimensões em metros. Peso=L×0,395 kg/m, mantendo a tabela da planilha anterior. Dimensão ao eixo ≤2R bloqueia o resultado com PENDENTE.

P1/P8 e P2 incluem só a cinta exterior. P3/P4/P5, P6 e P7 inferior representam a cinta retangular simples. Cintas interiores, sobrepostas de P9/P10/P11 e círculo de P7 superior não foram quantificados. Colunas kg/m a 0,20 e 0,10 são frequências, não contagens inteiras por troço. Não foram transferidas para Armaduras base.

## Níveis: referência separada do corte real

Desenhos 07 e 08 (páginas 10 e 11), fração A, P1 E/8: −0,20 a 3,22 = 3,42 m; 3,22 a 6,45 = 3,23 m. A associação local do nível 6,45 depende da continuidade da viga V4 e está PENDENTE. Os produtos por 18,348 kg/m são referências retas condicionais, não comprimentos de varões nem totais de aço. Faces, arranques, emendas, término e cintas não estão incluídos. A coluna de total permanece PENDENTE.

Rastreabilidade: `manifesto.json` identifica PDF, hash, páginas e coordenadas dos recortes examinados. Preservam-se os cadastros e planilhas anteriores.

## Verificação

Comparadas todas as células existentes: valores e fórmulas das 12 abas anteriores preservados. Os dez cortes e pesos foram conferidos por cálculo independente e após recálculo no LibreOffice; 14 abas, zero erros de fórmula. Teste de dimensão impossível retornou PENDENTE. Inspecionadas visualmente as novas tabelas. Não houve teste interativo no Excel nem validação da aplicação do modelo para fabrico.
