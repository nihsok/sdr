import json
import math
import sys
import csv
import numpy as np
from scipy.interpolate import RectBivariateSpline

with open('igrfgridData.csv','r') as f:
  for i in range(16): header = next(csv.reader(f))
  z1d = [float(row[4]) for row in csv.reader(f)]
decline=RectBivariateSpline(
  np.linspace(-180,180,73), # 5 degree interval
  np.linspace(-90,85,36),   # 5 degree interval
  np.array(z1d).reshape([36,73])[::-1,:].T,
  kx=1,ky=1)

file = sys.argv[1]
output = []
allinfo = json.load( open( file , 'r' ) )
time      = allinfo['now']
aircrafts = allinfo['aircraft']

for aircraft in aircrafts:
  tmp = {'flag': 0, 'hex': aircraft['hex'], 'time': time}
  if ('lon' in aircraft): tmp['lon'] = aircraft['lon']
  if ('lat' in aircraft): tmp['lat'] = aircraft['lat']
  if ('tas' in aircraft): tmp['tas'] = aircraft['tas'] * 0.51444 #nm->m/s
  if ('ias' in aircraft): tmp['ias'] = aircraft['ias'] * 0.51444 #nm->m/s
  if ('mach' in aircraft): tmp['mach'] = aircraft['mach']
  if ('flight' in aircraft): tmp['flight'] = aircraft['flight']
  if ('version' in aircraft): tmp['version'] = aircraft['version']
  if ('category' in aircraft): tmp['category'] = aircraft['category']
  if ('alt_geom' in aircraft):
    tmp['flag'] += 1
    tmp['alt'] = aircraft['alt_geom'] * 0.3048 #ft->m
    if ('alt_baro' in aircraft):
      if (tmp['alt'] < 11019):
        tmp['p'] = 101325 * ( 1 - 0.0065 * aircraft['alt_baro'] * 0.3048 / 288.15 ) ** ( 9.80665 / ( 287 * 0.0065 ) )
      else:
        tmp['p'] =  22632 * math.exp( ( 11019 - aircraft['alt_baro'] * 0.3048 ) * 9.80665 / ( 287 * 216.65 ) )
      if ('mach' in aircraft):
        delta = tmp['p'] / 101325
        tmp['cas'] = 340.5 * tmp['mach'] * math.sqrt(delta) * ( 1 + ( 1 - delta ) / 8 * tmp['mach'] ** 2 + ( 1 - 10 * delta + 9 * delta ** 2 ) * 3 / 640 * tmp['mach'] ** 4 )
    if ('mach' in aircraft) and ('tas' in aircraft):
      tmp['flag'] += 8
      tmp['t'] = tmp['tas'] ** 2 / ( 401.8 * tmp['mach'] ** 2 ) - 273.15
    if ('lon' in aircraft) and ('lat' in aircraft):
      tmp['flag'] += 2
      tmp['dist'] = 0
      if ('gs' in aircraft) and ('track' in aircraft):
        aircraft['gs'] *= 0.51444 #nm->m/s
        tmp['gs_x'] = aircraft['gs'] * math.sin(aircraft['track'] * math.pi / 180)
        tmp['gs_y'] = aircraft['gs'] * math.cos(aircraft['track'] * math.pi / 180)
      if ('tas' in aircraft) and (tmp['lat'] <= 85) and (('mag_heading' in aircraft) or ('nav_heading' in aircraft) and (aircraft['nav_heading'] > 0)):
        heading = aircraft['mag_heading'] if ('mag_heading' in aircraft) else aircraft['nav_heading']
        heading += decline.ev(tmp['lon'],tmp['lat'])
        tmp['vt_x'] = tmp['tas'] * math.sin(heading * math.pi / 180)
        tmp['vt_y'] = tmp['tas'] * math.cos(heading * math.pi / 180)
      if ('vt_x' in tmp) and ('gs_x' in tmp):
        tmp['flag'] += 4
        tmp['u'] = tmp['gs_x'] - tmp['vt_x']
        tmp['v'] = tmp['gs_y'] - tmp['vt_y']
  output.append(tmp)

with open(file.split('.')[0]+'.csv','w') as f:
  writer = csv.DictWriter(f,['flag','alt','lon','lat','gs_x','gs_y','u','v','vt_x','vt_y','tas','t','mach','cas','ias','p','dist','flight','category','version','hex','time'],lineterminator='\n')
  writer.writerows(output)

#flag,
#alt,lon,lat, ...position
#temperature,zonal wind,mediridional wind,pressure ...physical value
#mach,tas,cas,ias,aircraft u,aircraft v, ...verification value
#distance,hex,flight,version,category,time ...additional value
#flag 8:temperature
#flag 4:wind (needs lat, lon)
#flag 2:lat,lon
#falg 1:alt
#flag 0:no data
#dist!=0: bad quality
