from django.db import models

class Hotline(models.Model):
    COUNTRY_CHOICES = [
        ('KE', 'Kenya'), ('NG', 'Nigeria'), ('ZA', 'South Africa'),
        ('UG', 'Uganda'), ('GH', 'Ghana'), ('TZ', 'Tanzania'), ('RW', 'Rwanda'),
        # Add more as needed
    ]

    name = models.CharField(max_length=200)
    organization = models.CharField(max_length=200)
    country = models.CharField(max_length=2, choices=COUNTRY_CHOICES)
    region = models.CharField(max_length=100, blank=True)  # e.g. Nairobi, Lagos
    phone = models.CharField(max_length=50)
    whatsapp = models.CharField(max_length=50, blank=True)
    website = models.URLField(blank=True)
    languages = models.CharField(max_length=100, default="English")
    is_24_7 = models.BooleanField(default=True)
    category = models.CharField(max_length=50, default="GBV Hotline")

    def __str__(self):
        return f"{self.organization} - {self.country}"