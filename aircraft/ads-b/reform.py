import json
import sys
path='/tmp/dump1090-fa/'
file=sys.argv[1]
output={'count':{'withmet':0,'womet':0},'data':[]}
input=json.load(open(path+file,'r'))['aircraft']

for aircraft in input:
  if ('mach' in aircraft) & ('tas' in aircraft) & ('lon' in aircraft) & ('lat' in aircraft):#一部欠けていることもある
    output['count']['withmet']+=1
    output['data'].append({'hex':aircraft['hex'],'lon':aircraft['lon'],'lat':aircraft['lat'],'alt':aircraft['alt_geom']*0.3048,'temperature':(aircraft['tas']*0.51444)**2/(401.8*aircraft['mach']**2)})
  else:
    output['count']['womet']+=1

with open(path+'conv_'+file,'w') as file:
  json.dump(output,file)