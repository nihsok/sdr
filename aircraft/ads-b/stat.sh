#!/bin/bash
#add 5 * * * * cd ~/sdr/aircraft/ads-b/web;bash ../stat.sh on your cron setting

f0=`grep -c "^0," /tmp/dump1090-fa/data.csv`
f1=`grep -c "^1," /tmp/dump1090-fa/data.csv`
f3=`grep -c "^3," /tmp/dump1090-fa/data.csv`
f7=`grep -c "^7," /tmp/dump1090-fa/data.csv`
f15=`grep -c "^15," /tmp/dump1090-fa/data.csv`

[[ -e stat.csv ]] || echo 'time,little,alt,latlon,u,t' > stat.csv

echo `date +"%FT%H:00" -d "-1 hour"`,$f0,$f1,$f3,$f7,$f15 >> stat.csv
