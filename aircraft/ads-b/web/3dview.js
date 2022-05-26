window.addEventListener('DOMContentLoaded',()=>{
  const width = window.innerWidth
  const height = 500
  const earthradius = 637.1//10km
  const zfactor = 10

  const canvasElement = document.querySelector('#myCanvas')
  const renderer = new THREE.WebGLRenderer({
    canvas: canvasElement
  })
  renderer.setSize(width,height)

  const scene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera(45,width/height)
  camera.position.set(0,0,800)//もっといい位置に置くか、読み込み時に回転させる

  const controls = new THREE.OrbitControls(camera,canvasElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.2

  const light = new THREE.AmbientLight(0xFFFFFF,1.0)
  scene.add(light)

  const material = new THREE.MeshStandardMaterial({
    map:new THREE.TextureLoader().load('./lib/land_shallow_topo_2048.jpg')
  })
  const geometry = new THREE.SphereGeometry(earthradius,20,20)
  const earth = new THREE.Mesh(geometry,material)
  scene.add(earth)

  const loader = new THREE.FileLoader().load('./data.csv',(data)=>{
    const points=[]
    const rows = data.split('\n')
    for (const row of rows){
      const values = row.split(',')
      if(values[0]>2){
        const r = earthradius+values[1]/10000*zfactor
        const longitude = -values[2]*Math.PI/180
        const latitude = values[3]*Math.PI/180

        const x = Math.cos(latitude)*Math.cos(longitude)*r
        const y = Math.sin(latitude)*r
        const z = Math.cos(latitude)*Math.sin(longitude)*r
        points.push(x,y,z)
      }
    }
    const geometry = new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(points,3))
    const material = new THREE.PointsMaterial({size:2,color:0xffffff})
    const mesh=new THREE.Points(geometry,material)
    scene.add(mesh)
  })

  tick()
  function tick(){
    controls.update()
    renderer.render(scene,camera)
    requestAnimationFrame(tick)
  }
})