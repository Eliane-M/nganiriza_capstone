import json
from django.core.management.base import BaseCommand
from models.models import Province, District, Sector, Cell, Village

class Command(BaseCommand):
    help = "Import Rwanda location hierarchy from JSON"

    def handle(self, *args, **options):
        with open('models/data/localities.json', 'r', encoding='utf-8') as f:
            data = json.load(f)

        for prov in data.get("provinces", []):
            prov_obj, _ = Province.objects.get_or_create(name=prov["name"])
            for dist in prov.get("districts", []):
                dist_obj, _ = District.objects.get_or_create(name=dist["name"], province=prov_obj)
                for sect in dist.get("sectors", []):
                    sect_obj, _ = Sector.objects.get_or_create(name=sect["name"], district=dist_obj)
                    for cell in sect.get("cells", []):
                        cell_obj, _ = Cell.objects.get_or_create(name=cell["name"], sector=sect_obj)
                        for vill in cell.get("villages", []):
                            Village.objects.get_or_create(name=vill["name"], cell=cell_obj)

        self.stdout.write(self.style.SUCCESS("Imported Rwanda location data"))
