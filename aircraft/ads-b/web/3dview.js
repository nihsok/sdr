window.addEventListener('DOMContentLoaded',()=>{
  const width = window.innerWidth
  const height = 700
  const earthradius = 637.8137 //10km
  const flattening = 1 - 1/298.257222101 //GRS80

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

  const light = new THREE.AmbientLight(0xFFFFFF,1.0)
  scene.add(light)

  d3.json("./lib/countries-50m.json").then((topology)=>{
    //https://unpkg.com/world-atlas@2.0.2/countries-50m.json
    const material = new THREE.LineBasicMaterial({color:0x7f878f})
    for (const path of topology.arcs){
      const points = []
      let lon = 0, lat = 0
      for (const p of path){
        const longitude = (lon += p[0]) * topology.transform.scale[0] + topology.transform.translate[0]
        const latitude  = (lat += p[1]) * topology.transform.scale[1] + topology.transform.translate[1] 
        const phi   = (90-            latitude )*Math.PI/180 //colatitude
        const theta = (90+parseFloat(longitude))*Math.PI/180 //+90 shift
        points.push(new THREE.Vector3().setFromSphericalCoords(earthradius,phi,theta).multiply(new THREE.Vector3(1,flattening,1)))
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      const line = new THREE.Line(geometry,material)
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

  const loader = new THREE.FileLoader().load('./data.csv',(data)=>{
    const p=[]
    for (const row of data.split('\n')){
      const values = row.split(',')
      if(values[0] > 2){
        const r = earthradius + values[1]/10000 * 2//parameter
        const phi   = (90-           values[3] )*Math.PI/180 //colatitude
        const theta = (90+parseFloat(values[2]))*Math.PI/180 //+90 shift

        if(values[0] > 6){
          const x = - values[5]*Math.cos(phi)*Math.sin(theta) + values[4]*Math.cos(theta)
          const y =   values[5]*Math.sin(phi)
          const z = - values[5]*Math.cos(phi)*Math.cos(theta) - values[4]*Math.sin(theta) 
          const wind  = new THREE.Vector3().set(x,y,z)
          const arrow = new THREE.ArrowHelper(
            wind.clone().normalize(),
            new THREE.Vector3().setFromSphericalCoords(r,phi,theta).multiply(new THREE.Vector3(1,flattening,1)),
            wind.length() * 0.02,//parameter
            color(values[12]),
            0.2,//headlength
            0.1//headwidth
          )
          scene.add(arrow)
        }else{
          p.push(new THREE.Vector3().setFromSphericalCoords(r,phi,theta).multiply(new THREE.Vector3(1,flattening,1)))
        }
      }
    }
    const points = new THREE.Points(
      new THREE.BufferGeometry().setFromPoints(p),
      new THREE.PointsMaterial({color:0x7f878f,size:0.1})
    )
    scene.add(points)
  })

  tick()
  function tick(){
    controls.update()
    renderer.render(scene,camera)
    requestAnimationFrame(tick)
  }
})