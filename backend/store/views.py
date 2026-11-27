from rest_framework import viewsets, status, filters
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser, SAFE_METHODS, BasePermission
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from users.serializers import UserSerializer
from . import models, serializers

User = get_user_model()


class IsAdminOrReadOnly(BasePermission):
    """
    Allow read-only requests (GET, HEAD, OPTIONS) for any user / guest,
    but restrict create, update, and delete actions to admin/staff users.
    """
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_staff)


# =====================================================================
# PRODUCT CRUD VIEWSET (HANDBAGS & COMFORTERS)
# =====================================================================
class ProductViewSet(viewsets.ModelViewSet):
    """
    CRUD ViewSet for Handbags and Comforters:
    - GET /store/products/ : List products (with filtering by product_type, category, warmth, price, etc.)
    - POST /store/products/ : Create new product (Admin only)
    - GET /store/products/<id>/ : Retrieve product details
    - PUT/PATCH /store/products/<id>/ : Update product (Admin only)
    - DELETE /store/products/<id>/ : Delete product (Admin only)
    - GET /store/products/handbags/ : Quick filter for handbags only
    - GET /store/products/comforters/ : Quick filter for comforters only
    - GET /store/products/<id>/variants/ : List variants for product
    - GET /store/products/<id>/images/ : List images for product
    """
    queryset = models.Product.objects.select_related("category").prefetch_related("variants", "images").all()
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = "id"
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = [
        "name",
        "description",
        "material",
        "fill_material",
        "category__name",
        "dimensions",
        "closure_type",
    ]
    ordering_fields = ["base_price", "created_at", "name", "thread_count"]
    ordering = ["-created_at"]

    def get_queryset(self):
        queryset = super().get_queryset()

        # Non-staff users only see active products
        if not (self.request.user and self.request.user.is_staff):
            queryset = queryset.filter(is_active=True)

        # Filter by product_type (HANDBAG or COMFORTER)
        product_type = self.request.query_params.get("product_type")
        if product_type:
            queryset = queryset.filter(product_type__iexact=product_type)

        # Filter by category (id or slug)
        category = self.request.query_params.get("category")
        if category:
            if category.isdigit():
                queryset = queryset.filter(category_id=category)
            else:
                queryset = queryset.filter(category__slug=category)

        # Filter by warmth_rating (for comforters)
        warmth = self.request.query_params.get("warmth_rating")
        if warmth:
            queryset = queryset.filter(warmth_rating__icontains=warmth)

        # Filter by closure_type (for handbags)
        closure = self.request.query_params.get("closure_type")
        if closure:
            queryset = queryset.filter(closure_type__icontains=closure)

        # Filter by material
        material = self.request.query_params.get("material")
        if material:
            queryset = queryset.filter(material__icontains=material)

        # Filter by price range
        min_price = self.request.query_params.get("min_price")
        if min_price:
            try:
                queryset = queryset.filter(base_price__gte=float(min_price))
            except ValueError:
                pass

        max_price = self.request.query_params.get("max_price")
        if max_price:
            try:
                queryset = queryset.filter(base_price__lte=float(max_price))
            except ValueError:
                pass

        return queryset

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return serializers.ProductWriteSerializer
        if self.action == "retrieve":
            return serializers.ProductDetailSerializer
        return serializers.ProductListSerializer

    @action(detail=False, methods=["get"])
    def handbags(self, request):
        """Convenience endpoint: list all active handbags."""
        queryset = self.get_queryset().filter(product_type=models.Product.ProductType.HANDBAG)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = serializers.ProductListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = serializers.ProductListSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def comforters(self, request):
        """Convenience endpoint: list all active comforters."""
        queryset = self.get_queryset().filter(product_type=models.Product.ProductType.COMFORTER)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = serializers.ProductListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = serializers.ProductListSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["get"])
    def variants(self, request, id=None):
        """List all variants for a specific product."""
        product = self.get_object()
        variants = product.variants.all()
        serializer = serializers.ProductVariantSerializer(variants, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["get"])
    def images(self, request, id=None):
        """List all images for a specific product."""
        product = self.get_object()
        images = product.images.all()
        serializer = serializers.ProductImageSerializer(images, many=True)
        return Response(serializer.data)


# =====================================================================
# CATEGORY CRUD VIEWSET
# =====================================================================
class CategoryViewSet(viewsets.ModelViewSet):
    """
    CRUD ViewSet for Categories (e.g. Handbags / Comforters and their subcategories):
    - GET /store/categories/ : List categories
    - POST /store/categories/ : Create category (Admin only)
    - GET /store/categories/<id>/ : Category detail
    - PUT/PATCH /store/categories/<id>/ : Update category (Admin only)
    - DELETE /store/categories/<id>/ : Delete category (Admin only)
    """
    queryset = models.Category.objects.all()
    serializer_class = serializers.CategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = "id"
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "slug"]
    ordering_fields = ["name", "id"]
    ordering = ["name"]

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.request.query_params.get("root_only") == "true":
            queryset = queryset.filter(parent__isnull=True)
        return queryset


# =====================================================================
# PRODUCT VARIANT CRUD VIEWSET
# =====================================================================
class ProductVariantViewSet(viewsets.ModelViewSet):
    """
    CRUD ViewSet for Product Variants:
    - Handbags: color and size (Mini, Small, Medium, Large)
    - Comforters: color and bedding size (Twin, Full, Queen, King, Cal King)
    """
    queryset = models.ProductVariant.objects.select_related("product", "color", "size").all()
    serializer_class = serializers.ProductVariantSerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = "id"

    def get_queryset(self):
        queryset = super().get_queryset()
        product_id = self.request.query_params.get("product")
        if product_id:
            queryset = queryset.filter(product_id=product_id)
        return queryset


# =====================================================================
# PRODUCT IMAGE CRUD VIEWSET
# =====================================================================
class ProductImageViewSet(viewsets.ModelViewSet):
    """
    CRUD ViewSet for Product Images:
    - GET /store/images/?product=<id> : List images
    - POST /store/images/ : Upload image (Admin only)
    - GET/PUT/PATCH/DELETE /store/images/<id>/
    """
    queryset = models.ProductImage.objects.select_related("product", "color").all()
    serializer_class = serializers.ProductImageSerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = "id"

    def get_queryset(self):
        queryset = super().get_queryset()
        product_id = self.request.query_params.get("product")
        if product_id:
            queryset = queryset.filter(product_id=product_id)
        return queryset


# =====================================================================
# COLOR & SIZE CRUD VIEWSETS
# =====================================================================
class ColorViewSet(viewsets.ModelViewSet):
    """
    CRUD for Colors (Black, Cognac, Camel, White, Charcoal, Navy, Sage, etc.)
    """
    queryset = models.Color.objects.all()
    serializer_class = serializers.ColorSerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = "id"


class SizeViewSet(viewsets.ModelViewSet):
    """
    CRUD for Sizes:
    - Comforter sizes: Twin, Twin XL, Full, Queen, King, California King
    - Handbag sizes: Mini, Small, Medium, Large, Oversized, One Size
    """
    queryset = models.Size.objects.all()
    serializer_class = serializers.SizeSerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = "id"


# =====================================================================
# WHOAMI (CURRENT USER PROFILE)
# =====================================================================
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def whoami(request):
    """Returns the authenticated user's profile info."""
    serializer = UserSerializer(request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)
