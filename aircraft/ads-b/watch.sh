#!/bin/bash
#add */30 * * * * cd ~/sdr/aircraft/ads-b/; bash watch.sh on your cron setting
mkdir -p /tmp/dump1090-fa
for i in {0..119};do
  jsonfile=/run/dump1090-fa/history_$i.json
  if [[ -e $jsonfile ]];then
    [[ $jsonfile -nt /tmp/dump1090-fa/history_$i.csv ]] && python3 reform.py $jsonfile
    [[ $jsonfile -ot                        watch.sh ]] && python3 reform.py $jsonfile #only after update
  fi
done

echo 'flag,alt,lon,lat,gs_x,gs_y,u,v,vt_x,vt_y,tas,t,mach,cas,ias,p,dist,flight,squawk,category,version,hex,time' > web/data.csv
cat /tmp/dump1090-fa/history_*.csv | sort -g >> web/data.csv

echo 'hex,z1,z2,t1,t2,p1,p2,theta1,theta2,dpdz,dtdz,dvdz_square' > web/dz.csv
for hex in $(cut -d , -f 22 /tmp/dump1090-fa/history_*.csv | sort | uniq -d);do
  grep -h $hex /tmp/dump1090-fa/history_*.csv | sort -k 22 | python3 dz.py >> web/dz.csv
done
# For offline analysis, replace ${path}/history_*.csv with web/data.csv. It uses file I/O.