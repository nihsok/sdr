#!/bin/bash
#add */30 * * * * cd ~/sdr/aircraft/ads-b/; bash watch.sh on your cron setting
path='/tmp/dump1090-fa/'
for i in {0..119};do
  if [[ ${path}history_$i.json -nt ${path}history_$i.csv ]];then
    python3 reform.py ${path}history_$i.json
  fi
done

echo 'flag,alt,lon,lat,u,v,vt_x,vt_y,gs_x,gs_y,tas,mach,t,p,dist,hex,flight,version,category' > web/data.csv
cat ${path}history_*.csv | sort -g | uniq >> web/data.csv
