from django.db import models


class Entry(models.Model):
    # unique=True ensures only one entry per day
    date = models.DateField(unique=True)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f"Entry {self.date}"
