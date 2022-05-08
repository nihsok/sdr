const y0 = 50
const yr = 200
const ymin = 0
const ymax = 12000
let realy = (y) => y0+yr-yr*(y-ymin)/(ymax-ymin)

function plot(id,xtitle,x0,xr,xmin,xmax){
  let realx = (x) => x0+xr*(x-xmin)/(xmax-xmin)
  var cv2d = document.getElementById(id).getContext('2d')
  cv2d.font = "15px Arial"
  cv2d.save()
  //background
  // cv2d.fillStyle = '#ffffff'
  // cv2d.beginPath()
  // cv2d.rect(0,0,200,300)
  // cv2d.fill()
  // cv2d.restore()
  //viewport
  cv2d.beginPath()
  cv2d.rect(x0,y0,xr,yr)
  cv2d.stroke()
  //x axis
  for (let x = xmin; x <= xmax; x+=10){
    cv2d.beginPath()
    cv2d.moveTo(realx(x),y0+yr)
    cv2d.lineTo(realx(x),y0+yr-5)
    cv2d.stroke()
  }
  for (let x = xmin; x <= xmax-10; x+=50){
    cv2d.beginPath()
    cv2d.moveTo(realx(x),y0+yr)
    cv2d.lineTo(realx(x),y0+yr-10)
    cv2d.stroke()
    cv2d.fillText(x,realx(x)-10,y0+yr+20)
  }
  cv2d.fillText(xtitle,80,y0+yr+35)
  //y axis
  for (let y = ymin; y <= ymax; y+=500){
    cv2d.beginPath()
    cv2d.moveTo(x0  ,realy(y))
    cv2d.lineTo(x0+5,realy(y))
    cv2d.stroke()
  }
  for (let y = ymin; y <= ymax; y+=2000){
    cv2d.beginPath()
    cv2d.moveTo(x0   ,realy(y))
    cv2d.lineTo(x0+10,realy(y))
    cv2d.stroke()
    cv2d.fillText(y/1000,x0-22,realy(y)+5)
  }
  cv2d.rotate(-0.5*Math.PI)
  cv2d.fillText('Altitude [km]',-200,15)
  cv2d.restore()

  //mark
  for(let i = 0; i < hex.length; i++){
    cv2d.fillStyle = '#'+hex[i]
    cv2d.beginPath()
    cv2d.arc(realx(temp[i]),realy(alt[i]),5*Math.exp(-0.01*dist[i]),0,Math.PI*2)
    cv2d.fill()
  }
}
window.addEventListener("load",function(){
  plot('temperature','Temperature [K]',50,150,150,300)
})
