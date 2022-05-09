import json
import sys
import csv
file=sys.argv[1]
output=[]
input=json.load(open(file,'r'))['aircraft']

for aircraft in input:
  tmp = [0,aircraft['hex']]+['']*10
  if ('alt_geom' in aircraft):
    tmp[0] += 1
    if ('flight' in aircraft):
      tmp[2] = aircraft['flight']
    if ('mach' in aircraft) & ('tas' in aircraft) &('alt_geom' in aircraft):#一部欠けていることもある
      tmp[0] += 4
      tmp[5] = aircraft['alt_geom']*0.3048 #ft->m
      tmp[6] = (aircraft['tas']*0.51444)**2/(401.8*aircraft['mach']**2)-273.15
    if ('lon' in aircraft) & ('lat' in aircraft):
      tmp[0] += 2
      tmp[3] = aircraft['lon']
      tmp[4] = aircraft['lat']
      if ('gs' in aircraft) & ('track' in aircraft):
        tmp[0] +=8
        #calculate wind
        tmp[7] = 0
        tmp[8] = 0
        tmp[9] = 0
        tmp[10] = 0
  output.append(tmp)

with open(file.split('.')[0]+'.csv','w') as f:
  writer = csv.writer(f,lineterminator='\n')
  writer.writerows(output)

#flag,hex,flight,lon,lat,alt,temperature,zonal wind,mediridional wind,wind speed,wind direction,pressure?
#flag 8:wind
#flag 4:temperature
#flag 2:lat,lon
#falg 1:alt
#flag 0:no data