import sys
rdcp = 287.0/1004

input = sys.stdin.read().splitlines()

tmp = input[0].split(',')
hex = tmp[20]
z1,u1,v1,t1,p1,time1 = [ float(tmp[i] or 0) for i in [1,6,7,11,15,21] ]
if (t1 != 0): t1 = t1 + 273.15
theta1 = t1 * (100000/p1)**rdcp if t1 > 0 else 0

for line in input:
  tmp = line.split(',')
  z2,u2,v2,t2,p2,time2 = [ float(tmp[i] or 0) for i in [1,6,7,11,15,21] ]
  if (t2 != 0): t2 = t2 + 273.15
  theta2 = t2 * (100000/p2)**rdcp if t2 > 0 else 0

  if t1 > 0 and time2 - time1 < 40 and z2 != z1:
    dpdz = (p2-p1) / (z2-z1)
    dtdz = (theta2-theta1) / (z2-z1)
    dvdz_square = ( (u2-u1)**2 + (v2-v1)**2 ) / (z2-z1)**2

    print (hex,z1,z2,t1,t2,p1,p2,theta1,theta2,dpdz,dtdz,dvdz_square,sep=',')
    #N2=g/theta{1,2}*dtdz,Ri=N2{1,2}/dvdz_square,Dw/Dt=-g-p{1,2}/RT{1,2}*dpdz
  z1,u1,v1,t1,p1,theta1,time1 = z2,u2,v2,t2,p2,theta2,time2
