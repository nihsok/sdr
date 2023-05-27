Promise.all([
  d3.csv("./data.csv"),
  d3.csv("./vdl2.csv")
]).then(([data,vdl2])=>{
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

  const t_vt = d3.select("#check-t")
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
      .axisBottom(x.domain([130,270]))
      .tickValues(d3.range(130,271,10))
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
      .tickValues(d3.range(130,270,10))
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
  t_vt.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3
      .axisBottom(x.domain([280,320]))
      .tickValues(d3.range(280,320,5))
      .tickFormat((val) => val % 10 == 0 ? val.toString() : ''))
    .style("font-size",20)
    .append("text")
    .attr("fill","black")
    .attr("text-anchor","middle")
    .attr("x", width / 2 )
    .attr("y", 40)
    .text("T or virtual T (+0.007z)[K]")
  t_vt.append("g")
    .call(d3
      .axisTop(x)
      .tickValues(d3.range(280,320,5))
      .tickFormat(''))
  //y axis
  t_vt.append("g")
    .call(d3
      .axisLeft(y.domain([0,15000]))
      .tickValues(d3.range(0,15000,1000))
      .tickFormat(val => val % 2000 == 0 ? (val/1000).toString() : ''))
    .style("font-size",20)
    .append("text")
      .attr("fill", "black")
      .attr("x",  - height / 2 + 160)
      .attr("y", -50)
      .attr("transform","rotate(-90)")
      .text('Altitude [km]/Mixing ratio [g/kg]')
  t_vt.append("g")
    .attr('transform',"translate(" + width + ",0)")
    .call(d3
      .axisRight(y)
      .tickValues(d3.range(0,15000,1000))
      .tickFormat(''))

  t_vt.selectAll("dot")
    .data(data.filter(d => d.t))
    .enter()
    .append("circle")
      .attr("cx", d => x(Number(d.t)+273.15+0.007*Number(d.alt)))
      .attr("cy", d => y(d.alt))
      .attr("r", 2)
      .style("fill", d => '#'+d.hex)
      .style("opacity", 0.5)
    .on("mouseover",function(event,d){
      d3.select(event.target).style("opacity",1)
      tooltip
        .style("visibility","visible")
        .html('z: '+Math.round(d.alt)/1000+"km<br>T: "+Math.round((Number(d.t)+273.15)*100)/100+'K')
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

  t_vt.selectAll("dot")
    .data(vdl2.filter(d => d.t))
    .enter()
    .append("circle")
      .attr("cx", d => x(Number(d.t)+0.007*Number(d.alt)))
      .attr("cy", d => y(d.alt))
      .attr("r", 2)
      .style("opacity", 0.5)
    .on("mouseover",function(event,d){
      d3.select(event.target).style("opacity",1)
      tooltip
        .style("visibility","visible")
        .html('z: '+Math.round(d.alt)/1000+"km<br>T: "+Math.round(Number(d.t)*100)/100+'K')
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

  t_vt.selectAll(null)
    .data(d3.range(280,320,5))
    .enter()
    .append("line")
    .attr("x1",d=>x(d))
    .attr("y1",y(0))
    .attr("x2",d=>x(d*(1+0.61*0.015)))
    .attr("y2",y(15000))
    .attr("clip-path","url(#clip-t)")
    .style("stroke","black")
    .style("opacity",0.1)
    .on("mouseover",function(event,d){
        d3.select(event.target).style("opacity",1)
        tooltip
          .style("visibility","visible")
          .html('')
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
})
