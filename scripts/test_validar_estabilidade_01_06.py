"""Testes das barreiras contra perda de rastreabilidade e falsa confirmação."""
import csv
import importlib.util
import json
import shutil
import tempfile
import unittest
from pathlib import Path

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('validador_estabilidade', HERE/'validar_estabilidade_01_06.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class ValidacaoEstabilidade(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.base = self.root/module.LOTE
        shutil.copytree(module.ROOT/module.LOTE, self.base)
        shutil.copy(module.ROOT/'base_tecnica/tipos_pilares.csv', self.root/'base_tecnica/tipos_pilares.csv')
        manifest = json.loads((self.base/'manifesto.json').read_text())
        source = self.root/manifest['fonte']['arquivo']
        source.parent.mkdir(parents=True)
        source.symlink_to(module.ROOT/manifest['fonte']['arquivo'])

    def change(self, table, key, value, index=0):
        path = self.base/(table+'.csv')
        with path.open(newline='', encoding='utf-8') as f:
            reader = csv.DictReader(f,delimiter=';')
            fields = reader.fieldnames
            rows = list(reader)
        rows[index][key] = value
        with path.open('w',newline='',encoding='utf-8') as f:
            writer = csv.DictWriter(f,fieldnames=fields,delimiter=';')
            writer.writeheader()
            writer.writerows(rows)

    def test_lote_original(self):
        self.assertEqual(module.validate(self.root), [])

    def test_rejeita_fonte_divergente(self):
        path = self.base/'manifesto.json'
        data = json.loads(path.read_text())
        data['fonte']['sha256'] = '0'*64
        path.write_text(json.dumps(data))
        self.assertTrue(any('hash/tamanho' in e for e in module.validate(self.root)))

    def test_rejeita_evidencia_inexistente(self):
        self.change('tipos_sapatas','evidencia_id','INEXISTENTE')
        self.assertTrue(any('evidência inexistente' in e for e in module.validate(self.root)))

    def test_rejeita_pagina_trocada(self):
        self.change('evidencias','pagina_pdf','9')
        self.assertTrue(any('página/revisão' in e for e in module.validate(self.root)))

    def test_rejeita_id_duplicado(self):
        self.change('tipos_sapatas','tipo_id','D01-S1',1)
        self.assertTrue(any('duplicado' in e for e in module.validate(self.root)))

    def test_rejeita_falso_zero_conflito(self):
        self.change('pormenores_metalicos','chumbadouros_quantidade_indicada','0',2)
        self.assertTrue(any('6/4' in e for e in module.validate(self.root)))

    def test_rejeita_promocao_a_elemento(self):
        self.change('ocorrencias_fundacoes','elemento_id','A-FUND-S2-01')
        self.assertTrue(any('promovida' in e for e in module.validate(self.root)))

    def test_rejeita_decimal_com_ponto(self):
        self.change('tipos_sapatas','h_m','0.40')
        self.assertTrue(any('numérico inválido' in e for e in module.validate(self.root)))

    def test_rejeita_liberacao_quantitativo(self):
        self.change('trocos_tipos_metalicos','estado_quantitativo','CONFIRMADO')
        self.assertTrue(any('quantitativos finais' in e for e in module.validate(self.root)))

    def test_rejeita_ligacao_inexistente(self):
        self.change('trocos_tipos_metalicos','pormenor_superior','D06-Z')
        self.assertTrue(any('ligação inexistente' in e for e in module.validate(self.root)))


if __name__ == '__main__':
    unittest.main()
