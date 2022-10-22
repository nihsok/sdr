#!/bin/bash
#add */30 * * * * cd ~/sdr/aircraft/ads-b/; bash watch.sh on your cron setting
path='/tmp/dump1090-fa/'
for i in {0..119};do
  [[ ${path}history_$i.json -nt ${path}history_$i.csv ]] && python3 reform.py ${path}history_$i.json
  [[ ${path}history_$i.json -ot              watch.sh ]] && python3 reform.py ${path}history_$i.json #only after update
done

echo 'flag,alt,lon,lat,gs_x,gs_y,u,v,vt_x,vt_y,tas,t,mach,cas,p,ias,dist,flight,version,category,hex,time' > web/data.csv
cat ${path}history_*.csv | sort -g | uniq >> web/data.csv
