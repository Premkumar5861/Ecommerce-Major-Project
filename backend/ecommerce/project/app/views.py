from django.shortcuts import render
import cloudinary.uploader

#from django.http import JsonResponse
#from .products import products

from django.core.mail import EmailMessage
from .models import Product,Order, OrderItem, ShippingAddress

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .serializer import ProductSerializer, UserSerializerwithToken, OrderSerializer,UserSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

# for email purpose and cerifying the email
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_decode,urlsafe_base64_encode
from django.utils.encoding import force_bytes,force_str as force_text,DjangoUnicodeDecodeError
from django.conf import settings
from django.views.generic import View
from .utils import TokenGenerator,generate_token
from django.utils.encoding import force_str

from rest_framework import status;
from rest_framework.permissions import IsAuthenticated,IsAdminUser

# Create your views here.

@api_view(['GET'])
def getRoutes(request):
    myapis=[
        {
            "products": '/api/products',
             "product": '/api/product/1',
             "login": '/api/users/login',
             "signup": '/api/users/register',
        
         }
    ]
    return Response(myapis)

@api_view(['GET'])
def getProducts(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
def getProduct(request, pk):
    product = Product.objects.get(_id=pk)
    serializer = ProductSerializer(product, many=False, context={'request': request})
    return Response(serializer.data)

#class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
 #   @classmethod
  #  def get_token(cls, user):
   #     token = super().get_token(user)

        # Add custom claims
    #    token['username'] = user.username
     #   token['email'] = user.email
        # ...

      #  return token
    
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self,attrs):
        data = super().validate(attrs)
        serializer = UserSerializerwithToken(self.user).data
        for k,v in serializer.items():
            data[k] = v
        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


"""
@api_view(['POST'])
def registerUser(request):
    data = request.data

    try:
        user= User.objects.create(first_name=data["fname"],last_name=data['lname'], username = data['email'],email = data['email'], password= make_password(data['password']),is_active=True)

        email_subject = "Activate Your Account"
        message = render_to_string(
            "activate.html",{
                'user':user,
                'domain': '127.0.0.1:8000',                
                'uid':urlsafe_base64_encode(force_bytes(user.pk)),
                'token':generate_token.make_token(user)
            }
        )

        email_message = EmailMessage(email_subject,message,settings.EMAIL_HOST_USER,[data['email']])
        email_message.send()
        message={"details": f'Activation your account please check the link in gmail for account activation ${message}'}
        return Response(message)
    
    except Exception as e:
        message = {"details" : f"Signup is Failed {e}"}
        return Response(message)

class ActivateAccount(View):

    def get(self,request,uidb64,token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except Exception as identifier:
            user = None
        
        if user is not None and generate_token.check_token(user,token):
            user.is_active =  True
            user.save()

            return render(request,"activateSuccess.html")
        else:
            return render(request,"activateFail.html")
    """
@api_view(['POST'])
def registerUser(request):
    data = request.data

    try:
        user = User.objects.create(
            first_name=data["fname"],
            last_name=data['lname'],
            username=data['email'],
            email=data['email'],
            password=make_password(data['password']),
            is_active=False
        )

        email_subject = "Activate Your Account"
        
        message = render_to_string(
            "activate.html", {
                'user': user,
                'domain': '127.0.0.1:8000',
                'uid': urlsafe_base64_encode(force_bytes(user.pk)),
                'token': generate_token.make_token(user)
            }
        )

       # email_message = EmailMessage(
           # email_subject, email_body, settings.EMAIL_HOST_USER, [data['email']]
       # )
      #  email_message.send()
        message={"details": f'Activation your account please check the link in gmail for account activation {message}'}
        return Response(message)

        #return Response({"details": f"Account activation email sent. Please check your inbox.{email_body}"})

    except Exception as e:
        message = {"details" : f"Signup is Failed {e}"}
        return Response(message)

class ActivateAccount(View):

    def get(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except Exception as identifier:
            user = None
        
        if user is not None and generate_token.check_token(user, token):
            user.is_active = True
            user.save()
            print(f"User {user.email} activated: {user.is_active}")
            return render(request, "activateSuccess.html")
        else:
            return render(request, "activateFail.html")


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user = request.user
    data = request.data
    orderItems = data['orderItems']
    if orderItems and len(orderItems)==0:
        return Response({'details': 'No Order Items'},status=status.HTTP_400_BAD_REQUEST)
    
    # 1. Create order

    order = Order.objects.create(
        user = user,
        #paymentMethod = data['paymentMethod'],
        paymentMethod = 'Cash on Delivery',
        taxPrice = data['taxPrice'],
        shippingPrice = data['shippingPrice'],
        totalPrice = data['totalPrice'],
    )

    # 2. Create Shipping Address
    shipping = ShippingAddress.objects.create(
        order =order,
        address =data['shippingAddress']['address'],
        city =data['shippingAddress']['city'],
        postalCode =data['shippingAddress']['postalCode'],
        country =data['shippingAddress']['country'],
        

    )

    # 3. Create Order Items and set order to orderItem relationship
    for i in orderItems:
        product = Product.objects.get(_id=i['product'])

        item = OrderItem.objects.create(
            product=product,
            order=order,
            name=product.name,
            qty=i['qty'],
            price=i['price'],
            image = str(product.image) if product.image else '',
            
        )
        # 4. Update Stock
        product.countInStock -= item.qty
        product.save()

   

        

    

    serializer = OrderSerializer(order, many=False)
    return Response(serializer.data)



@api_view(['GET'])
@permission_classes([IsAuthenticated])

def getMyOrders(request):
    user=request.user
    orders =  user.order_set.all()
    serializer = OrderSerializer(orders, many=True)
    return Response (serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])

def getOrders(request):
    orders = Order.objects.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])

def getOrderById(request,pk):
    user = request.user
    try:
        order=Order.objects.get(_id=pk)
        if user.is_staff or order.user == user:
            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data)

        else:
            return Response({'details': "Not authorized to view this order"}, status=status.HTTP_400_BAD_REQUEST)

    except:
        return Response({'details':'Order does not exist'},status=status.HTTP_400_BAD_REQUEST)


# Admin views:

@api_view(['POST'])
@permission_classes([IsAdminUser])
def createProduct(request):
    user=request.user

    product=Product.objects.create(
        user=user,
        name='Sample Name',
        price=0,
        brand='Sample Brand',
        countInStock=0,
        category='Sample Category',
        description=''
    )
    serializer=ProductSerializer(product, many=False)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAdminUser])

def updateProduct(request,pk):
    data=request.data
    product=Product.objects.get(_id=pk)
    product.name=data['name']
    product.price=data['price']
    product.brand=data['brand']
    product.countInStock=data['countInStock']
    product.category=data['category']
    product.description=data['description']
    product.save()
    serializer = ProductSerializer(product,many=False)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def uploadImage(request):
    data = request.data
    product_id = data['product_id']
    product = Product.objects.get(_id=product_id)
    
    image_file = request.FILES.get('image')
    
    if image_file:
        # Cloudinary direct upload
        upload_result = cloudinary.uploader.upload(image_file)
        # Cloudinary URL DB- save
        product.image = upload_result['secure_url']
        product.save()
        return Response(upload_result['secure_url'])
    
    return Response('No image provided', status=400)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProduct(request,pk):
    product = Product.objects.get(_id=pk)
    product.delete()
    return Response('Product Delete...')



@api_view(['GET'])
@permission_classes([IsAdminUser])

def getUsers(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)
        


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUserById(request,pk):
    user = User.objects.get(id=pk)
    serializer = UserSerializer(user,many=False)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user = request.user
    serializer = UserSerializer(user,many=False)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    user = request.user
    serializer = UserSerializerwithToken(user,many=False)
    data=request.data
    user.first_name = data['fname']
    user.last_name = data['lname']
    if data['password']!= '':
        user.password =make_password(data['password'])
    user.save()

    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])

def deleteUser(request,pk):
    user = User.objects.get(id=pk)
    user.delete()
    serializer = UserSerializer(user,many=False)
    return Response("User is Deleted Successfully...")


@api_view(["PUT"])
@permission_classes([IsAuthenticated])

def updateUser(request,pk):
    user = User.objects.get(id=pk)
    data=request.data

    user.first_name=data['name']
    user.email=data['email']
    user.is_staff=data['isAdmin']
    user.save()
    serializer = UserSerializer(user,many=False)
    return Response(serializer.data)

# @api_view(['GET'])
# def createSuperUser(request):
    try:
        user = User.objects.create_superuser(
            username='admin@gmail.com',
            email='admin@gmail.com',
            password='admin123',
            first_name='Admin',
            last_name='User',
            is_active=True
        )
        return Response('Superuser created!')
    except Exception as e:
        return Response(f'Error: {e}')
