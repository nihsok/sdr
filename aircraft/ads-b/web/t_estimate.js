d3.csv("./data.csv").then(function(data){
  const margin = {top:10, right:10, bottom:45, left:75},
        width  = 405 - margin.left - margin.right,
        height = width//495 - margin.top - margin.bottom;

  const x = d3.scaleLinear().range([0, width])
  const y = d3.scaleLinear().range([height, 0])

  const svg = d3.select("#check-t")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform","translate(" + margin.left + "," + margin.top + ")")

  const hodograph = d3.select("#check-t")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform","translate(" + margin.left + "," + margin.top + ")")

  const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("background-color", "white")

  //x axis
  svg.append("g")
  .attr("transform", "translate(0," + height + ")")
    .call(d3
      .axisBottom(x.domain([140,270]))
      .tickValues(d3.range(140,271,10))
      .tickFormat((val) => val % 20 == 0 ? val.toString() : ''))
    .style("font-size",20)
    .append("text")
    .attr("fill","black")
    .attr("text-anchor","middle")
    .attr("x", width / 2 )
    .attr("y", 40)
    .text("True AirSpeed [m/s]")
  svg.append("g")
    .call(d3
      .axisTop(x)
      .tickValues(d3.range(140,270,10))
      .tickFormat(''))
  //y axis
  svg.append("g")
    .call(d3
      .axisLeft(y.domain([0.4,0.9]))
      .tickValues(d3.range(0.4,0.91,0.02))
      .tickFormat(val => Math.round(val*100) % 10 == 0 ? Math.round(val*100)/100 : ''))
    .style("font-size",20)
    .append("text")
      .attr("fill", "black")
      .attr("x",  - height / 2 + 70)
      .attr("y", -50)
      .attr("transform","rotate(-90)")
      .text('Mach number')
  svg.append("g")
    .attr('transform',"translate(" + width + ",0)")
    .call(d3
      .axisRight(y)
      .tickValues(d3.range(0.4,0.9,0.02))
      .tickFormat(''))

  svg.append("clipPath")
    .attr("id","clip-t")
    .append("rect")
      .attr("x",0)
      .attr("y",0)
      .attr("width",width)
      .attr("height",height)

  svg.selectAll(null)
    .data(d3.range(-90,1,10))
    .enter()
    .append("line")
    .attr("x1",x(0))
    .attr("y1",y(0))
    .attr("x2",d=>x(Math.sqrt(401.8*(273.15+d))))
    .attr("y2",y(1))
    .attr("clip-path","url(#clip-t)")
    .style("stroke","black")
    .style("opacity",0.1)
    .on("mouseover",function(event,d){
        d3.select(event.target).style("opacity",1)
        tooltip
          .style("visibility","visible")
          .html('T='+d+'&#8451')
      })
      .on("mousemove",function(event){
        tooltip
          .style("left", event.pageX + 15 + "px")
          .style("top", event.pageY -20 + "px")
      })
      .on("mouseout",function(event){
        d3.select(event.target).style("opacity",0.1)
        tooltip.style("visibility","hidden")
      })

  svg.selectAll("dot")
    .data(data.filter(d => d.t))
    .enter()
    .append("circle")
      .attr("cx", d => x(d.tas))
      .attr("cy", d => y(d.mach))
      .attr("r", 2)
      .style("fill", d => '#'+d.hex)
      .style("opacity", 0.5)
    .on("mouseover",function(event,d){
      d3.select(event.target).style("opacity",1)
      tooltip
        .style("visibility","visible")
        .html('Mach: '+d.mach+"<br>TAS: "+Math.round(d.tas*100)/100+'m/s<br>T: '+Math.round(d.t*100)/100+'&#8451')
    })
    .on("mousemove",function(event){
      tooltip
        .style("left", event.pageX + 15 + "px")
        .style("top", event.pageY -20 + "px")
    })
    .on("mouseout",function(event){
      d3.select(event.target).style("opacity",0.5)
      tooltip.style("visibility","hidden")
    })

  //x axis
  const xAxis = d3.axisBottom(x.domain([-100,100]))
    .tickValues(d3.range(-100,101,10))
    .tickFormat(val => val % 30 == 0 ? val : '')
  const gX = hodograph.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .style("font-size",20)
  gX.append("text")
      .attr("fill", "black")
      .attr("x", width / 2 )
      .attr("y", 40)
      .text('Zonal wind [m/s]')

  const xAxis2 = d3.axisTop(x)
    .tickValues(d3.range(-100,101,10))
    .tickFormat('')
  const gX2 = hodograph.append("g")
    .call(xAxis2)

  //y axis
  const yAxis = d3.axisLeft(y.domain([-100,100]))
    .tickValues(d3.range(-100,101,10))
    .tickFormat(val => val % 20 == 0 ? val.toString() : '')
  const gY = hodograph.append("g")
    .call(yAxis)
    .style("font-size",20)
  gY.append("text")
      .attr("fill","black")
      .attr("text-anchor","middle")
      .attr("x",  - height / 2 - margin.top)
      .attr("y", -55)
      .attr("transform","rotate(-90)")
      .text("Meridional wind [m/s]")

  const yAxis2 = d3.axisRight(y)
    .tickValues(d3.range(-100,101,10))
    .tickFormat('')
  const gY2 = hodograph.append("g")
    .attr('transform',"translate(" + width + ",0)")
    .call(yAxis2)

  const colorscale = d3.scaleLinear()
    .domain([d3.min(data.filter( d => d.alt ), d => Number(d.alt)),
             d3.max(data.filter( d => d.alt ), d => Number(d.alt))])
    .range(['#857f1e','#0022fa'])

  const dot = hodograph.selectAll("dot")
    .data(data.filter(d => d.u))
    .enter()
    .append("circle")
      .attr("cx", d => x(d.u))
      .attr("cy", d => y(d.v))
      .attr("r", 1)
      .style("fill", d => colorscale(d.alt))
      .style("opacity", 0.5)
    .on("mouseover",function(event,d){
      d3.select(event.target).style("opacity",1)
      tooltip
        .style("visibility","visible")
        .html('u: '+Math.round(d.u*100)/100+"m/s<br>v: "+Math.round(d.v*100)/100+'m/s<br>z: '+Math.round(d.alt)/1000+'km')
    })
    .on("mousemove",function(event){
      tooltip
        .style("left", event.pageX + 15 + "px")
        .style("top", event.pageY -20 + "px")
    })
    .on("mouseout",function(event){
      d3.select(event.target).style("opacity",0.5)
      tooltip.style("visibility","hidden")
    })

  const zoom=d3.zoom()
    .scaleExtent([1,8])
    .on("zoom",({transform})=>{
      dot.attr("transform",transform)
      gX.call(xAxis.scale(transform.rescaleX(x)))
      gY.call(yAxis.scale(transform.rescaleY(y)))
      gX2.call(xAxis2.scale(transform.rescaleX(x)))
      gY2.call(yAxis2.scale(transform.rescaleY(y)))
    })

  hodograph
    .call(zoom)
//    .call(zoom.transform,d3.zoomIdentity)
})