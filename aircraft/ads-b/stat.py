#add 0,30 * * * * cd ~/sdr/aircraft/ads-b/web; python3 ../stat.py on your cron setting
import json
path='/tmp/dump1090-fa/'
hex=[]
lon=[]
lat=[]
alt=[]
temp=[]
dist=[]
for i in range(199):
  try:
    input=json.load(open(path+'conv_history_'+str(i)+'.json','r'))['data']
    for data in input:
      hex.append(data['hex'])
      lon.append(data['lon'])
      lat.append(data['lat'])
      alt.append(data['alt'])
      temp.append(data['temperature'])
  except FileNotFoundError as e:
    pass
  
dist = [0 for i in hex] #to be filled by real value

with open('data.js','w') as f: #ここも/tmp/にしたいが、シンボリックリンクだと今のところ読めない
  f.write('const hex = ['+','.join(["'"+i+"'" for i in hex])+']\n')
  f.write('const lon = ['+','.join([str(i) for i in lon])+']\n')
  f.write('const lat = ['+','.join([str(i) for i in lat])+']\n')
  f.write('const alt = ['+','.join([str(i) for i in alt])+']\n')
  f.write('const temp = ['+','.join([str(i) for i in temp])+']\n')
  f.write('const dist = ['+','.join([str(i) for i in dist])+']\n')

#全体的に冗長な気がする
