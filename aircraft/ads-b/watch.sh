#!/bin/bash

#add */10 * * * * bash ~/sdr/aircraft/ads-b/watch.sh on your cron setting

path='/tmp/dump1090-fa/'
for i in {0..119};do
  if [[ ${path}history_$i.json -nt ${path}conv_history_$i.json ]];then
    python3 reform.py history_$i.json
  fi
done