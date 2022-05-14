#!/bin/bash
#add */30 * * * * cd ~/sdr/aircraft/ads-b/; bash watch.sh on your cron setting
path='/tmp/dump1090-fa/'
for i in {0..119};do
  if [[ ${path}history_$i.json -nt ${path}history_$i.csv ]];then
    python3 reform.py ${path}history_$i.json
  fi
done
#/tmp/にしたいが、シンボリックリンクだと今のところ読めない?
echo 'flag,lon,lat,alt,t,u,v,p,tas,gs,heading,track,dist,hex,flight,version,category' > web/data.csv
cat ${path}history_*.csv | sort -n | uniq >> web/data.csv
