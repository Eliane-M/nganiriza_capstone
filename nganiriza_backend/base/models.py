from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify


class BaseModel(models.Model):
    
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True, max_length=50)
    created_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name="created_by_who"
    )
    updated_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name="updated_by_who"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    

    def save(self, *args, **kwargs):
        if not self.slug:
            original_slug = slugify(self.name)
            unique_slug = original_slug
            num = 1

            while self.__class__.objects.filter(slug=unique_slug).exists():
                unique_slug = f"{original_slug}-{num}"
                num += 1

            self.slug = unique_slug

        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.name
