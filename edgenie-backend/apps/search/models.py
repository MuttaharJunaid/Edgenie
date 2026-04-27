import uuid
from django.db import models


class SearchLog(models.Model):
    id             = models.UUIDField(primary_key=True,
                         default=uuid.uuid4, editable=False)
    query          = models.CharField(max_length=500)
    student        = models.ForeignKey(
                         'accounts.CustomUser',
                         on_delete=models.SET_NULL,
                         null=True, blank=True)
    subject        = models.ForeignKey(
                         'papers.Subject',
                         on_delete=models.SET_NULL,
                         null=True, blank=True)
    result_count   = models.IntegerField(default=0)
    filters_applied= models.JSONField(default=dict, blank=True)
    searched_at    = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'search_logs'
        ordering = ['-searched_at']
