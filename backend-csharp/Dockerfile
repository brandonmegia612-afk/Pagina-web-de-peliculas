FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# copy csproj and restore
COPY *.csproj ./
COPY ./Data/Migrations ./Data/Migrations
COPY . ./
RUN dotnet restore
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish ./

# Exponer puerto 80 y configurar URL
ENV ASPNETCORE_URLS=http://+:80

VOLUME ["/app/Data"]

ENTRYPOINT ["dotnet", "IdentityWebApp.dll"]
