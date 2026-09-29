from __future__ import annotations

import csv
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LOT = ROOT / 'base_tecnica/implantacao_fundacoes_20260929'


def rows(name):
    with (LOT / f'{name}.csv').open(encoding='utf-8', newline='') as stream:
        return list(csv.DictReader(stream, delimiter=';'))


def validate(root: Path = ROOT) -> list[str]:
    errors = []
    manifest = json.loads((LOT / 'manifesto.json').read_text(encoding='utf-8'))
    source = ROOT / manifest['fonte']['arquivo']
    if not source.exists() or hashlib.sha256(source.read_bytes()).hexdigest() != manifest['fonte']['sha256']:
        errors.append('fonte PDF ausente ou hash divergente')
    tables = {name: rows(name) for name in manifest['tabelas']}
    for name, spec in manifest['tabelas'].items():
        if len(tables[name]) != spec['linhas']:
            errors.append(f'{name}: contagem divergente')
        if tables[name] and list(tables[name][0]) != spec['colunas']:
            errors.append(f'{name}: cabeçalho divergente')
        ids = set()
        for line, row in enumerate(tables[name], 2):
            key = next(iter(row))
            if not row[key] or row[key] in ids:
                errors.append(f'{name}:{line}: ID vazio/duplicado')
            ids.add(row[key])
            if any(v == '' for v in row.values()):
                errors.append(f'{name}:{line}: célula vazia')
    evidence = {r['evidencia_id'] for r in tables['evidencias']}
    for name, data in tables.items():
        if name == 'evidencias':
            continue
        field = 'evidencia_id' if 'evidencia_id' in data[0] else None
        if field:
            for row in data:
                if row[field] not in evidence and row[field] != 'NAO_APLICAVEL':
                    errors.append(f'{name}: evidência inexistente {row[field]}')
    fracs = {r['fracao']: r for r in tables['fracoes_e_grades']}
    expected = {'A': '01', 'B': '01', 'C': '01', 'D': '02', 'E': '02', 'F': '03', 'G': '03', 'H': '04', 'I': '04', 'J': '04'}
    for frac, drawing in expected.items():
        if fracs.get(frac, {}).get('desenho_fundacoes') != drawing:
            errors.append(f'fração {frac}: desenho incorreto')
    if any(r['fracao'] != {'D': 'E', 'E': 'D'}.get(r['fracao_registro_original'], r['fracao_registro_original']) for r in tables['ocorrencias_consolidadas']):
        errors.append('ocorrências consolidadas: retificação D/E incoerente')
    if len(tables['retificacoes']) != 25:
        errors.append('retificações D/E: esperado 25 registros')
    for row in tables['retificacoes']:
        if row['valor_anterior'] not in {'D', 'E'} or row['valor_corrigido'] not in {'D', 'E'} or row['valor_anterior'] == row['valor_corrigido']:
            errors.append(f"{row['retificacao_id']}: correção D/E inválida")
    for row in tables['limites_sapatas'] + tables['referencias_apoios']:
        for field, value in row.items():
            if field.startswith('estado_') and field != 'estado_leitura' and value != 'PENDENTE':
                errors.append(f"{row[next(iter(row))]}: campo {field} indevidamente liberado")
    if any(row['centro_sapata_confirmado'] != 'NAO' for row in tables['referencias_apoios']):
        errors.append('referências de apoio: centro de sapata foi confirmado sem base')
    return errors


def main() -> int:
    errors = validate()
    if errors:
        print('IMPLANTAÇÃO INVÁLIDA')
        print('\n'.join('- ' + e for e in errors))
        return 1
    print('IMPLANTAÇÃO VÁLIDA: D/E retificado, eixos rastreados e limites/execução mantidos PENDENTES.')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
