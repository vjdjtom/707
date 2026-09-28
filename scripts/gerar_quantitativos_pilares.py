import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from openpyxl.comments import Comment

wb = openpyxl.Workbook()

# ---------- estilos ----------
FONT = "Arial"
title_font = Font(name=FONT, size=14, bold=True, color="FFFFFF")
header_font = Font(name=FONT, size=9, bold=True, color="FFFFFF")
subheader_font = Font(name=FONT, size=9, bold=True)
normal_font = Font(name=FONT, size=10)
small_font = Font(name=FONT, size=9)
bold_font = Font(name=FONT, size=10, bold=True)

navy_fill = PatternFill("solid", fgColor="1F3864")
blue_fill = PatternFill("solid", fgColor="2E5395")
input_fill = PatternFill("solid", fgColor="FFF2CC")
group1_fill = PatternFill("solid", fgColor="DDEBF7")
group2_fill = PatternFill("solid", fgColor="E2EFDA")
stirrup_fill = PatternFill("solid", fgColor="FCE4D6")
total_fill = PatternFill("solid", fgColor="D9D9D9")
sub_fill = PatternFill("solid", fgColor="F2F2F2")

thin = Side(style="thin", color="B7B7B7")
border = Border(left=thin, right=thin, top=thin, bottom=thin)

def style_header(cell, fill=blue_fill):
    cell.font = header_font
    cell.fill = fill
    cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    cell.border = border

def style_cell(cell, fill=None, bold=False, num_fmt=None, align="center", font_size=10):
    cell.font = Font(name=FONT, size=font_size, bold=bold)
    if fill:
        cell.fill = fill
    cell.alignment = Alignment(horizontal=align, vertical="center")
    cell.border = border
    if num_fmt:
        cell.number_format = num_fmt

# ==================================================================
# SHEET 1 - PARAMETROS
# ==================================================================
ws0 = wb.active
ws0.title = "Parametros"
ws0.sheet_view.showGridLines = False

ws0["B2"] = "PARAMETROS DE CALCULO"
ws0["B2"].font = Font(name=FONT, size=14, bold=True, color="FFFFFF")
ws0.merge_cells("B2:E2")
ws0["B2"].fill = navy_fill
ws0["B2"].alignment = Alignment(horizontal="left", vertical="center", indent=1)
ws0.row_dimensions[2].height = 26

params = [
    ("Recobrimento vigas e pilares (m)", 0.030, "Fonte: notas do desenho L-337/21-05 (FERCA)"),
    ("Recobrimento em faces em contacto com o solo (m)", 0.050, "Fonte: notas do desenho L-337/21-05 (FERCA)"),
    ("Comprimento de amarracao / transpasse (x diametro)", 50, "Assuncao usual EC2 para armadura longitudinal comprimida/traccionada. Ajustar conforme calculo estrutural."),
    ("Comprimento de gancho de cinta (x diametro, por gancho)", 10, "Assuncao usual para ganchos a 135 graus."),
    ("Numero de ganchos por cinta", 2, ""),
    ("Massa volumica do aco (kg/m3)", 7850, "Valor normativo"),
    ("Formula peso linear do aco (kg/m)", "=0,00617 x Ø(mm)^2", "Formula classica: (pi/4) x d^2 x 7850 kg/m3, com d em mm e resultado em kg/m"),
    ("Perda / desperdicio de betao (%)", 0.00, "Ajustar conforme pratica de obra (tipicamente 2 a 5%)"),
    ("Perda / desperdicio de aco (%)", 0.00, "Ajustar conforme pratica de obra (tipicamente 5 a 10%)"),
]

ws0["B4"] = "Parametro"
ws0["C4"] = "Valor"
ws0["D4"] = "Observacao"
for c in ["B4","C4","D4"]:
    style_header(ws0[c], navy_fill)
ws0.row_dimensions[4].height = 18

row = 5
for name, val, obs in params:
    ws0.cell(row=row, column=2, value=name)
    style_cell(ws0.cell(row=row, column=2), align="left", font_size=10)
    c = ws0.cell(row=row, column=3, value=val)
    style_cell(c, fill=input_fill, bold=True)
    if isinstance(val, float) and val < 1 and val != 0:
        c.number_format = "0.000"
    ws0.cell(row=row, column=4, value=obs)
    style_cell(ws0.cell(row=row, column=4), align="left", font_size=9)
    row += 1

# named-ish reference cells (usaremos referencias absolutas diretas nas formulas)
ws0["C11"].value = 0.030   # cover geral (linha 5)
ws0.column_dimensions["A"].width = 3
ws0.column_dimensions["B"].width = 46
ws0.column_dimensions["C"].width = 14
ws0.column_dimensions["D"].width = 60

ws0["B16"] = "LEGENDA DE CORES (usada na folha 'Mapa de Pilares')"
ws0["B16"].font = bold_font
c = ws0["B17"]; c.value=""; c.fill = input_fill; ws0["C17"] = "Celula de entrada (editar)"; ws0["C17"].font = normal_font
c = ws0["B18"]; c.value=""; c.fill = group1_fill; ws0["C18"] = "Armadura longitudinal - Grupo 1"; ws0["C18"].font = normal_font
c = ws0["B19"]; c.value=""; c.fill = group2_fill; ws0["C19"] = "Armadura longitudinal - Grupo 2"; ws0["C19"].font = normal_font
c = ws0["B20"]; c.value=""; c.fill = stirrup_fill; ws0["C20"] = "Cintas / estribos"; ws0["C20"] = "Cintas / estribos"; ws0["C20"].font = normal_font
c = ws0["B21"]; c.value=""; c.fill = total_fill; ws0["C21"] = "Totais"; ws0["C21"].font = normal_font
for r in range(17,22):
    ws0.row_dimensions[r].height = 16

ws0["B23"] = "IMPORTANTE"
ws0["B23"].font = Font(name=FONT, size=11, bold=True, color="C00000")
ws0["B24"] = ("O desenho 'Mapa de Pilares' (Ferca, proc. L-337/21, des. 05) nao indica os pes-direitos / alturas de cada troco. "
              "As alturas devem ser confirmadas no projeto de arquitetura e nos cortes, e inseridas na coluna 'Altura do Troco' "
              "da folha 'Mapa de Pilares' (celulas amarelas). Enquanto nao forem preenchidas, os volumes e pesos aparecem a zero.")
ws0.merge_cells("B24:E27")
ws0["B24"].alignment = Alignment(horizontal="left", vertical="top", wrap_text=True)
ws0["B24"].font = normal_font

print("Sheet Parametros OK")

# ==================================================================
# SHEET 2 - MAPA DE PILARES (quantitativo detalhado)
# ==================================================================
ws = wb.create_sheet("Mapa de Pilares")
ws.sheet_view.showGridLines = False

ws["A1"] = "QUANTITATIVOS DE PILARES - ACO, BETAO E COFRAGEM"
ws["A1"].font = Font(name=FONT, size=14, bold=True, color="FFFFFF")
ws.merge_cells("A1:AB1")
ws["A1"].fill = navy_fill
ws["A1"].alignment = Alignment(horizontal="left", vertical="center", indent=1)
ws.row_dimensions[1].height = 26

ws["A2"] = "Obra: Edificio Multifamiliar PH, Garrao  |  Desenho base: Mapa de Pilares, Ferca, Proc. L-337/21, Des. 05, Rev.-  |  Fase: Execucao"
ws.merge_cells("A2:AB2")
ws["A2"].font = Font(name=FONT, size=9, italic=True)
ws.row_dimensions[2].height = 16

# --- cabecalhos em 2 niveis (linha 4 grupos, linha 5 colunas) ---
HEAD_ROW = 4
COL_ROW = 5
ws.row_dimensions[HEAD_ROW].height = 16
ws.row_dimensions[COL_ROW].height = 40

groups = [
    ("A","B","IDENTIFICACAO", navy_fill),
    ("C","E","GEOMETRIA DA SECCAO", blue_fill),
    ("F","J","BETAO E COFRAGEM", blue_fill),
    ("K","Q","ARMADURA LONGITUDINAL - GRUPO 1", group1_fill),
    ("R","X","ARMADURA LONGITUDINAL - GRUPO 2", group2_fill),
    ("Y","AC","CINTAS / ESTRIBOS", stirrup_fill),
    ("AD","AF","TOTAIS DO TROCO", total_fill),
]
for c1,c2,label,fill in groups:
    ws.merge_cells(f"{c1}{HEAD_ROW}:{c2}{HEAD_ROW}")
    cell = ws[f"{c1}{HEAD_ROW}"]
    cell.value = label
    cell.font = Font(name=FONT, size=9, bold=True, color="FFFFFF" if fill in (navy_fill,blue_fill) else "000000")
    cell.fill = fill
    cell.alignment = Alignment(horizontal="center", vertical="center")

headers = {
    "A": "Pilar",
    "B": "Troco (entre pisos)",
    "C": "Forma",
    "D": "B / D (m)",
    "E": "H (m)",
    "F": "Area seccao (m2)",
    "G": "Perimetro (m)",
    "H": "Altura do troco (m)",
    "I": "Classe de betao",
    "J": "Volume de betao (m3)",
    "K2": "Area cofragem (m2)",
    "K": "Qtd varoes",
    "L": "Diam. (mm)",
    "M": "Transpasse unit. (m)",
    "N": "Comp. unit. c/ transp. (m)",
    "O": "Comp. total (m)",
    "P": "Peso linear (kg/m)",
    "Q": "Peso Grupo 1 (kg)",
    "R": "Qtd varoes",
    "S": "Diam. (mm)",
    "T": "Transpasse unit. (m)",
    "U": "Comp. unit. c/ transp. (m)",
    "V": "Comp. total (m)",
    "W": "Peso linear (kg/m)",
    "X": "Peso Grupo 2 (kg)",
    "Y": "Diam. cinta (mm)",
    "Z": "Espacamento (m)",
    "AA": "Nº de cintas",
    "AB": "Comp. por cinta (m)",
    "AC": "Peso cintas (kg)",
    "AD": "Peso aco longitudinal (kg)",
    "AE": "Peso aco total (kg)",
    "AF": "Cofragem (m2)",
}

# ajuste: vamos definir manualmente a ordem final de colunas (A..AF) para bater com os merges acima
col_defs = [
    ("A","Pilar"),
    ("B","Troco (entre pisos)"),
    ("C","Forma"),
    ("D","B ou Ø (m)"),
    ("E","H (m)"),
    ("F","Area seccao (m2)"),
    ("G","Perimetro (m)"),
    ("H","Altura do\ntroco (m)"),
    ("I","Classe de\nbetao"),
    ("J","Volume de\nbetao (m3)"),
    ("K","Qtd\nvaroes"),
    ("L","Diam.\n(mm)"),
    ("M","Transpasse\nunit. (m)"),
    ("N","Comp. unit.\nc/ transp. (m)"),
    ("O","Comp.\ntotal (m)"),
    ("P","Peso linear\n(kg/m)"),
    ("Q","Peso\nGrupo 1 (kg)"),
    ("R","Qtd\nvaroes"),
    ("S","Diam.\n(mm)"),
    ("T","Transpasse\nunit. (m)"),
    ("U","Comp. unit.\nc/ transp. (m)"),
    ("V","Comp.\ntotal (m)"),
    ("W","Peso linear\n(kg/m)"),
    ("X","Peso\nGrupo 2 (kg)"),
    ("Y","Diam.\ncinta (mm)"),
    ("Z","Espacamento\n(m)"),
    ("AA","Nº de\ncintas"),
    ("AB","Comp. por\ncinta (m)"),
    ("AC","Peso\ncintas (kg)"),
    ("AD","Peso aco\nlongitudinal (kg)"),
    ("AE","Peso aco\ntotal (kg)"),
    ("AF","Area\ncofragem (m2)"),
]
for col, label in col_defs:
    cell = ws[f"{col}{COL_ROW}"]
    cell.value = label
    cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    cell.border = border
    # cor de fundo conforme grupo
    if col in ("A","B"):
        cell.fill = navy_fill; cell.font = Font(name=FONT,size=9,bold=True,color="FFFFFF")
    elif col in ("C","D","E","F","G"):
        cell.fill = blue_fill; cell.font = Font(name=FONT,size=9,bold=True,color="FFFFFF")
    elif col in ("H","I","J"):
        cell.fill = blue_fill; cell.font = Font(name=FONT,size=9,bold=True,color="FFFFFF")
    elif col in ("K","L","M","N","O","P","Q"):
        cell.fill = group1_fill; cell.font = Font(name=FONT,size=9,bold=True,color="000000")
    elif col in ("R","S","T","U","V","W","X"):
        cell.fill = group2_fill; cell.font = Font(name=FONT,size=9,bold=True,color="000000")
    elif col in ("Y","Z","AA","AB","AC"):
        cell.fill = stirrup_fill; cell.font = Font(name=FONT,size=9,bold=True,color="000000")
    elif col in ("AD","AE","AF"):
        cell.fill = total_fill; cell.font = Font(name=FONT,size=9,bold=True,color="000000")

ws.freeze_panes = "C6"

# ---------------- dados extraidos do desenho ----------------
# (pilar, troco, forma, B_ou_D, H, classe_betao, altura_placeholder,
#  q1, d1, q2, d2, d_cinta, esp_cinta)
DATA = [
    ("P1",  "Piso 0 -> Piso 1",      "Retangular", 0.30, 0.60, "C30/37 XC1(P)", 6, 16, 10, 12, 8, 0.20),
    ("P2",  "Fundacao -> Piso 0",    "Retangular", 0.40, 0.70, "C30/37 XC2(P)", 28, 16, 0, 0, 8, 0.20),
    ("P3",  "Fundacao -> Piso 0",    "Retangular", 0.40, 0.20, "C30/37 XC2(P)", 6, 16, 6, 12, 8, 0.20),
    ("P4",  "Piso 0 -> Piso 1",      "Retangular", 0.20, 0.40, "C30/37 XC1(P)", 6, 16, 6, 12, 8, 0.20),
    ("P5",  "Piso 0 -> Piso 1",      "Retangular", 0.20, 0.40, "C30/37 XC1(P)", 6, 16, 6, 12, 8, 0.20),
    ("P6",  "Fundacao -> Piso 0",    "Retangular", 0.30, 0.30, "C30/37 XC2(P)", 8, 20, 4, 16, 8, 0.20),
    ("P6",  "Piso 0 -> Piso 1",      "Retangular", 0.30, 0.30, "C30/37 XC1(P)", 8, 20, 4, 16, 8, 0.20),
    ("P7",  "Fundacao -> Piso 0",    "Retangular", 0.50, 0.30, "C30/37 XC2(P)", 10, 16, 0, 0, 8, 0.20),
    ("P7",  "Piso 0 -> Piso 1",      "Circular",   0.30, 0.30, "C30/37 XC1(P)", 7, 16, 0, 0, 8, 0.20),
    ("P8",  "Piso 0 -> Piso 1",      "Retangular", 0.30, 0.60, "C30/37 XC1(P)", 6, 16, 10, 12, 8, 0.20),
    ("P9",  "Fundacao -> Piso 0",    "Retangular", 1.30, 0.20, "C30/37 XC2(P)", 16, 16, 14, 10, 8, 0.20),
    ("P10", "Fundacao -> Piso 0",    "Retangular", 1.00, 0.20, "C30/37 XC2(P)", 24, 16, 0, 0, 8, 0.20),
    ("P11", "Fundacao -> Piso 0",    "Retangular", 0.80, 0.20, "C30/37 XC2(P)", 8, 16, 12, 12, 8, 0.20),
]

first_data_row = 6
cover_cell = "Parametros!$C$5"
lap_mult_cell = "Parametros!$C$7"
hook_mult_cell = "Parametros!$C$8"
hook_count_cell = "Parametros!$C$9"

r = first_data_row
for pilar, troco, forma, B, H, classe, q1, d1, q2, d2, dcinta, esp in DATA:
    ws.cell(row=r, column=1, value=pilar)
    ws.cell(row=r, column=2, value=troco)
    ws.cell(row=r, column=3, value=forma)
    ws.cell(row=r, column=4, value=B)
    if forma == "Circular":
        ws.cell(row=r, column=5, value=None)
    else:
        ws.cell(row=r, column=5, value=H)

    # F: area seccao
    ws.cell(row=r, column=6,
            value=f'=IF(C{r}="Circular",PI()*(D{r}/2)^2,D{r}*E{r})')
    # G: perimetro
    ws.cell(row=r, column=7,
            value=f'=IF(C{r}="Circular",PI()*D{r},2*(D{r}+E{r}))')
    # H: altura do troco -> INPUT (placeholder 0)
    ws.cell(row=r, column=8, value=0)
    # I: classe de betao
    ws.cell(row=r, column=9, value=classe)
    # J: volume de betao
    ws.cell(row=r, column=10,
            value=f'=F{r}*H{r}*(1+Parametros!$C$12)')

    # Grupo 1 (K..Q)
    ws.cell(row=r, column=11, value=q1)
    ws.cell(row=r, column=12, value=d1 if q1 else 0)
    ws.cell(row=r, column=13, value=f'=IF(K{r}=0,0,{lap_mult_cell}*L{r}/1000)')
    ws.cell(row=r, column=14, value=f'=H{r}+M{r}')
    ws.cell(row=r, column=15, value=f'=K{r}*N{r}')
    ws.cell(row=r, column=16, value=f'=0.00617*L{r}^2')
    ws.cell(row=r, column=17, value=f'=K{r}*N{r}*P{r}*(1+Parametros!$C$13)')

    # Grupo 2 (R..X)
    ws.cell(row=r, column=18, value=q2)
    ws.cell(row=r, column=19, value=d2 if q2 else 0)
    ws.cell(row=r, column=20, value=f'=IF(R{r}=0,0,{lap_mult_cell}*S{r}/1000)')
    ws.cell(row=r, column=21, value=f'=H{r}+T{r}')
    ws.cell(row=r, column=22, value=f'=R{r}*U{r}')
    ws.cell(row=r, column=23, value=f'=IF(S{r}=0,0,0.00617*S{r}^2)')
    ws.cell(row=r, column=24, value=f'=R{r}*U{r}*W{r}*(1+Parametros!$C$13)')

    # Cintas (Y..AC)
    ws.cell(row=r, column=25, value=dcinta)
    ws.cell(row=r, column=26, value=esp)
    ws.cell(row=r, column=27, value=f'=IF(H{r}=0,0,ROUNDUP(H{r}/Z{r},0)+1)')
    ws.cell(row=r, column=28,
            value=(f'=IF(C{r}="Circular",PI()*(D{r}-2*{cover_cell})'
                    f'+{hook_count_cell}*{hook_mult_cell}*Y{r}/1000,'
                    f'2*((D{r}-2*{cover_cell})+(E{r}-2*{cover_cell}))'
                    f'+{hook_count_cell}*{hook_mult_cell}*Y{r}/1000)'))
    ws.cell(row=r, column=29, value=f'=AA{r}*AB{r}*0.00617*Y{r}^2*(1+Parametros!$C$13)')

    # Totais (AD..AF)
    ws.cell(row=r, column=30, value=f'=Q{r}+X{r}')
    ws.cell(row=r, column=31, value=f'=AD{r}+AC{r}')
    ws.cell(row=r, column=32, value=f'=G{r}*H{r}')

    r += 1

last_data_row = r - 1

# ---- formatacao das celulas de dados ----
num_fmt_3 = "0.000"
num_fmt_2 = "0.00"
num_fmt_1 = "0.0"
num_fmt_0 = "0"

for rr in range(first_data_row, last_data_row+1):
    ws.cell(row=rr, column=1).font = bold_font
    ws.cell(row=rr, column=1).alignment = Alignment(horizontal="center", vertical="center")
    ws.cell(row=rr, column=2).font = normal_font
    ws.cell(row=rr, column=2).alignment = Alignment(horizontal="left", vertical="center", indent=1)
    for col in range(3, 33):
        cell = ws.cell(row=rr, column=col)
        cell.border = border
        cell.font = small_font
        cell.alignment = Alignment(horizontal="center", vertical="center")

    # cores por grupo
    for col in range(11, 18): ws.cell(row=rr, column=col).fill = group1_fill
    for col in range(18, 25): ws.cell(row=rr, column=col).fill = group2_fill
    for col in range(25, 30): ws.cell(row=rr, column=col).fill = stirrup_fill
    for col in range(30, 33): ws.cell(row=rr, column=col).fill = total_fill

    # input de altura em amarelo
    hcell = ws.cell(row=rr, column=8)
    hcell.fill = input_fill
    hcell.font = Font(name=FONT, size=9, bold=True)
    hcell.number_format = num_fmt_2

    # formatos numericos
    ws.cell(row=rr, column=4).number_format = num_fmt_2
    ws.cell(row=rr, column=5).number_format = num_fmt_2
    ws.cell(row=rr, column=6).number_format = num_fmt_3
    ws.cell(row=rr, column=7).number_format = num_fmt_2
    ws.cell(row=rr, column=10).number_format = num_fmt_3
    ws.cell(row=rr, column=13).number_format = num_fmt_2
    ws.cell(row=rr, column=14).number_format = num_fmt_2
    ws.cell(row=rr, column=15).number_format = num_fmt_1
    ws.cell(row=rr, column=16).number_format = num_fmt_3
    ws.cell(row=rr, column=17).number_format = num_fmt_1
    ws.cell(row=rr, column=20).number_format = num_fmt_2
    ws.cell(row=rr, column=21).number_format = num_fmt_2
    ws.cell(row=rr, column=22).number_format = num_fmt_1
    ws.cell(row=rr, column=23).number_format = num_fmt_3
    ws.cell(row=rr, column=24).number_format = num_fmt_1
    ws.cell(row=rr, column=28).number_format = num_fmt_2
    ws.cell(row=rr, column=29).number_format = num_fmt_1
    ws.cell(row=rr, column=30).number_format = num_fmt_1
    ws.cell(row=rr, column=31).number_format = num_fmt_1
    ws.cell(row=rr, column=32).number_format = num_fmt_2

# linha de totais
trow = last_data_row + 1
ws.cell(row=trow, column=2, value="TOTAL GERAL")
ws.cell(row=trow, column=2).font = Font(name=FONT, size=10, bold=True)
for col_letter, col_idx in [("J",10),("Q",17),("X",24),("AC",29),("AD",30),("AE",31),("AF",32)]:
    cell = ws.cell(row=trow, column=col_idx,
                    value=f'=SUM({col_letter}{first_data_row}:{col_letter}{last_data_row})')
    cell.font = Font(name=FONT, size=10, bold=True)
    cell.fill = PatternFill("solid", fgColor="BFBFBF")
    cell.border = Border(top=Side(style="double"), bottom=Side(style="double"))
    if col_idx == 10:
        cell.number_format = num_fmt_3
    elif col_idx in (17,24,29,30,31):
        cell.number_format = "0.0"
    else:
        cell.number_format = num_fmt_2
for col in range(1, 33):
    c = ws.cell(row=trow, column=col)
    c.border = Border(top=Side(style="double"), bottom=Side(style="double"))
    if c.fill is None or c.fill.fill_type is None:
        c.fill = PatternFill("solid", fgColor="E7E6E6")

# larguras de coluna
ws.column_dimensions["A"].width = 7
ws.column_dimensions["B"].width = 20
for col in ["C"]: ws.column_dimensions[col].width = 11
for col in ["D","E","F","G"]: ws.column_dimensions[col].width = 10
ws.column_dimensions["H"].width = 11
ws.column_dimensions["I"].width = 12
ws.column_dimensions["J"].width = 11
for col in ["K","L","R","S","Y"]: ws.column_dimensions[col].width = 7
for col in ["M","N","O","T","U","V","Z","AB"]: ws.column_dimensions[col].width = 10
for col in ["P","W"]: ws.column_dimensions[col].width = 9
for col in ["Q","X","AA","AC","AD","AE","AF"]: ws.column_dimensions[col].width = 10.5

# nota de rodape
noterow = trow + 2
ws.cell(row=noterow, column=1,
        value=("Notas: (1) Alturas dos trocos (coluna H, fundo amarelo) nao constam no desenho fonte - devem ser confirmadas no projeto de arquitetura/cortes e inseridas manualmente. "
               "(2) Comprimentos de varoes incluem transpasse de 50xØ (parametrizavel na folha 'Parametros'). "
               "(3) Cintas: comprimento = perimetro interior (desconta recobrimento de 3 cm) + 2 ganchos de 10xØ. "
               "(4) Cofragem considerada apenas nas faces laterais do pilar (perimetro x altura), sem topo/fundo. "
               "(5) Classe de betao conforme notas do desenho: elementos de fundacao C30/37 XC2(P); pilares em elevacao C30/37 XC1(P)."))
ws.merge_cells(f"A{noterow}:AF{noterow+3}")
ws.cell(row=noterow, column=1).alignment = Alignment(horizontal="left", vertical="top", wrap_text=True)
ws.cell(row=noterow, column=1).font = Font(name=FONT, size=8, italic=True)

wb.save("../planilhas/Quantitativos_Pilares.xlsx")
print("Sheet Mapa de Pilares OK - linhas", first_data_row, "a", last_data_row)

# ==================================================================
# SHEET 3 - RESUMO
# ==================================================================
wr = wb.create_sheet("Resumo")
wr.sheet_view.showGridLines = False

wr["B2"] = "RESUMO DE QUANTITATIVOS"
wr["B2"].font = Font(name=FONT, size=14, bold=True, color="FFFFFF")
wr.merge_cells("B2:H2")
wr["B2"].fill = navy_fill
wr["B2"].alignment = Alignment(horizontal="left", vertical="center", indent=1)
wr.row_dimensions[2].height = 26

MP = "'Mapa de Pilares'"

# --- Totais gerais ---
wr["B4"] = "TOTAIS GERAIS"
wr["B4"].font = bold_font
wr.merge_cells("B4:D4")
wr["B4"].fill = sub_fill

totals = [
    ("Volume total de betao (m3)", f"=SUM({MP}!J{first_data_row}:J{last_data_row})", "0.000"),
    ("Area total de cofragem (m2)", f"=SUM({MP}!AF{first_data_row}:AF{last_data_row})", "0.00"),
    ("Peso total de aco longitudinal (kg)", f"=SUM({MP}!AD{first_data_row}:AD{last_data_row})", "0.0"),
    ("Peso total de aco em cintas (kg)", f"=SUM({MP}!AC{first_data_row}:AC{last_data_row})", "0.0"),
    ("Peso total de aco (kg)", f"=SUM({MP}!AE{first_data_row}:AE{last_data_row})", "0.0"),
    ("Peso total de aco (toneladas)", f"=SUM({MP}!AE{first_data_row}:AE{last_data_row})/1000", "0.000"),
]
rr = 5
for label, formula, fmt in totals:
    wr.cell(row=rr, column=2, value=label).font = normal_font
    wr.cell(row=rr, column=2).alignment = Alignment(horizontal="left")
    c = wr.cell(row=rr, column=4, value=formula)
    c.font = bold_font
    c.number_format = fmt
    c.fill = input_fill if False else PatternFill("solid", fgColor="FFFFFF")
    c.border = border
    wr.cell(row=rr, column=2).border = border
    wr.cell(row=rr, column=3).border = border
    rr += 1

# --- Aco por diametro (para compra) ---
start_diam = rr + 2
wr.cell(row=start_diam-1, column=2, value="ACO POR DIAMETRO (para compra / cabimentacao)").font = bold_font
wr.merge_cells(f"B{start_diam-1}:E{start_diam-1}")
wr.cell(row=start_diam-1, column=2).fill = sub_fill

wr.cell(row=start_diam, column=2, value="Diametro (mm)")
wr.cell(row=start_diam, column=3, value="Peso longitudinal (kg)")
wr.cell(row=start_diam, column=4, value="Peso em cintas (kg)")
wr.cell(row=start_diam, column=5, value="Peso total (kg)")
for col in range(2,6):
    style_header(wr.cell(row=start_diam, column=col), navy_fill)

diametros = [8, 10, 12, 16, 20, 25]
d_row = start_diam + 1
for d in diametros:
    wr.cell(row=d_row, column=2, value=d)
    f_long = (f'=SUMIF({MP}!$L${first_data_row}:$L${last_data_row},B{d_row},{MP}!$Q${first_data_row}:$Q${last_data_row})'
              f'+SUMIF({MP}!$S${first_data_row}:$S${last_data_row},B{d_row},{MP}!$X${first_data_row}:$X${last_data_row})')
    f_cint = f'=SUMIF({MP}!$Y${first_data_row}:$Y${last_data_row},B{d_row},{MP}!$AC${first_data_row}:$AC${last_data_row})'
    wr.cell(row=d_row, column=3, value=f_long)
    wr.cell(row=d_row, column=4, value=f_cint)
    wr.cell(row=d_row, column=5, value=f'=C{d_row}+D{d_row}')
    for col in range(2,6):
        c = wr.cell(row=d_row, column=col)
        c.border = border
        c.alignment = Alignment(horizontal="center")
        c.font = small_font
        if col in (3,4,5):
            c.number_format = "0.0"
    d_row += 1

# total diametros
wr.cell(row=d_row, column=2, value="TOTAL").font = bold_font
for col_letter, col_idx in [("C",3),("D",4),("E",5)]:
    c = wr.cell(row=d_row, column=col_idx, value=f'=SUM({col_letter}{start_diam+1}:{col_letter}{d_row-1})')
    c.font = bold_font
    c.number_format = "0.0"
    c.border = Border(top=Side(style="double"))
    c.fill = PatternFill("solid", fgColor="D9D9D9")
wr.cell(row=d_row, column=2).fill = PatternFill("solid", fgColor="D9D9D9")
wr.cell(row=d_row, column=2).border = Border(top=Side(style="double"))

# --- Quantitativo por pilar (agregando trocos, ex. P6 e P7) ---
start_pil = d_row + 3
wr.cell(row=start_pil-1, column=2, value="QUANTITATIVO POR PILAR (soma dos trocos)").font = bold_font
wr.merge_cells(f"B{start_pil-1}:F{start_pil-1}")
wr.cell(row=start_pil-1, column=2).fill = sub_fill

wr.cell(row=start_pil, column=2, value="Pilar")
wr.cell(row=start_pil, column=3, value="Volume betao (m3)")
wr.cell(row=start_pil, column=4, value="Area cofragem (m2)")
wr.cell(row=start_pil, column=5, value="Peso aco (kg)")
for col in range(2,6):
    style_header(wr.cell(row=start_pil, column=col), navy_fill)

pilares_unicos = []
for d in DATA:
    if d[0] not in pilares_unicos:
        pilares_unicos.append(d[0])

p_row = start_pil + 1
for p in pilares_unicos:
    wr.cell(row=p_row, column=2, value=p).font = bold_font
    wr.cell(row=p_row, column=3, value=f'=SUMIF({MP}!$A${first_data_row}:$A${last_data_row},B{p_row},{MP}!$J${first_data_row}:$J${last_data_row})')
    wr.cell(row=p_row, column=4, value=f'=SUMIF({MP}!$A${first_data_row}:$A${last_data_row},B{p_row},{MP}!$AF${first_data_row}:$AF${last_data_row})')
    wr.cell(row=p_row, column=5, value=f'=SUMIF({MP}!$A${first_data_row}:$A${last_data_row},B{p_row},{MP}!$AE${first_data_row}:$AE${last_data_row})')
    for col in range(2,6):
        c = wr.cell(row=p_row, column=col)
        c.border = border
        c.alignment = Alignment(horizontal="center")
        c.font = small_font
        if col in (3,):
            c.number_format = "0.000"
        elif col in (4,5):
            c.number_format = "0.00" if col==4 else "0.0"
    p_row += 1

wr.cell(row=p_row, column=2, value="TOTAL").font = bold_font
for col_letter, col_idx in [("C",3),("D",4),("E",5)]:
    c = wr.cell(row=p_row, column=col_idx, value=f'=SUM({col_letter}{start_pil+1}:{col_letter}{p_row-1})')
    c.font = bold_font
    c.number_format = "0.000" if col_idx==3 else "0.0"
    c.border = Border(top=Side(style="double"))
    c.fill = PatternFill("solid", fgColor="D9D9D9")
wr.cell(row=p_row, column=2).fill = PatternFill("solid", fgColor="D9D9D9")
wr.cell(row=p_row, column=2).border = Border(top=Side(style="double"))

wr.column_dimensions["A"].width = 3
wr.column_dimensions["B"].width = 32
for col in ["C","D","E","F"]:
    wr.column_dimensions[col].width = 20

# ordem das folhas: Resumo primeiro, depois o detalhe, Parametros por ultimo
wb._sheets = [wb["Resumo"], wb["Mapa de Pilares"], wb["Parametros"]]
wb.active = 0

wb.save("../planilhas/Quantitativos_Pilares.xlsx")
print("Sheet Resumo OK")
