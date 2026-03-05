from datetime import date

from rest_framework import serializers
from .models import Entry


class EntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Entry
        fields = ['id', 'date', 'content', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def validate_date(self, value):
        if value > date.today():
            raise serializers.ValidationError("Date cannot be set in the future.")
        return value
