"""Valida o lote documental sem converter PENDENTE em zero nem gerar autos."""
from __future__ import annotations

import argparse
import csv
import hashlib
import json
import re
from decimal import Decimal, InvalidOperation
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LOTE = Path('base_tecnica/estabilidade_20260928')
STATES = {'CONFIRMADO', 'PENDENTE'}
SENTINELS = {'PENDENTE', 'NAO_APLICAVEL'}


def validate(root: Path) -> list[str]:
    errors: list[str] = []
    base = root / LOTE
    manifest = json.loads((base / 'manifesto.json').read_text(encoding='utf-8'))
    source = manifest['fonte']
    pdf = root / source['arquivo']
    if not pdf.is_file():
        errors.append('PDF fonte ausente')
    elif pdf.stat().st_size != source['bytes'] or hashlib.sha256(pdf.read_bytes()).hexdigest() != source['sha256']:
        errors.append('PDF fonte não corresponde ao hash/tamanho registrado')

    tables: dict[str, list[dict[str, str]]] = {}
    for name, spec in manifest['tabelas'].items():
        with (base / (name + '.csv')).open(encoding='utf-8', newline='') as stream:
            reader = csv.DictReader(stream, delimiter=';')
            if reader.fieldnames != spec['colunas']:
                errors.append(f'{name}: cabeçalho divergente')
            rows = list(reader)
        tables[name] = rows
        if len(rows) != spec['linhas']:
            errors.append(f'{name}: número de registros divergente')
        ids: set[str] = set()
        for line, row in enumerate(rows, 2):
            prefix = f'{name}:{line}'
            key = row.get(spec['colunas'][0])
            if not key or key in ids:
                errors.append(f'{prefix}: ID vazio/duplicado')
            ids.add(key)
            if None in row or any(value in ('', None) for value in row.values()):
                errors.append(f'{prefix}: célula vazia ou número de colunas inválido')
            for field, value in row.items():
                if not isinstance(field, str) or not isinstance(value, str):
                    continue
                if field.startswith('estado') and value not in STATES:
                    errors.append(f'{prefix}: estado inválido {field}={value}')
                numeric = bool(re.search(r'_(mm|m|m3|mpa|kg_m)$', field)) or field in {
                    'pagina_pdf', 'x0', 'y0', 'x1', 'y1', 'ab_quantidade',
                    'numero_chapas_indicado', 'chumbadouros_quantidade_indicada', 'numero_ocorrencias',
                }
                if numeric and value not in SENTINELS:
                    try:
                        if not re.fullmatch(r'-?\d+(,\d+)?', value):
                            raise InvalidOperation
                        number = Decimal(value.replace(',', '.'))
                        if number < 0 and field != 'cota_fundacao_m':
                            raise InvalidOperation
                    except InvalidOperation:
                        errors.append(f'{prefix}: valor numérico inválido {field}={value}')

    evidence = {row['evidencia_id']: row for row in tables['evidencias']}
    drawings = {row['desenho']: row for row in tables['desenhos']}
    if set(drawings) != {'01', '02', '03', '04', '05', '06'}:
        errors.append('Cobertura dos desenhos 01-06 incompleta')
    for number, drawing in drawings.items():
        if drawing['fonte_id'] != source['fonte_id'] or drawing['pagina_pdf'] != str(int(number) + 3):
            errors.append(f'D{number}: fonte/página incoerente')
    for key, row in evidence.items():
        drawing = drawings.get(row['desenho'])
        if not drawing or row['fonte_id'] != source['fonte_id'] or row['pagina_pdf'] != drawing['pagina_pdf'] or row['revisao'] != drawing['revisao']:
            errors.append(f'{key}: fonte/desenho/página/revisão incoerente')
        try:
            x0,y0,x1,y1 = [float(row[k]) for k in ('x0','y0','x1','y1')]
            if not (0 <= x0 < x1 <= 800 and 0 <= y0 < y1 <= 600):
                raise ValueError
        except ValueError:
            errors.append(f'{key}: caixa de evidência inválida')
    for name, rows in tables.items():
        if name in {'evidencias', 'desenhos'}:
            continue
        for row in rows:
            if row['evidencia_id'] not in evidence:
                errors.append(f'{name}: evidência inexistente {row["evidencia_id"]}')

    footing_types = {row['tipo_id'] for row in tables['tipos_sapatas']}
    for row in tables['ocorrencias_fundacoes']:
        if row['tipo_id'] not in footing_types | {'PENDENTE'}:
            errors.append(f'{row["ocorrencia_id"]}: tipo de sapata inexistente')
        if row['tipo_id'] == 'PENDENTE' and row['estado_identificacao'] != 'PENDENTE':
            errors.append(f'{row["ocorrencia_id"]}: identificação indevidamente confirmada')
        if row['elemento_id'] != 'PENDENTE' or row['estado_cadastro_fisico'] != 'PENDENTE':
            errors.append(f'{row["ocorrencia_id"]}: observação não pode ser promovida silenciosamente a elemento')
    details = {row['pormenor_id']: row for row in tables['pormenores_metalicos']}
    for row in tables['trocos_tipos_metalicos']:
        for field in ('pormenor_inferior', 'pormenor_superior'):
            if row[field] not in details:
                errors.append(f'{row["troco_tipo_id"]}: ligação inexistente {row[field]}')
    with (root/'base_tecnica/tipos_pilares.csv').open(encoding='utf-8', newline='') as stream:
        legacy = {row['tipo_id']: row for row in csv.DictReader(stream, delimiter=';')}
    for row in tables['trocos_tipos_pilares']:
        prior = legacy.get(row['tipo_id_legado'])
        if prior is None:
            errors.append(f'{row["troco_tipo_id"]}: tipo legado inexistente')
        elif any(row[k] != (prior[k] or 'NAO_APLICAVEL') for k in ('secao_b_m','secao_h_m','diametro_m')):
            errors.append(f'{row["troco_tipo_id"]}: geometria diverge do legado sem conciliação')
    # As divergências do desenho e limitações do lote não podem virar dados finais.
    if details['D06-C']['chumbadouros_quantidade_indicada'] != 'PENDENTE' or details['D06-C']['estado_compatibilizacao'] != 'PENDENTE':
        errors.append('D06-C: conflito 6/4 chumbadouros indevidamente resolvido')
    if any(details['D06-H'][key] != 'PENDENTE' for key in ('chapa_b_mm','chapa_h_mm','estado_compatibilizacao')):
        errors.append('D06-H: conflito de chapa indevidamente resolvido')
    for name, rows in tables.items():
        for row in rows:
            if 'estado_quantitativo' in row and row['estado_quantitativo'] != 'PENDENTE':
                errors.append(f'{name}: este lote não contém quantitativos finais liberados')
    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, default=ROOT)
    args = parser.parse_args()
    errors = validate(args.root)
    if errors:
        print('LOTE INVÁLIDO\n' + '\n'.join('- ' + error for error in errors))
        return 1
    print('LOTE DOCUMENTAL VÁLIDO: desenhos 01-06; fonte, referências, campos e pendências verificados.')
    print('Validação de integridade não é aprovação técnica nem liberação de quantitativos/execução.')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
