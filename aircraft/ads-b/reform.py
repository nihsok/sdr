import json
import sys
import csv
file=sys.argv[1]
output=[]
input=json.load(open(file,'r'))['aircraft']

for aircraft in input:
  tmp = {'flag': 0, 'hex': aircraft['hex']}
  if ('flight' in aircraft): tmp['flight'] = aircraft['flight']
  if ('version' in aircraft): tmp['version'] = aircraft['version']
  if ('category' in aircraft): tmp['category'] = aircraft['category']
  if ('alt_geom' in aircraft):
    tmp['flag'] += 1
    tmp['alt'] = aircraft['alt_geom']*0.3048 #ft->m
    if ('mach' in aircraft) & ('tas' in aircraft):#mach,tasがあってlatlon,altがないケースがあるか？
      tmp['flag'] += 4
      tmp['t'] = (aircraft['tas']*0.51444)**2/(401.8*aircraft['mach']**2)-273.15
    if ('lon' in aircraft) & ('lat' in aircraft):
      tmp['flag'] += 2
      tmp['lon'] = aircraft['lon']
      tmp['lat'] = aircraft['lat']
      if ('gs' in aircraft) & ('track' in aircraft):
        tmp['flag'] +=8
        #calculate wind
        tmp['u'] = 0
        tmp['v'] = 0
  output.append(tmp)

with open(file.split('.')[0]+'.csv','w') as f:
  writer = csv.DictWriter(f,['flag','lon','lat','alt','t','u','v','p','tas','gs','heading','track','dist','hex','flight','version','category'],lineterminator='\n')
  writer.writerows(output)

#flag,
#lon,lat,alt,temperature,zonal wind,mediridional wind, ...physical value
#pressure,tas,gs,true heading,true track, ...semi-physical value
#distance,hex, ...additional value
#flight,version,category ...status value
#flag 8:wind
#flag 4:temperature
#flag 2:lat,lon
#falg 1:alt
#flag 0:no data
