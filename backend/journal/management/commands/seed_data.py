from datetime import date, timedelta
import random

from django.core.management.base import BaseCommand

from journal.models import Entry

CONTENT_SAMPLES = [
    "Hyvä kahvi aamulla. Hiljaisuus ennen kuin päivä alkoi.\nAurinko ikkunasta iltapäivällä.",
    "Sain tehtyä vaikean asian, jota olin lykännyt.\nSateen haju matkalla kotiin.\nMukava paikka nukkua.",
    "Kollega, joka auttoi pyytämättä.\nLöysin puoli tuntia lukemiseen.\nTerveyteni, helppo pitää itsestäänselvyytenä.",
    "Valmistin sapuskaa josta olen ylpeä.\nPitkä kävelylenkki joka selkeytti ajatukset.\nHyvä ruoka ja mahdollisuus laittaa sitä itse.",
    "Heräsin ennen herätystä ja tunsin oloni levänneeksi.\nOdottamaton ystävällisyys tuntemattomalta.\nTuleva viikonloppu.",
    "Musiikki, joka sopi täsmälleen siihen miltä tuntui.\nOngelma, joka osoittautui luultua yksinkertaisemmaksi.",
    "Edistin asiaa joka oli minulle tärkeää.\nKaupunki näyttää erilaiselta varhain aamulla.\nTyö, joka pitää minut motivoituneena.",
    "Rauhallinen ilta ilman kiireellisiä asioita.\nMuistin vanhan sisäpiirin vitsin.\nElämän kehityssuunta on positiivinen.",
    "Nukuin hyvin. Heräsin ilman ahdistusta.\nTuottoisa aamu ilman häiriöitä.\nKiitollinen omast ja muiden kärsivällisyydestä.",
    "Keskustelu, joka muutti tapaa jolla ajattelin aihetta.\nRaitista ilmaa ja mahdollisuus liikkua.\nPienet rutiinit, jotka tekevät päivistä vakaita.",
    "Viikko päättyi hyvin.\nAikaa itselleni, jonka käytin tehokkaasti.\nIhmiset joiden kanssa voin olla rehellinen.",
    "Opin tänään asian, mistä en eilen tiennyt.\nSe, että mikään ei mennyt pieleen.\nHyvä yöuni etukäteen.",
    "Puhelu vanhan ystävän kanssa, joka kesti odotettua pidempään.",
]


class Command(BaseCommand):
    help = 'Seed the database with sample journal entries'

    def handle(self, *args, **options):
        Entry.objects.all().delete()

        today = date.today()
        # Skip a few scattered days to not avoid just having a single streak
        skip_days = {3, 9, 17, 26}

        created = 0
        for days_ago in range(34, -1, -1):
            if days_ago in skip_days:
                continue
            entry_date = today - timedelta(days=days_ago)
            Entry.objects.create(
                date=entry_date,
                content=random.choice(CONTENT_SAMPLES),
            )
            created += 1

        self.stdout.write(self.style.SUCCESS(f'Created {created} entries.'))
