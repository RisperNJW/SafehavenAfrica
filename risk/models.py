from django.db import models

class RiskFactor(models.Model):
    question = models.TextField()
    weight = models.IntegerField(help_text="Higher = more dangerous (1-10)")
    category = models.CharField(max_length=50, default="general")

    def __str__(self):
        return f"{self.question} (weight: {self.weight})"