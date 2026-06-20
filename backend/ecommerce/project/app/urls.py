from app import views
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('', views.getRoutes, name='getRoutes'),

    # Products - specific
    path('products/create/', views.createProduct, name='product-create'),
    path('products/upload/', views.uploadImage, name='image-upload'),
    path('products/update/<str:pk>/', views.updateProduct, name='product-update'),
    path('products/delete/<str:pk>/', views.deleteProduct, name='product-delete'),
    path('products/', views.getProducts, name='products'),
    path('products/<str:pk>/', views.getProduct, name='product'),

    # Users - specific 
    path('users/login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('users/register/', views.registerUser, name='register'),
    path('users/getallusers/', views.getUsers, name='users'),
    path('users/profile/', views.getUserProfile, name='getUserProfile'),          
    path('users/profile/update/', views.updateUserProfile, name='updateUserProfile'),  
    path('users/update/<str:pk>/', views.updateUser, name='updateUser'),
    path('users/delete/<str:pk>/', views.deleteUser, name='deleteUser'),
    path('users/<str:pk>/', views.getUserById, name='getUserById'),               

    path('activate/<uidb64>/<token>/', views.ActivateAccount.as_view(), name='activate'),

    # Orders - specific 
    path('orders/add/', views.addOrderItems, name='orders-add'),
    path('orders/myorders/', views.getMyOrders, name='myorders'),
    path('orders/', views.getOrders, name='orders'),
    path('orders/<str:pk>/', views.getOrderById, name='user-order'),

    # path('create-admin/', views.createSuperUser),
]

