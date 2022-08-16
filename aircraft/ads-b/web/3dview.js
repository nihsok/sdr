window.addEventListener('DOMContentLoaded',()=>{
  const width = window.innerWidth
  const height = 700
  const earthradius = 637.1//10km
  const flattening = 1 - 1/298.257222101

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

  const material = new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load('./lib/land_shallow_topo_8192.jpg')
    //https://visibleearth.nasa.gov/images/57752/blue-marble-land-surface-shallow-water-and-shaded-topography
  })
  const geometry = new THREE.SphereGeometry(earthradius,20,20)
  const earth = new THREE.Mesh(geometry,material)
  scene.add(earth)
  earth.scale.set(1,flattening,1)

  // function vertex([longitude, latitude], radius) {
  //   const lambda = (longitude * Math.PI) / 180;
  //   const phi = (latitude * Math.PI) / 180;
  //   return new THREE.Vector3(
  //     radius * Math.cos(phi) * Math.cos(lambda),
  //     radius * Math.sin(phi),
  //     -radius * Math.cos(phi) * Math.sin(lambda)
  //   );
  // }

  // function wireframe(multilinestring,radius, material) {
  //   var geometry = new THREE.BufferGeometry()
  //   geometry.vertices=[]
  //   for (const P of multilinestring.coordinates) {
  //     for (let p0, p1 = vertex(P[0], radius), i = 1; i < P.length; ++i) {
  //       geometry.vertices.push(p0 = p1, p1 = vertex(P[i], radius));
  //     }
  //   }
  //   return new THREE.LineSegments(geometry,material)
  // }
  // d3.json("https://unpkg.com/world-atlas@1.1.4/world/110m.json").then(function(topology){
  //   console.log(topology)
  //   const mesh = topojson.mesh(topology, topology.objects.land);
  //   scene.add( wireframe(
  //     mesh,
  //     600,
  //     new THREE.LineBasicMaterial({
  //       color: new THREE.Color('blue'),
  //       linewidth: 10,
  //     })
  //   ))
  // }).catch(error => console.log(error))

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
            new THREE.Vector3().setFromSphericalCoords(r,phi,theta),
            wind.length() * 0.02,//parameter
            color(values[12]),
            0.2,//headlength
            0.1//headwidth
          )
          scene.add(arrow)
        }else{
          p.push(new THREE.Vector3().setFromSphericalCoords(r,phi,theta))
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