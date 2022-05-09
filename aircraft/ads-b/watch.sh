#!/bin/bash

#add */30 * * * * cd ~/sdr/aircraft/ads-b/; bash watch.sh on your cron setting

path='/tmp/dump1090-fa/'
for i in {0..119};do
  if [[ ${path}history_$i.json -nt ${path}conv_history_$i.json ]];then
    python3 reform.py history_$i.json
  fi
done

cat 'flag,hex,flight,lon,lat,alt,t,u,v,ws,wd,p' > data.csv 
cat ${path}history_*.csv >> data.csv