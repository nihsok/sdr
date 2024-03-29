window.addEventListener('DOMContentLoaded',()=>{
  const width = window.innerWidth
  const height = 700
  const earthradius = 637.8137 //10km
  const flattening = 1 - 1/298.257223563 //WGS84

  const canvasElement = document.querySelector('#myCanvas')
  const renderer = new THREE.WebGLRenderer({canvas: canvasElement})
  renderer.setSize(width,height)

  const scene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera(45,width/height)
  camera.position.set(-450,450,-450)//parameter

  const controls = new THREE.OrbitControls(camera,canvasElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.2
  controls.rotateSpeed = 0.02
  controls.zoomSpeed = 0.1
  controls.panSpeed = 0.1

  const light = new THREE.AmbientLight(0xffffff,1.0)
  scene.add(light)

  function latlon2Vector(latitude,longitude,alt=0){
    const phi   = (90-            latitude )*Math.PI/180 //colatitude
    const theta = (90+parseFloat(longitude))*Math.PI/180 //+90 shift
    return new THREE.Vector3().setFromSphericalCoords(earthradius+alt,phi,theta).multiply(new THREE.Vector3(1,flattening,1))
  }

  d3.json("./lib/countries-50m.json").then(topology=>{
    //https://unpkg.com/world-atlas@2.0.2/countries-50m.json
    topology.arcs.forEach((path,index)=>{
      if( index >= 987 && index <= 1020){return} //exclude Japan
      let lon = 0, lat = 0
      const points=path.map(p=>{
        const longitude = (lon += p[0]) * topology.transform.scale[0] + topology.transform.translate[0]
        const latitude  = (lat += p[1]) * topology.transform.scale[1] + topology.transform.translate[1] 
        return latlon2Vector(latitude,longitude)
      })
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      const line = new THREE.Line(geometry,new THREE.LineBasicMaterial({color:0x7f878f}))
      scene.add(line)
    })
  }).catch(error => console.log(error))

  d3.json("./lib/prefectures.json").then(topology=>{
    //https://raw.githubusercontent.com/smartnews-smri/japan-topography/main/data/municipality/topojson/s0001/prefectures.json
    for(const path of topology.arcs){
      //const points=[]
      let lon = 0, lat = 0
      const points=path.map(p=>{
        const longitude = (lon += p[0]) * topology.transform.scale[0] + topology.transform.translate[0]
        const latitude  = (lat += p[1]) * topology.transform.scale[1] + topology.transform.translate[1]
        return latlon2Vector(latitude,longitude)
      })
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      const line = new THREE.Line(geometry,new THREE.LineBasicMaterial({color:0x7f878f}))
      scene.add(line)
    }
  }).catch(error => console.log(error))

  const material = new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load('./lib/land_shallow_topo_2048.jpg'),
    //https://visibleearth.nasa.gov/images/57752/blue-marble-land-surface-shallow-water-and-shaded-topography
  })
  const geometry = new THREE.SphereGeometry(earthradius,100,100)
  const earth = new THREE.Mesh(geometry,material)
  scene.add(earth)
  earth.scale.set(1,flattening,1)

  const color = t => {
    if     ( t == ""  ){ return 0x7f878f }
    else if( t <= -55 ){ return 0x30015f }
    else if( t <= -50 ){ return 0x0000fa }
    else if( t <= -45 ){ return 0x027ff0 }
    else if( t <= -40 ){ return 0x26aebc }
    else if( t <= -35 ){ return 0x34cca4 }
    else if( t <= -30 ){ return 0xc0da80 }
    else if( t <= -25 ){ return 0xecec00 }
    else if( t <= -20 ){ return 0xeba20f }
    else if( t <= -15 ){ return 0xea691a }
    else               { return 0xd20000 }
  }//https://www.iaud.net/activity/2871/

  const loader = new THREE.FileLoader().load('open_tmp.php?file=data.csv',(data)=>{
    const p=[]
    for (const row of data.split('\n')){
      const [flag,alt,lon,lat,,,u,v,,,,t] = row.split(',')
      if(flag > 2){
        const alt2 = alt / 10000 * 2 //parameter
        if(flag > 6){
          const phi   = ( 90 -            lat ) * Math.PI/180 //colatitude
          const theta = ( 90 + parseFloat(lon)) * Math.PI/180 //+90 shift
          const x = - v*Math.cos(phi)*Math.sin(theta) + u*Math.cos(theta)
          const y =   v*Math.sin(phi)
          const z = - v*Math.cos(phi)*Math.cos(theta) - u*Math.sin(theta)
          const wind  = new THREE.Vector3().set(x,y,z)
          const arrow = new THREE.ArrowHelper(
            wind.clone().normalize(),
            latlon2Vector(lat,lon,alt2),
            wind.length() * 0.015, //parameter
            color(t),
            0.2, //headlength
            0.1 //headwidth
          )
          scene.add(arrow)
        }else{
          p.push(latlon2Vector(lat,lon,alt2))
        }
      }
    }
    const points = new THREE.Points(
      new THREE.BufferGeometry().setFromPoints(p),
      new THREE.PointsMaterial({color:0x7f878f,size:0.1})
    )
    scene.add(points)
  })

  const flock = {}

  const airport = new THREE.FileLoader().load('./lib/gadb_declatlon.csv',(data)=>{
    //https://www.partow.net/miscellaneous/airportdatabase/
    const p=data.split('\n').flatMap(row=>{
      const values = row.split(',')
      return  latlon2Vector(values[0],values[1],2)
    })
    const canvas = document.createElement('canvas')
    canvas.width=70
    canvas.height=70
    canvas.getContext('2d').font=`50px serif`
    canvas.getContext('2d').fillText('🛫',0,45)
    const texture=new THREE.CanvasTexture(canvas)
    flock.airport = new THREE.Points(
      new THREE.BufferGeometry().setFromPoints(p),
      new THREE.PointsMaterial({size:10,transparent:true,visible:false,map:texture})
    )
    scene.add(flock.airport)
  })

  const sonde = new THREE.FileLoader().load('./lib/igra2-station-list.txt',(data)=>{
    //https://www.ncei.noaa.gov/pub/data/igra/igra2-station-list.txt
    const p=data.split('\n').flatMap(row=>{
      const values = row.match(/[^\s]+/g)
      return values.slice(-2,-1)>2020 ? latlon2Vector(values[1],values[2],3) : []
    })
    const canvas = document.createElement('canvas')
    canvas.width=70
    canvas.height=70
    canvas.getContext('2d').font=`50px serif`
    canvas.getContext('2d').fillText('🎈',0,45)
    const texture=new THREE.CanvasTexture(canvas)
    flock.sonde = new THREE.Points(
      new THREE.BufferGeometry().setFromPoints(p),
      new THREE.PointsMaterial({size:10,transparent:true,visible:false,map:texture})
    )
    scene.add(flock.sonde)
  })

  const options={
    sonde:false,
    airport:false
  }
  var gui = new dat.GUI({width:100})
  gui.close()
  gui.add(options,'sonde').onChange(value=>{ flock.sonde.material.visible = value })
  gui.add(options,'airport').onChange(value=>{ flock.airport.material.visible = value })
  document.getElementById('control').append(gui.domElement)

  tick()
  function tick(){
    controls.update()
    renderer.render(scene,camera)
    requestAnimationFrame(tick)
  }
})
