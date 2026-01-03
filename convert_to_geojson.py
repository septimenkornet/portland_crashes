import pandas
import geopandas as gpd
import sys

df = pandas.read_excel(sys.argv[1])
gdf = gpd.GeoDataFrame(
    df,
    geometry=gpd.points_from_xy(df.Longitude, df.Latitude),
    crs="EPSG:4326"  # WGS84 standard CRS for lat/lon
)  
gdf['Crash Date'] = df['Crash Date'].dt.strftime('%Y-%m-%d')
print(gdf.to_json())
