"""Gera ampliações de conferência a partir do PDF original e das caixas cadastradas.

Requer PyMuPDF. Não mede geometria da obra nem altera a fonte.
"""
import argparse
import csv
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def main():
    import pymupdf
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--saida', type=Path, required=True)
    parser.add_argument('--evidencia', help='ID específico; omitido renderiza todas')
    args = parser.parse_args()
    base = ROOT/'base_tecnica/estabilidade_20260928'
    manifest = json.loads((base/'manifesto.json').read_text(encoding='utf-8'))
    source = ROOT/manifest['fonte']['arquivo']
    if hashlib.sha256(source.read_bytes()).hexdigest() != manifest['fonte']['sha256']:
        raise SystemExit('Fonte divergente: renderização cancelada')
    with (base/'evidencias.csv').open(encoding='utf-8', newline='') as stream:
        rows = list(csv.DictReader(stream,delimiter=';'))
    rows = [row for row in rows if not args.evidencia or row['evidencia_id'] == args.evidencia]
    if not rows:
        raise SystemExit('Evidência não encontrada')
    targets = [args.saida/(row['evidencia_id']+'.png') for row in rows]
    if any(path.exists() for path in targets):
        raise SystemExit('Saída já existe; escolha outra pasta para preservar a conferência anterior')
    args.saida.mkdir(parents=True,exist_ok=True)
    with pymupdf.open(source) as pdf:
        if len(pdf) != manifest['fonte']['paginas']:
            raise SystemExit('Número de páginas divergente')
        for row,path in zip(rows,targets):
            page=pdf[int(row['pagina_pdf'])-1]
            rect=pymupdf.Rect(*(float(row[k]) for k in ('x0','y0','x1','y1')))
            page.get_pixmap(matrix=pymupdf.Matrix(6,6),clip=rect).save(path)
    print(f'{len(rows)} evidências renderizadas em {args.saida}')


if __name__ == '__main__':
    main()
