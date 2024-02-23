#!/bin/bash
#add */30 * * * * cd ~/sdr/aircraft/ads-b/; bash watch.sh on your cron setting
mkdir -p /tmp/dump1090-fa
for i in {0..119};do
  jsonfile=/run/dump1090-fa/history_$i.json
  if [[ -e $jsonfile ]];then
    [[ $jsonfile -nt /tmp/dump1090-fa/history_$i.csv ]] && python3 reform.py $jsonfile
    [[ $jsonfile -ot                        watch.sh ]] && python3 reform.py $jsonfile #only after update reform.py
  fi
done

echo 'flag,alt,lon,lat,gs_x,gs_y,u,v,vt_x,vt_y,tas,t,mach,cas,ias,roll,p,dist,flight,squawk,category,version,hex,time' > web/data.csv
cat /tmp/dump1090-fa/history_*.csv | sort -g >> web/data.csv
echo 'flag,alt,lon,lat,gs_x,gs_y,u,v,vt_x,vt_y,tas,t,mach,cas,ias,roll,p,dist,flight,squawk,category,version,hex,time' | cat - /tmp/dump1090-fa/history_*.csv | sort -g | curl http://localhost/~$USER/web/upload.php -X POST -F 'file=data.csv' -F data=@-

echo 'hex,z1,z2,t1,t2,p1,p2,theta1,theta2,dpdz,dtdz,dvdz_square' > web/dz.csv
for hex in $(cut -d , -f 23 /tmp/dump1090-fa/history_*.csv | sort | uniq -d);do
  grep -h $hex /tmp/dump1090-fa/history_*.csv | sort -k 23 | python3 dz.py >> web/dz.csv
done
# For offline analysis, replace ${path}/history_*.csv with web/data.csv. It uses file I/O.

yyyymmdd=`date +"%Y%m%d" -d '-1 hour'`
hh=`date +"%H" -d '-1 hour'`
mkdir -p /tmp/dumpvdl2/
echo 'pattern,time,alt,lon,lat,u,v,t,code' > /tmp/dumpvdl2/${yyyymmdd}$hh.csv
python vdl2_decode.py /tmp/vdl2_${yyyymmdd}_$hh.json | sort | uniq >>  /tmp/dumpvdl2/${yyyymmdd}$hh.csv
