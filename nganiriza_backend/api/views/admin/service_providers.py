from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, AllowAny
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema
from models.models import ServiceProvider, Province, District, Sector
from models.serializers import ServiceProviderSerializer


@extend_schema(
    tags=["Admin"],
    responses={200: ServiceProviderSerializer(many=True)}
)
@api_view(["GET"])
@permission_classes([AllowAny])
def list_service_providers(request):
    """List all service providers (clinics) - Admin only"""
    providers = ServiceProvider.objects.select_related('province', 'district', 'sector').all()
    serializer = ServiceProviderSerializer(providers, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@extend_schema(
    tags=["Public"],
    responses={200: ServiceProviderSerializer(many=True)}
)
@api_view(["GET"])
@permission_classes([AllowAny])
def list_public_service_providers(request):
    """List verified service providers (clinics) - Public access"""
    providers = ServiceProvider.objects.filter(
        verified=True
    ).select_related('province', 'district', 'sector').all()
    serializer = ServiceProviderSerializer(providers, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@extend_schema(
    tags=["Admin"],
    request=ServiceProviderSerializer,
    responses={201: ServiceProviderSerializer, 400: dict}
)
@api_view(["POST"])
@permission_classes([AllowAny])
def create_service_provider(request):
    """Create a new service provider (clinic)"""
    data = dict(request.data)
    # Remove basemodel_ptr if present
    data.pop('basemodel_ptr', None)
    
    # Round coordinates to 6 decimal places (max_digits=9, decimal_places=6)
    if 'latitude' in data and data['latitude']:
        try:
            data['latitude'] = round(float(data['latitude']), 6)
        except (ValueError, TypeError):
            pass
    
    if 'longitude' in data and data['longitude']:
        try:
            data['longitude'] = round(float(data['longitude']), 6)
        except (ValueError, TypeError):
            pass
    
    # Convert province/district/sector names to IDs if they're strings
    province_obj = None
    if 'province' in data and isinstance(data['province'], str):
        try:
            province_obj = Province.objects.get(name__iexact=data['province'])
            data['province'] = province_obj.id
        except Province.DoesNotExist:
            data['province'] = None
    
    if 'district' in data and isinstance(data['district'], str):
        try:
            # If we have a province, filter by it; otherwise just by name
            if province_obj:
                district = District.objects.get(name__iexact=data['district'], province=province_obj)
            else:
                district = District.objects.get(name__iexact=data['district'])
            data['district'] = district.id
            # Update province_obj for sector lookup
            province_obj = district.province
        except District.DoesNotExist:
            data['district'] = None
    
    if 'sector' in data and isinstance(data['sector'], str):
        try:
            # If we have a district, filter by it; otherwise just by name
            district_obj = None
            if 'district' in data and isinstance(data['district'], int):
                district_obj = District.objects.get(id=data['district'])
            elif 'district' in data and isinstance(data['district'], str):
                if province_obj:
                    district_obj = District.objects.filter(name__iexact=data['district'], province=province_obj).first()
                else:
                    district_obj = District.objects.filter(name__iexact=data['district']).first()
            
            if district_obj:
                sector = Sector.objects.get(name__iexact=data['sector'], district=district_obj)
            else:
                sector = Sector.objects.get(name__iexact=data['sector'])
            data['sector'] = sector.id
        except Sector.DoesNotExist:
            data['sector'] = None
    
    serializer = ServiceProviderSerializer(data=data)
    if serializer.is_valid():
        # Only set created_by/updated_by if user is authenticated
        save_kwargs = {}
        if request.user and request.user.is_authenticated:
            save_kwargs['created_by'] = request.user
            save_kwargs['updated_by'] = request.user
        provider = serializer.save(**save_kwargs)
        return Response(ServiceProviderSerializer(provider).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    tags=["Admin"],
    responses={200: ServiceProviderSerializer, 404: dict}
)
@api_view(["GET"])
@permission_classes([AllowAny])
def get_service_provider(request, pk):
    """Get a specific service provider"""
    try:
        provider = ServiceProvider.objects.get(pk=pk)
        serializer = ServiceProviderSerializer(provider)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except ServiceProvider.DoesNotExist:
        return Response(
            {"error": "Service provider not found"},
            status=status.HTTP_404_NOT_FOUND
        )


@extend_schema(
    tags=["Admin"],
    request=ServiceProviderSerializer,
    responses={200: ServiceProviderSerializer, 400: dict, 404: dict}
)
@api_view(["PUT", "PATCH"])
@permission_classes([AllowAny])
def update_service_provider(request, pk):
    """Update a service provider"""
    try:
        provider = ServiceProvider.objects.get(pk=pk)
        partial = request.method == 'PATCH'
        data = dict(request.data)
        # Remove basemodel_ptr if present
        data.pop('basemodel_ptr', None)
        
        # Round coordinates to 6 decimal places (max_digits=9, decimal_places=6)
        if 'latitude' in data and data['latitude']:
            try:
                data['latitude'] = round(float(data['latitude']), 6)
            except (ValueError, TypeError):
                pass
        
        if 'longitude' in data and data['longitude']:
            try:
                data['longitude'] = round(float(data['longitude']), 6)
            except (ValueError, TypeError):
                pass
        
        # Convert province/district/sector names to IDs if they're strings
        province_obj = None
        if 'province' in data and isinstance(data['province'], str):
            try:
                province_obj = Province.objects.get(name__iexact=data['province'])
                data['province'] = province_obj.id
            except Province.DoesNotExist:
                data['province'] = None
        
        if 'district' in data and isinstance(data['district'], str):
            try:
                # If we have a province, filter by it; otherwise just by name
                if province_obj:
                    district = District.objects.get(name__iexact=data['district'], province=province_obj)
                else:
                    district = District.objects.get(name__iexact=data['district'])
                data['district'] = district.id
                # Update province_obj for sector lookup
                province_obj = district.province
            except District.DoesNotExist:
                data['district'] = None
        
        if 'sector' in data and isinstance(data['sector'], str):
            try:
                # If we have a district, filter by it; otherwise just by name
                district_obj = None
                if 'district' in data and isinstance(data['district'], int):
                    district_obj = District.objects.get(id=data['district'])
                elif 'district' in data and isinstance(data['district'], str):
                    if province_obj:
                        district_obj = District.objects.filter(name__iexact=data['district'], province=province_obj).first()
                    else:
                        district_obj = District.objects.filter(name__iexact=data['district']).first()
                
                if district_obj:
                    sector = Sector.objects.get(name__iexact=data['sector'], district=district_obj)
                else:
                    sector = Sector.objects.get(name__iexact=data['sector'])
                data['sector'] = sector.id
            except Sector.DoesNotExist:
                data['sector'] = None
        
        serializer = ServiceProviderSerializer(provider, data=data, partial=partial)
        if serializer.is_valid():
            updated_provider = serializer.save(updated_by=request.user)
            return Response(ServiceProviderSerializer(updated_provider).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except ServiceProvider.DoesNotExist:
        return Response(
            {"error": "Service provider not found"},
            status=status.HTTP_404_NOT_FOUND
        )


@extend_schema(
    tags=["Admin"],
    responses={204: dict, 404: dict}
)
@api_view(["DELETE"])
@permission_classes([AllowAny])
def delete_service_provider(request, pk):
    """Delete a service provider"""
    try:
        provider = ServiceProvider.objects.get(pk=pk)
        provider.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except ServiceProvider.DoesNotExist:
        return Response(
            {"error": "Service provider not found"},
            status=status.HTTP_404_NOT_FOUND
        )
