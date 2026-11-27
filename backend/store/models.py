from enum import unique
import uuid
from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models
from django.utils.text import slugify
from uuid_utils.compat import uuid7


class UUIDModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid7, editable=False)

    class Meta:
        abstract = True


class Category(UUIDModel):
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    parent = models.ForeignKey(
        "self",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="subcategories",
    )

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1
            while Category.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.parent.name} > {self.name}" if self.parent else self.name


class Product(UUIDModel):
    class ProductType(models.TextChoices):
        HANDBAG = "HANDBAG", "Handbag"
        COMFORTER = "COMFORTER", "Comforter"

    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    product_type = models.CharField(
        max_length=20,
        choices=ProductType.choices,
        default=ProductType.HANDBAG,
        help_text="Product category type: Handbag or Comforter",
    )
    category = models.ForeignKey(
        Category, on_delete=models.PROTECT, related_name="products"
    )
    description = models.TextField(blank=True)
    material = models.CharField(
        max_length=255,
        blank=True,
        help_text="e.g., Top Grain Italian Leather, or 100% Long-Staple Egyptian Cotton",
    )
    care_instructions = models.TextField(
        blank=True,
        help_text="e.g., Wipe clean with leather conditioner / Machine wash gentle cold",
    )
    base_price = models.DecimalField(
        max_digits=10, decimal_places=2, validators=[MinValueValidator(0)]
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Handbag-specific specifications
    dimensions = models.CharField(
        max_length=150,
        blank=True,
        help_text="e.g., 12.5\" W x 9\" H x 4.5\" D / Strap drop: 22\"",
    )
    closure_type = models.CharField(
        max_length=100,
        blank=True,
        help_text="e.g., Magnetic Snap, Zip Top, Turn-lock, Drawstring",
    )

    # Comforter-specific specifications
    fill_material = models.CharField(
        max_length=150,
        blank=True,
        help_text="e.g., 750 Fill Power European White Goose Down, or 350 GSM Microfiber",
    )
    warmth_rating = models.CharField(
        max_length=50,
        blank=True,
        help_text="e.g., Lightweight / Summer, All-Season, Heavyweight / Winter",
    )
    thread_count = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text="Shell thread count for comforters (e.g., 400, 600, 800)",
    )

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"[{self.get_product_type_display()}] {self.name}"


class Color(UUIDModel):
    name = models.CharField(max_length=50, unique=True)
    hex_code = models.CharField(max_length=7, help_text="e.g., #1A1A1A")

    def __str__(self):
        return self.name


class Size(UUIDModel):
    # For Comforters: Twin, Twin XL, Full, Queen, King, Cal King
    # For Handbags: Mini, Small, Medium, Large, Oversized, One Size
    name = models.CharField(max_length=50, unique=True)
    sort_order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["sort_order"]

    def __str__(self):
        return self.name


class ProductVariant(UUIDModel):
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="variants"
    )
    color = models.ForeignKey(Color, on_delete=models.PROTECT)
    size = models.ForeignKey(Size, on_delete=models.PROTECT)
    sku = models.CharField(max_length=64, unique=True)
    price_override = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Leave blank to use product base_price",
    )
    stock = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["product", "color", "size"], name="unique_product_color_size"
            )
        ]

    @property
    def effective_price(self):
        return self.price_override if self.price_override is not None else self.product.base_price

    def __str__(self):
        return f"{self.product.name} ({self.color.name} / {self.size.name})"


class ProductImage(UUIDModel):
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="images"
    )
    color = models.ForeignKey(
        Color,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        help_text="Optional: links photo to a specific color swatch",
    )
    image_url = models.ImageField(upload_to="ecommerce_site/product_images/", blank=True, null=True)
    alt_text = models.CharField(max_length=255, blank=True)
    is_primary = models.BooleanField(default=False)
    sort_order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["sort_order"]
