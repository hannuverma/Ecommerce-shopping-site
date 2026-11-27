from rest_framework import serializers
from . import models


class CategorySerializer(serializers.ModelSerializer):
    subcategories = serializers.SerializerMethodField()

    class Meta:
        model = models.Category
        fields = ["id", "name", "slug", "parent", "subcategories"]
        read_only_fields = ["id", "slug"]

    def get_subcategories(self, obj):
        if obj.parent is None:
            return CategorySerializer(obj.subcategories.all(), many=True).data
        return []


class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Color
        fields = ["id", "name", "hex_code"]


class SizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Size
        fields = ["id", "name", "sort_order"]


class ProductImageSerializer(serializers.ModelSerializer):
    color_name = serializers.CharField(source="color.name", read_only=True)

    class Meta:
        model = models.ProductImage
        fields = [
            "id",
            "product",
            "color",
            "color_name",
            "image_url",
            "alt_text",
            "is_primary",
            "sort_order",
        ]
        read_only_fields = ["id"]


class ProductVariantSerializer(serializers.ModelSerializer):
    color_detail = ColorSerializer(source="color", read_only=True)
    size_detail = SizeSerializer(source="size", read_only=True)
    effective_price = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True
    )

    class Meta:
        model = models.ProductVariant
        fields = [
            "id",
            "product",
            "color",
            "color_detail",
            "size",
            "size_detail",
            "sku",
            "price_override",
            "effective_price",
            "stock",
            "is_active",
        ]
        read_only_fields = ["id", "effective_price"]


class ProductListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for product catalog / grid cards."""
    category = CategorySerializer(read_only=True)
    product_type_display = serializers.CharField(source="get_product_type_display", read_only=True)
    primary_image = serializers.SerializerMethodField()

    class Meta:
        model = models.Product
        fields = [
            "id",
            "name",
            "slug",
            "product_type",
            "product_type_display",
            "category",
            "base_price",
            "material",
            "warmth_rating",
            "is_active",
            "primary_image",
            "created_at",
        ]

    def get_primary_image(self, obj):
        img = obj.images.filter(is_primary=True).first() or obj.images.first()
        if img and img.image_url:
            return str(img.image_url)
        return None


class ProductDetailSerializer(serializers.ModelSerializer):
    """Full detail serializer for single product pages (Handbags & Comforters)."""
    category = CategorySerializer(read_only=True)
    product_type_display = serializers.CharField(source="get_product_type_display", read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = models.Product
        fields = [
            "id",
            "name",
            "slug",
            "product_type",
            "product_type_display",
            "category",
            "description",
            "material",
            "care_instructions",
            "base_price",
            "is_active",
            # Handbag-specific
            "dimensions",
            "closure_type",
            # Comforter-specific
            "fill_material",
            "warmth_rating",
            "thread_count",
            "created_at",
            "updated_at",
            "variants",
            "images",
        ]


class ProductWriteSerializer(serializers.ModelSerializer):
    """Used for create / update operations by admins."""
    class Meta:
        model = models.Product
        fields = [
            "id",
            "name",
            "slug",
            "product_type",
            "category",
            "description",
            "material",
            "care_instructions",
            "base_price",
            "is_active",
            "dimensions",
            "closure_type",
            "fill_material",
            "warmth_rating",
            "thread_count",
        ]
        read_only_fields = ["id", "slug"]
