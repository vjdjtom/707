# -*- coding: utf-8 -*-
"""
Adiciona as abas AUTO_MARINEL e AUTO_SECULUM_IMPERDIVEL ao Barba_Atualizada.xlsx,
SEM tocar em nenhuma aba existente (MAPA_OBRA_707, AUTO_GERAL_MEDICAO,
SUB_COFRAGEM, SUB_ARMADURAS, SUB_BETAO, SUB_ESPECIAIS, PILARES, etc.)
"""
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side

SRC = "../planilhas/Barba_Atualizada.xlsx"
OUT = "../planilhas/Barba_Atualizada.xlsx"

# Dados do mapa de quantidades (identico ao que ja esta em MAPA_OBRA_707, linhas 2-72)
lines_image = [
    ("4.1", "Betão de Limpeza / Cleaning concrete", "", "", True),
    ("4.1.1", "Fornecimento e aplicação de betão de limpeza do tipo C16/20 X0 numa espessura de 0,10 m.", "m3", 172.56, False),
    ("4.2", "Fundações / Foundations", "", "", True),
    ("4.2.1", "Fornecimento e colocação de betão armado C30/37 XC2 0,40 Dmáx 22 S3 , em sapatas de muros e paredes, incluindo o fornecimento, aplicação e desmontagem de cofragem e o fornecimento, moldagem e aplicação de aço A500NR. Todos os trabalhos deverão ser executados de acordo com as peças desenhadas:", "", "", True),
    ("4.2.1.1", "Sapatas Isoladas / Isolated Foundations (90 kg/m3)", "", "", True),
    ("", "Betão - Aplicação e Vibração", "m3", 163.87, False),
    ("", "Cofragem - Fornecimento e aplicação", "m2", 409.68, False),
    ("", "Aço - Moldagem, Corte e Aplicação", "kg", 16960.55, False),
    ("4.2.1.2", "Sapatas Contínuas / Continuous Foundations (110 kg/m3)", "", "", True),
    ("", "Betão - Aplicação e Vibração", "m3", 155.53, False),
    ("", "Cofragem - Fornecimento e aplicação", "m2", 388.83, False),
    ("", "Aço - Moldagem, Corte e Aplicação", "kg", 19674.67, False),
    ("4.2.1.3", "Vigas de Fundação / Beams of Foundations (115 kg/m3)", "", "", True),
    ("", "Betão - Aplicação e Vibração", "m3", 61.44, False),
    ("", "Cofragem - Fornecimento e aplicação", "m2", 688.74, False),
    ("", "Aço - Moldagem, Corte e Aplicação", "kg", 8125.44, False),
    ("4.3", "Superestrutura / Superstructure", "", "", True),
    ("4.3.1", "Fornecimento e colocação de betão armado C30/37 XC1 Cl 0,20 Dmáx 20 S3 , em Muros, pilares, paredes, vigas e lajes, incluindo o fornecimento, aplicação e desmontagem de cofragem e o fornecimento, moldagem e aplicação de aço A500NR com a referida taxa de armaduras. Todos os trabalhos deverão ser executados de acordo com as peças desenhadas:", "", "", True),
    ("4.3.1.1", "Muros Enterrados / Buried Walls (115 kg/m3)", "", "", True),
    ("", "Betão - Aplicação e Vibração", "m3", 357.21, False),
    ("", "Cofragem - Fornecimento e aplicação", "m2", 3597.09, False),
    ("", "Aço - Moldagem, Corte e Aplicação", "kg", 53583.49, False),
    ("4.3.1.2", "Pilares / Columns (290 kg/m3)", "", "", True),
    ("", "Betão - Aplicação e Vibração", "m3", 175.75, False),
    ("", "Cofragem - Fornecimento e aplicação", "m2", 1933.25, False),
    ("", "Aço - Moldagem, Corte e Aplicação", "kg", 58612.63, False),
    ("4.3.1.3", "Paredes / Walls (200 kg/m3)", "", "", True),
    ("", "Betão - Aplicação e Vibração", "m3", 55.41, False),
    ("", "Cofragem - Fornecimento e aplicação", "m2", 554.10, False),
    ("", "Aço - Moldagem, Corte e Aplicação", "kg", 12744.30, False),
    ("4.3.1.3 A", "Núcleos do Elevador / Elevator Shaft (200 kg/m3)", "", "", True),
    ("", "Betão - Aplicação e Vibração", "m3", 168.52, False),
    ("", "Cofragem - Fornecimento e aplicação", "m2", 1862.19, False),
    ("", "Aço - Moldagem, Corte e Aplicação", "kg", 38760.52, False),
    ("4.3.1.4", "Vigas / Beams (150 kg/m3)", "", "", True),
    ("", "Betão - Aplicação e Vibração", "m3", 384.70, False),
    ("", "Cofragem - Fornecimento e aplicação", "m2", 3847.00, False),
    ("", "Aço - Moldagem, Corte e Aplicação", "kg", 66360.75, False),
    ("4.3.1.5", "Lajes Maciças / Massive Slabs (120 kg/m3)", "", "", True),
    ("", "Betão - Aplicação e Vibração", "m3", 145.35, False),
    ("", "Cofragem - Fornecimento e aplicação", "m2", 726.75, False),
    ("", "Aço - Moldagem, Corte e Aplicação", "kg", 20058.30, False),
    ("4.3.1.6", "Escadas / Stairs (80 kg/m3)", "", "", True),
    ("", "Betão - Aplicação e Vibração", "m3", 60.00, False),
    ("", "Cofragem - Fornecimento e aplicação", "m2", 600.00, False),
    ("", "Aço - Moldagem, Corte e Aplicação", "kg", 5520.00, False),
    ("4.3.1.7", "Fornecimento e aplicação de lajes aligeiradas fabricadas com sistema Cobiax CBX S-120 da Ferca ou similar, composto por material reciclado tipo Cobiax Slim-Line módulos de iluminação em polipropileno com altura de 0,23m, preenchido com betão classe C30/37, fôrma , reforço de haste de aço A500NR (125 kg/m3)", "", "", True),
    ("", "Betão - Aplicação e Vibração", "m3", 685.93, False),
    ("", "Cofragem - Fornecimento e aplicação", "m2", 5900.33, False),
    ("", "Aço - Moldagem, Corte e Aplicação", "kg", 162796.88, False),
    ("", "Aplicação Moldes CBX", "m2", 2723.06, False),
    ("4.3.2", "Fornecimento e colocação de betão armado C30/37 XD2 Cl 0,20 Dmáx 20 S3 , em lajes e paredes da piscina, incluindo o fornecimento, aplicação e desmontagem de cofragem e o fornecimento, moldagem e aplicação de aço A500NR. Todos os trabalhos deverão ser executados de acordo com as peças desenhadas:", "", "", True),
    ("4.3.1", "Laje de Fundo de Piscina do Piso 0 / Pool Bottom Slab of Leve 0", "", "", True),
    ("", "Betão - Aplicação e Vibração", "m3", 187.85, False),
    ("", "Cofragem - Fornecimento e aplicação", "m2", 469.62, False),
    ("", "Aço - Moldagem, Corte e Aplicação", "kg", 23762.77, False),
    ("4.3.2", "Parede de Piscina do Piso 0 / Pool Walls at Level 0", "", "", True),
    ("", "Betão - Aplicação e Vibração", "m3", 215.23, False),
    ("", "Cofragem - Fornecimento e aplicação", "m2", 2152.30, False),
    ("", "Aço - Moldagem, Corte e Aplicação", "kg", 35956.43, False),
    ("4.3.3", "Paredes da Piscina da Cobertura", "", "", True),
    ("", "Betão - Aplicação e Vibração", "m3", 29.76, False),
    ("", "Cofragem - Fornecimento e aplicação", "m2", 267.84, False),
    ("", "Aço - Moldagem, Corte e Aplicação", "kg", 4791.36, False),
    ("4.4", "Pavimento Térreos / Ground Floors", "", "", True),
    ("4.4.1", "Piso da Cave / Basement Level", "", "", True),
    ("4.4.1.1", "Execução de piso térreo interior, composto por elementos em polipropileno tipo 'Ferca Cupolex ref. H20' ou equivalente, com dimensão de 580x580x200, com 0,05cm de lâmina de compressão em concreto classe C20/25, armado com A500 aço NR, incluindo acabamento jateado com o incorporação de um endurecedor de superfície de cor natural no betão", "", "", True),
    ("4.1.1.1", "Betão de Limpeza / Cleaning concrete", "m3", 108.75, False),
    ("4.1.1.2", "Cupolex 20", "m2", 2175.00, False),
    ("4.1.1.3", "Lâmina de compressão em betão C20/25 XC2 C0,40 D22 S3", "m3", 108.75, False),
    ("4.1.1.4", "Malhasol A500 AQ50", "m2", 2175.00, False),
]

wb = openpyxl.load_workbook(SRC, data_only=False)

print("Abas ANTES:", wb.sheetnames)
assert "MAPA_OBRA_707" in wb.sheetnames, "MAPA_OBRA_707 nao encontrada - abortando por seguranca."

# validar que MAPA_OBRA_707 bate linha a linha com lines_image antes de criar as ligacoes
ws_check = wb["MAPA_OBRA_707"]
mismatches = []
for i, item in enumerate(lines_image, start=2):
    art, desig, un, quant, is_h = item
    b_real = ws_check.cell(i, 2).value
    if b_real != desig:
        mismatches.append((i, desig, b_real))
if mismatches:
    print("AVISO - divergencias encontradas entre lines_image e MAPA_OBRA_707:")
    for m in mismatches:
        print(m)
else:
    print(f"Validado: lines_image bate 100 por cento com MAPA_OBRA_707 (linhas 2 a {len(lines_image)+1}).")

# remover apenas as duas abas alvo, se ja existirem (para permitir reexecucao idempotente)
for s in ["AUTO_MARINEL", "AUTO_SECULUM_IMPERDIVEL"]:
    if s in wb.sheetnames:
        wb.remove(wb[s])
        print(f"Aba '{s}' ja existia e foi recriada.")

yellow_head = PatternFill(start_color="FFC000", end_color="FFC000", fill_type="solid")

def create_sub_auto(sheet_title, sub_name):
    ws = wb.create_sheet(title=sheet_title)
    ws.sheet_view.showGridLines = True

    dark_blue = PatternFill(start_color="1F4E78", end_color="1F4E78", fill_type="solid")
    yellow_fill = PatternFill(start_color="FFC000", end_color="FFC000", fill_type="solid")
    sub_blue = PatternFill(start_color="D9E1F2", end_color="D9E1F2", fill_type="solid")
    light_yellow = PatternFill(start_color="FFF2CC", end_color="FFF2CC", fill_type="solid")
    tot_fill = PatternFill(start_color="DDEBF7", end_color="DDEBF7", fill_type="solid")

    ws.merge_cells("A1:K1")
    ws["A1"] = f"AUTO DE MEDIÇÃO MENSAL — {sub_name.upper()} — 707_VILA_MODERNA"
    ws["A1"].font = Font(name="Calibri", size=13, bold=True, color="FFFFFF")
    ws["A1"].fill = dark_blue
    ws["A1"].alignment = Alignment(horizontal="center", vertical="center")
    ws.row_dimensions[1].height = 28

    ws["A2"] = "OBRA:"; ws["A2"].font = Font(name="Calibri", size=10, bold=True)
    ws["B2"] = "707_Vila_Moderna"
    ws["D2"] = "SUBEMPREITEIRO:"; ws["D2"].font = Font(name="Calibri", size=10, bold=True)
    ws["E2"] = sub_name
    ws["H2"] = "AUTO N.º:"; ws["H2"].font = Font(name="Calibri", size=10, bold=True)
    ws["I2"] = "01"

    ws["A3"] = "DONO DE OBRA:"; ws["A3"].font = Font(name="Calibri", size=10, bold=True)
    ws["B3"] = "NORASIL S.A."
    ws["D3"] = "PERÍODO / MÊS:"
    ws["D3"].font = Font(name="Calibri", size=10, bold=True)
    ws["E3"] = "Setembro / 2026"
    ws["H3"] = "DATA:"; ws["H3"].font = Font(name="Calibri", size=10, bold=True)
    ws["I3"] = "30/09/2026"

    headers = [
        ("A5", "Artº"), ("B5", "Designação de Trabalhos"), ("C5", "Un."),
        ("D5", "Quant. Contrato"), ("E5", "Qtd. Anterior"), ("F5", "Qtd. no Mês"),
        ("G5", "Qtd. Acumulada"), ("H5", "% Execução"), ("I5", "Saldo a Executar"),
        ("J5", "P.U. (€)"), ("K5", "Valor no Mês (€)")
    ]
    ws.row_dimensions[5].height = 25
    for c_id, text in headers:
        ws[c_id] = text
        ws[c_id].fill = yellow_fill if c_id in ["A5", "B5", "C5", "D5"] else sub_blue
        ws[c_id].font = Font(name="Calibri", size=10, bold=True)
        ws[c_id].alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        ws[c_id].border = Border(left=Side(style='thin', color='000000'), right=Side(style='thin', color='000000'), top=Side(style='thin', color='000000'), bottom=Side(style='thin', color='000000'))

    r_i = 6
    for map_i, item in enumerate(lines_image, start=2):
        art, desig, un, quant, is_h = item
        ws.row_dimensions[r_i].height = 20 if len(desig) < 60 else (36 if len(desig) < 120 else 50)

        ws[f"A{r_i}"] = f"=MAPA_OBRA_707!A{map_i}"
        ws[f"B{r_i}"] = f"=MAPA_OBRA_707!B{map_i}"
        ws[f"C{r_i}"] = f"=MAPA_OBRA_707!C{map_i}"

        ws[f"A{r_i}"].alignment = Alignment(horizontal="center", vertical="center")
        ws[f"B{r_i}"].alignment = Alignment(horizontal="right" if not is_h and un != "" else "left", vertical="center", wrap_text=True)
        ws[f"C{r_i}"].alignment = Alignment(horizontal="center", vertical="center")

        if not is_h and un != "":
            ws[f"D{r_i}"] = f"=MAPA_OBRA_707!D{map_i}"
            ws[f"D{r_i}"].number_format = '#,##0.00'
            ws[f"D{r_i}"].alignment = Alignment(horizontal="right", vertical="center")

            ws[f"E{r_i}"] = 0.00
            ws[f"E{r_i}"].number_format = '#,##0.00'
            ws[f"E{r_i}"].alignment = Alignment(horizontal="right", vertical="center")

            ws[f"F{r_i}"] = 0.00
            ws[f"F{r_i}"].fill = light_yellow
            ws[f"F{r_i}"].number_format = '#,##0.00'
            ws[f"F{r_i}"].alignment = Alignment(horizontal="right", vertical="center")

            ws[f"G{r_i}"] = f"=E{r_i}+F{r_i}"
            ws[f"G{r_i}"].number_format = '#,##0.00'
            ws[f"G{r_i}"].alignment = Alignment(horizontal="right", vertical="center")

            ws[f"H{r_i}"] = f"=IF(D{r_i}>0, G{r_i}/D{r_i}, 0)"
            ws[f"H{r_i}"].number_format = '0.00%'
            ws[f"H{r_i}"].alignment = Alignment(horizontal="right", vertical="center")

            ws[f"I{r_i}"] = f"=D{r_i}-G{r_i}"
            ws[f"I{r_i}"].number_format = '#,##0.00'
            ws[f"I{r_i}"].alignment = Alignment(horizontal="right", vertical="center")

            ws[f"J{r_i}"] = 0.00
            ws[f"J{r_i}"].number_format = '#,##0.00 €'
            ws[f"J{r_i}"].alignment = Alignment(horizontal="right", vertical="center")

            ws[f"K{r_i}"] = f"=F{r_i}*J{r_i}"
            ws[f"K{r_i}"].number_format = '#,##0.00 €'
            ws[f"K{r_i}"].alignment = Alignment(horizontal="right", vertical="center")
        else:
            for col_l in ["D", "E", "F", "G", "H", "I", "J", "K"]:
                ws[f"{col_l}{r_i}"] = ""

        for col_l in ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"]:
            c = ws[f"{col_l}{r_i}"]
            c.font = Font(name="Calibri", size=10, bold=is_h)
            c.border = Border(left=Side(style='thin', color='D9D9D9'), right=Side(style='thin', color='D9D9D9'), top=Side(style='thin', color='D9D9D9'), bottom=Side(style='thin', color='D9D9D9'))
            if is_h:
                c.fill = PatternFill(start_color="F2F2F2", end_color="F2F2F2", fill_type="solid")
        r_i += 1

    ws[f"A{r_i}"] = "TOTAL GERAL A FATURAR:"
    ws.merge_cells(f"A{r_i}:C{r_i}")
    ws[f"A{r_i}"].font = Font(name="Calibri", size=10, bold=True)
    ws[f"A{r_i}"].alignment = Alignment(horizontal="right", vertical="center")

    ws[f"K{r_i}"] = f"=SUM(K6:K{r_i-1})"
    ws[f"K{r_i}"].number_format = '#,##0.00 €'
    ws[f"K{r_i}"].font = Font(name="Calibri", size=10, bold=True)
    ws[f"K{r_i}"].alignment = Alignment(horizontal="right", vertical="center")

    for col_l in ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"]:
        cell = ws[f"{col_l}{r_i}"]
        cell.fill = tot_fill
        cell.border = Border(top=Side(style='thin', color='000000'), bottom=Side(style='double', color='000000'), left=Side(style='thin', color='D9D9D9'), right=Side(style='thin', color='D9D9D9'))

    col_w = {'A': 12, 'B': 58, 'C': 8, 'D': 16, 'E': 14, 'F': 14, 'G': 15, 'H': 12, 'I': 15, 'J': 13, 'K': 16}
    for l, w in col_w.items():
        ws.column_dimensions[l].width = w

create_sub_auto("AUTO_MARINEL", "MARINEL")
create_sub_auto("AUTO_SECULUM_IMPERDIVEL", "Seculum Imperdivel")

print("Abas DEPOIS:", wb.sheetnames)

wb.save(OUT)
print("Guardado em", OUT)
