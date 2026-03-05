from datetime import date, timedelta

from django.db.models import Count
from django.db.models.functions import TruncMonth
from rest_framework import viewsets, filters
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Entry
from .serializers import EntrySerializer


class EntryViewSet(viewsets.ModelViewSet):
    serializer_class = EntrySerializer
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['date']
    ordering = ['-date']

    def get_queryset(self):
        queryset = Entry.objects.all()
        year = self.request.query_params.get('year')
        month = self.request.query_params.get('month')
        if year:
            queryset = queryset.filter(date__year=year)
        if month:
            queryset = queryset.filter(date__month=month)
        return queryset


@api_view(['GET'])
def stats(request):
    entries = Entry.objects.order_by('date')
    dates = list(entries.values_list('date', flat=True))

    per_month = (
        Entry.objects
        .annotate(month=TruncMonth('date'))
        .values('month')
        .annotate(count=Count('id'))
        .order_by('month')
    )
    entries_per_month = [
        {'month': row['month'].strftime('%Y-%m'), 'count': row['count']}
        for row in per_month
    ]

    return Response({
        'total': len(dates),
        'current_streak': _calc_current_streak(dates),
        'longest_streak': _calc_longest_streak(dates),
        'entries_per_month': entries_per_month,
    })


def _calc_current_streak(dates):
    if not dates:
        return 0
    today = date.today()
    date_set = set(dates)
    if today not in date_set and (today - timedelta(days=1)) not in date_set:
        return 0
    check = today if today in date_set else today - timedelta(days=1)
    streak = 0
    while check in date_set:
        streak += 1
        check -= timedelta(days=1)
    return streak


def _calc_longest_streak(dates):
    if not dates:
        return 0
    longest = current = 1
    for i in range(1, len(dates)):
        if (dates[i] - dates[i - 1]).days == 1:
            current += 1
            longest = max(longest, current)
        else:
            current = 1
    return longest