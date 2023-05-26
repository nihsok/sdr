import sys
import json
#import csv
import re
import math

with open(sys.argv[1]) as f:
	for line in f:
		data = json.loads(line)['vdl2']['avlc']
		if ('acars' in data and 'msg_text' in data['acars']):
			if ( result := re.findall(r"[ \d]{2}\d00[NS]\d{5}[EW]\d{10}[- ][- \d]\d{4} [ \d]\d",data['acars']['msg_text']) ): #pattern 0
				for code in result:
					wind_d = int(code[25:28]) * math.pi/180 #deg->radian
					wind_s = int(code[28:31]) * 0.51444 #kt->m/s
					print('0', code[18:20]+':'+code[20:22], int(code[0:5]) * 0.3048, \
						( -1 if code[ 5]=='S' else 1 ) * int(code[6:8]) + int(code[8:11])*0.1 /60*100, \
						( -1 if code[11]=='W' else 1 ) * int(code[12:15]) + int(code[15:18])*0.1 /60*100, \
						-wind_s * math.sin(wind_d), -wind_s * math.cos(wind_d), \
						int(code[22:25]) + 273.15, code, sep=',')
			elif ( result := re.findall(r"[NS]\d{5}[EW]\d{15}[- ][- \d]\d[ \d]{2}\d [ \d]\d",data['acars']['msg_text']) ): #pattern 1
				for code in result:
					wind_d = int(code[25:28]) * math.pi/180 #deg->radian
					wind_s = int(code[28:31]) * 0.51444 #kt->m/s
					print('1', code[13:15]+':'+code[15:17], int(code[17:22]) * 0.3048,\
						( -1 if code[0]=='S' else 1 ) * int(code[1:3]) + int(code[3:6])*0.1 /60*100, \
						( -1 if code[6]=='W' else 1 ) * int(code[7:10]) + int(code[10:13])*0.1 /60*100, \
						-wind_s * math.sin(wind_d), -wind_s * math.cos(wind_d), \
						int(code[22:25]) + 273.15, code, sep=',')
			elif ( result := re.findall(r"[NS]\d{5}[EW]\d{15}[ M]\d{2}\d{3}\d{3}",data['acars']['msg_text']) ): #pattern 1.5
				for code in result:
					wind_d = int(code[25:28]) * math.pi/180
					wind_s = int(code[28:31]) * 0.51444
					print('1.5', code[13:15]+':'+code[15:17], int(code[17:22]) * 0.3048,\
						( -1 if code[0]=='S' else 1 ) * int(code[1:3]) + int(code[3:6])*0.1 /60*100, \
						( -1 if code[6]=='W' else 1 ) * int(code[7:10]) + int(code[10:13])*0.1 /60*100, \
						-wind_s * math.sin(wind_d), -wind_s * math.cos(wind_d), \
						( -1 if code[22]=='M' else 1 ) * int(code[23:25]) + 273.15, code, sep=',')
			elif ( result := re.findall(r"W[NS]\d{5}[EW]\d{12} [ \d]\d{4}[- ][- \d]\d[ \d}{2}\d [ \d]{2}\d \d{5}",data['acars']['msg_text']) ): #pattern 2
				for code in result:
					wind_d = int(code[30:33]) * math.pi/180
					wind_s = int(code[33:36]) * 0.51444
					print('2', code[14:16]+':'+code[16:18]+':'+code[18:20], int(code[20:26]) * 0.3048,\
						( -1 if code[1]=='S' else 1 ) * int(code[2:4]) + int(code[4:7])*0.1 /60*100, \
						( -1 if code[7]=='W' else 1 ) * int(code[8:11]) + int(code[11:14])*0.1 /60*100, \
						-wind_s * math.sin(wind_d), -wind_s * math.cos(wind_d), \
						int(code[27:30]) + 273.15, code,sep=',')
			elif ( result := re.findall(r"W[NS]\d{5}[EW]\d{12}[ \d]\d{4}[- ][- \d]\d[ \d}{2}\d [ \d]{2}\d \d{5}",data['acars']['msg_text']) ): #pattern 2.1
				for code in result:
					wind_d = int(code[29:32]) * math.pi/180
					wind_s = int(code[32:35]) * 0.51444
					print('2.1', code[14:16]+':'+code[16:18]+':'+code[18:20], int(code[19:25]) * 0.3048,\
						( -1 if code[1]=='S' else 1 ) * int(code[2:4]) + int(code[4:7])*0.1 /60*100, \
						( -1 if code[7]=='W' else 1 ) * int(code[8:11]) + int(code[11:14])*0.1 /60*100, \
						-wind_s * math.sin(wind_d), -wind_s * math.cos(wind_d), \
						int(code[26:29]) + 273.15, code,sep=',')
			elif ( result := re.findall(r"W[NS]\d{5}[EW]\d{12}P\d{5}M\d{2}[ \d]{12}",data['acars']['msg_text']) ): #pattern 3
				for code in result:
					wind_d = int(code[29:32]) * math.pi/180
					wind_s = int(code[32:35]) * 0.51444
					print('2.1', code[21:23]+':'+code[23:25], int(code[14:20]) * 0.3048, \
						( -1 if code[1]=='S' else 1 ) * int(code[2:4]) + int(code[4:7])*0.1 /60*100, \
						( -1 if code[7]=='W' else 1 ) * int(code[8:11]) + int(code[11:14])*0.1 /60*100, \
						-wind_s * math.sin(wind_d), -wind_s * math.cos(wind_d), \
						( -1 if code[26]=='M' else 1 ) * int(code[27:29]) + 273.15, code,sep=',')
			elif ( result := re.findall(r"[NS]\d{5}[EW]\d{10}[- \dM]*$",data['acars']['msg_text']) ):
				for code in result:

					print('4','','','', '','','', code,sep=',')
