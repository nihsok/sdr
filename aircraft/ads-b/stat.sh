#!/bin/bash
#add 5 * * * * cd ~/sdr/aircraft/ads-b/web;bash ../stat.sh on your cron setting

f0=`grep -c "^0," data.csv`
f1=`grep -c "^1," data.csv`
f3=`grep -c "^3," data.csv`
f7=`grep -c "^7," data.csv`
f15=`grep -c "^15," data.csv`

[[ -e stat.csv ]] || echo 'time,little,alt,latlon,u,t' >stat.csv

echo `date +"%FT%H:00" -d "-1 hour"`,$f0,$f1,$f3,$f7,$f15 >> stat.csv
