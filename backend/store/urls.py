from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'products', views.ProductViewSet, basename='product')
router.register(r'categories', views.CategoryViewSet, basename='category')
router.register(r'variants', views.ProductVariantViewSet, basename='variant')
router.register(r'images', views.ProductImageViewSet, basename='image')
router.register(r'colors', views.ColorViewSet, basename='color')
router.register(r'sizes', views.SizeViewSet, basename='size')

urlpatterns = [
    path('whoami/', views.whoami, name='whoami'),
    path('', include(router.urls)),
]
