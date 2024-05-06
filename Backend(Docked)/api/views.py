from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from shopiet.models import Item, Category, Images, User, Profile
from .serialisers import ItemSerializer
from .serialisers import AddUserSerializer, AddItemSerializer, ProfileSerializer

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['password'] = user.password
        token['id'] = user.id
            
        if hasattr(user, 'profile') and hasattr(user.profile, 'profile_pic'):
            token['profile_pic'] = user.profile.profile_pic.url 
   
        # ...

        return token
    

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['GET'])
def getData(request):
    items = Item.objects.all()
    serializer = ItemSerializer(items, many=True)

    return Response(serializer.data)

@api_view(['GET'])
def getItem(request, slug):
    try:
        item = Item.objects.get(slug=slug)
        serializer = ItemSerializer(item)
        return Response(serializer.data)
    except Item.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def addUser(request):
    if request.method == 'POST':
        serializer = AddUserSerializer(data=request.data)
        if serializer.is_valid():
            # Check if user already exists
            username = serializer.validated_data["username"]
            email = serializer.validated_data["email"]
            if User.objects.filter(username=username).exists():
                return Response({'message': 'A user with that username already exists'}, status=status.HTTP_409_CONFLICT)
            elif User.objects.filter(email=email).exists():
                return Response({'message': 'A user with that email already exists'}, status=status.HTTP_409_CONFLICT)



            user = serializer.save()
            response_data = {
                'message': 'User registered successfully',
                'user_id': user.id,
                'password':user.password,
                'username': user.username,
                'email': user.email,
            }
            return Response(response_data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def getCatItems(request, item_category_name):
    try:
        category_items = Item.objects.filter(item_category_name=item_category_name)
        serializer = ItemSerializer(category_items, many=True)
        return Response(serializer.data)
    except Item.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def update_profile(request):

    if request.method == 'POST':
        username = request.data.get('username') 
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    

    try:
        profile = Profile.objects.get(user=user)
    except Profile.DoesNotExist:
        profile = Profile(user=user)
    
  
    serializer = ProfileSerializer(profile, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)

@api_view(['POST'])
def addItem(request):
    if request.method == 'POST':
        item_username = request.data.get('item_username')  # Assuming 'username' is passed in the request data
        try:
            user = User.objects.get(username=item_username)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        # Add the user object to the request data
        request.data['user'] = user.id
        serializer = AddItemSerializer(data=request.data)
        if serializer.is_valid():
            item = serializer.save()
            response_data = {
                'message': 'Item uploaded',
                'data': serializer.data
            }
            return Response(response_data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


