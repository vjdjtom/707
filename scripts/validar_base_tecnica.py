from __future__ import annotations

import csv
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / "base_tecnica"


def ler_csv(nome: str) -> list[dict[str, str]]:
    caminho = BASE / nome
    with caminho.open("r", encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f, delimiter=";"))


def exigir_unicos(linhas: list[dict[str, str]], campo: str, nome: str, erros: list[str]) -> None:
    vistos: set[str] = set()
    for i, linha in enumerate(linhas, start=2):
        valor = (linha.get(campo) or "").strip()
        if not valor:
            erros.append(f"{nome}:{i}: campo obrigatório vazio: {campo}")
        elif valor in vistos:
            erros.append(f"{nome}:{i}: {campo} duplicado: {valor}")
        vistos.add(valor)


def decimal_pt(valor: str) -> float | None:
    valor = (valor or "").strip()
    if not valor:
        return None
    return float(valor.replace(".", "").replace(",", "."))


def main() -> int:
    erros: list[str] = []

    tipos = ler_csv("tipos_pilares.csv")
    armaduras = ler_csv("armaduras_tipos.csv")
    elementos = ler_csv("elementos.csv")
    execucao = ler_csv("execucao.csv")
    artigos = ler_csv("artigos_contrato.csv")

    exigir_unicos(tipos, "tipo_id", "tipos_pilares.csv", erros)
    exigir_unicos(armaduras, "armadura_id", "armaduras_tipos.csv", erros)
    exigir_unicos(elementos, "elemento_id", "elementos.csv", erros)
    exigir_unicos(execucao, "execucao_id", "execucao.csv", erros)
    exigir_unicos(artigos, "artigo_id", "artigos_contrato.csv", erros)

    tipos_ids = {x["tipo_id"].strip() for x in tipos if x.get("tipo_id")}
    elementos_ids = {x["elemento_id"].strip() for x in elementos if x.get("elemento_id")}

    for i, a in enumerate(armaduras, start=2):
        tipo_id = (a.get("tipo_id") or "").strip()
        if tipo_id not in tipos_ids:
            erros.append(f"armaduras_tipos.csv:{i}: tipo_id inexistente: {tipo_id}")
        for campo in ("quantidade", "diametro_mm", "comprimento_base_m", "peso_linear_grupo_kg_por_m"):
            try:
                valor = decimal_pt(a.get(campo, ""))
                if valor is None or valor < 0:
                    raise ValueError
            except ValueError:
                erros.append(f"armaduras_tipos.csv:{i}: valor inválido em {campo}: {a.get(campo, '')}")

    for i, e in enumerate(elementos, start=2):
        tipo_id = (e.get("tipo_id") or "").strip()
        if tipo_id and tipo_id not in tipos_ids:
            erros.append(f"elementos.csv:{i}: tipo_id inexistente: {tipo_id}")

    formas = {"PERCENTAGEM", "QUANTIDADE", "COMPRIMENTO", "UNIDADES"}
    materiais = {"ACO", "BETÃO", "BETON", "COFRAGEM"}
    for i, x in enumerate(execucao, start=2):
        elemento_id = (x.get("elemento_id") or "").strip()
        if elemento_id not in elementos_ids:
            erros.append(f"execucao.csv:{i}: elemento_id inexistente: {elemento_id}")
        modo = (x.get("medicao_tipo") or "").strip().upper()
        if modo not in formas:
            erros.append(f"execucao.csv:{i}: medicao_tipo inválido: {modo}")
        material = (x.get("material") or "").strip().upper()
        if material and material not in materiais:
            erros.append(f"execucao.csv:{i}: material não padronizado: {material}")
        try:
            q = decimal_pt(x.get("quantidade_executada", ""))
            if q is not None and q < 0:
                raise ValueError
        except ValueError:
            erros.append(f"execucao.csv:{i}: quantidade_executada inválida")
        try:
            p = decimal_pt(x.get("percentagem", ""))
            if p is not None and not 0 <= p <= 100:
                erros.append(f"execucao.csv:{i}: percentagem fora de 0–100: {p}")
        except ValueError:
            erros.append(f"execucao.csv:{i}: percentagem inválida")

    if erros:
        print("BASE TÉCNICA INVÁLIDA")
        for erro in erros:
            print(f"- {erro}")
        return 1

    print("BASE TÉCNICA VÁLIDA")
    print(f"Tipos de pilares: {len(tipos)}")
    print(f"Grupos de armaduras: {len(armaduras)}")
    print(f"Elementos reais: {len(elementos)}")
    print(f"Registos de execução: {len(execucao)}")
    print(f"Artigos contratuais: {len(artigos)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
