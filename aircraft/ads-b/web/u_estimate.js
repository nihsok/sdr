d3.csv("open_tmp.php?file=data.csv").then(function(data){
  const margin = {top:10, right:10, bottom:45, left:75},
        width  = 405 - margin.left - margin.right,
        height = width//495 - margin.top - margin.bottom;

  const x = d3.scaleLinear().range([0, width])
  const y = d3.scaleLinear().range([height, 0])

  const svg = d3.select("#check-u")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform","translate(" + margin.left + "," + margin.top + ")")

  const vdeg = d3.select("#check-u")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform","translate(" + margin.left + "," + margin.top + ")")

  const roll = d3.select("#check-u")
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
      .axisBottom(x.domain([-350,350]))
      .tickValues(d3.range(-350,351,50))
      .tickFormat(val => val% 100 == 0 ? val : ''))
    .style("font-size",20)
    .append("text")
      .attr("fill", "black")
      .attr("x", width / 2 )
      .attr("y", 40)
      .text('Zonal component [m/s]')
  svg.append("g")
    .call(d3
      .axisTop(x)
      .tickValues(d3.range(-350,351,50))
      .tickFormat(''))
  //y axis
  svg.append("g")
    .call(d3
      .axisLeft(y.domain([-350,350]))
      .tickValues(d3.range(-350,351,50))
      .tickFormat((val) => val % 10 == 0 ? val.toString() : ''))
    .style("font-size",20)
    .append("text")
    .attr("fill","black")
    .attr("text-anchor","middle")
    .attr("x",  - height / 2 - margin.top)
    .attr("y", -55)
    .attr("transform","rotate(-90)")
    .text("Meridional component [m/s]")
  svg.append("g")
    .attr('transform',"translate(" + width + ",0)")
    .call(d3
      .axisRight(y)
      .tickValues(d3.range(-350,351,50))
      .tickFormat(''))

  svg.selectAll("circle")
    .data(d3.range(450,49,-50))
    .enter()
    .append("circle")
    .attr("fill","none")
    .attr("stroke","black")
    .attr("cx",x(0))
    .attr("cy",y(0))
    .attr("r",d => d*293/(2*width)) //parameter
    .style("opacity", 0.1)
    .attr("clip-path","url(#clip-t)")
    .on("mouseover",function(event,d){
      d3.select(event.target).style("opacity",1)
      tooltip
        .style("visibility","visible")
        .text('|v|='+d+'m/s')
    })
    .on("mousemove",function(event,d){
      tooltip
        .style("left", event.pageX + 15 + "px")
        .style("top", event.pageY -20 + "px")
    })
    .on("mouseout",function(event){
      d3.select(event.target).style("opacity",0.1)
      tooltip.style("visibility","hidden")
    })

  svg.selectAll(null)
    .data(data.filter(d=>d.u))
    .enter()
    .append("line")
    .attr("x1", d=>x(d.vt_x))
    .attr("y1", d=>y(d.vt_y))
    .attr("x2", d=>x(d.gs_x))
    .attr("y2", d=>y(d.gs_y))
    .style("stroke","gray")
    .style("stroke-width",0.1)
    .style("opacity",0.1)

  svg.selectAll(null)
    .data(data.filter(d=>d.u))
    .enter()
    .append("line")
    .attr("x1", d=>x(d.u))
    .attr("y1", d=>y(d.v))
    .attr("x2", d=>x(d.gs_x))
    .attr("y2", d=>y(d.gs_y))
    .style("stroke","gray")
    .style("stroke-width",0.1)
    .style("opacity",0.1)

  for (let color of ['red','blue','black']){
    svg.append("defs")
      .append('marker')
      .attr('id','arrow-'+color)
      .attr('refX',10)
      .attr("refY",5)
      .attr("markerWidth",10)
      .attr("markerHeight",10)
      .attr("orient","auto")
      .append("path")
      .attr("d","M10 5 0 2 0 8Z")
      .attr("fill",color)
  }

  svg.selectAll(null)
    .data(data.filter(d=>d.u))
    .enter()
    .append("line")
    .attr("x1", x(0))
    .attr("y1", y(0))
    .attr("x2", d=>x(d.gs_x))
    .attr("y2", d=>y(d.gs_y))
    .style("stroke","black")
    .style("stroke-width",0.1)
    .attr("marker-end","url(#arrow-black)")

  svg.selectAll(null)
    .data(data.filter(d=>d.u))
    .enter()
    .append("line")
    .attr("x1", x(0))
    .attr("y1", y(0))
    .attr("x2", d=>x(d.vt_x))
    .attr("y2", d=>y(d.vt_y))
    .style("stroke","blue")
    .style("stroke-width",0.1)
    .attr("marker-end","url(#arrow-blue)")

  svg.selectAll(null)
    .data(data.filter(d=>d.u))
    .enter()
    .append("line")
    .attr("x1", x(0))
    .attr("y1", y(0))
    .attr("x2", d=>x(d.u))
    .attr("y2", d=>y(d.v))
    .style("stroke","red")
    .style("stroke-width",0.1)
    .attr("marker-end","url(#arrow-red)")

  //x axis
  vdeg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3
      .axisBottom(x.domain([100,360]))
      .tickValues(d3.range(100,360,20))
      .tickFormat(val => ( val + 20 ) % 40 == 0 ? val : ''))
    .style("font-size",20)
    .append("text")
      .attr("fill", "black")
      .attr("x", width / 2 )
      .attr("y", 40)
      .html('Speed [m/s]')
  vdeg.append("g")
    .call(d3
      .axisTop(x.domain([100,360]))
      .tickValues(d3.range(100,360,20))
      .tickFormat(''))
  //y axis
  vdeg.append("g")
    .call(d3
      .axisLeft(y.domain([-45,90]))
      .tickValues(d3.range(-45,91,5))
      .tickFormat((val) => val % 15 == 0 ? val.toString() : ''))
    .style("font-size",20)
    .append("text")
    .attr("fill","black")
    .attr("text-anchor","middle")
    .attr("x",  - height / 2 - margin.top)
    .attr("y", -45)
    .attr("transform","rotate(-90)")
    .html("Angle [mod(&theta;,90)&deg;]")
  vdeg.append("g")
    .attr('transform',"translate(" + width + ",0)")
    .call(d3
      .axisRight(y.domain([-45,90]))
      .tickValues(d3.range(-45,91,5))
      .tickFormat(''))

  vdeg.selectAll(null)
    .data(data.filter(d=>d.u))
    .enter()
    .append("line")
    .attr("x1", d=>x(Math.sqrt(d.gs_x**2+d.gs_y**2)))
    .attr("y1", d=>{
      const deg=( Math.atan2(d.gs_y,d.gs_x)*180/Math.PI + 360 ) % 90
      const odeg=( Math.atan2(d.vt_y,d.vt_x)*180/Math.PI + 360 ) % 90
      return y( deg-odeg>45 ? deg-90 : deg )})
    .attr("x2", d=>x(Math.sqrt(d.vt_x**2+d.vt_y**2)))
    .attr("y2", d=>{
      const deg=( Math.atan2(d.vt_y,d.vt_x)*180/Math.PI + 360 ) % 90
      const odeg=( Math.atan2(d.gs_y,d.gs_x)*180/Math.PI + 360 )% 90
      return y( deg-odeg>45 ? deg-90 : deg )})
    .style("stroke", d=>'#'+d.hex)
    .style("stroke-width",1)
    .style("opacity",0.5)
    .on("mouseover",function(event,d){
      d3.select(event.target).style("opacity",1)
      tooltip
        .style("visibility","visible")
        .html('u: '+Math.round(d.u*100)/100+'m/s'+'<br>v: '+Math.round(d.v*100)/100+'m/s')
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

  vdeg.selectAll("dot")
    .data(data.filter(d => d.u))
    .enter()
    .append("circle")
      .attr("cx", d => x(Math.sqrt(d.gs_x**2+d.gs_y**2)))
      .attr("cy", d =>{
        const deg=( Math.atan2(d.gs_y,d.gs_x)*180/Math.PI + 360 ) % 90
        const odeg=( Math.atan2(d.vt_y,d.vt_x)*180/Math.PI + 360 ) % 90
        return y( deg-odeg>45 ? deg-90 : deg )})
      .attr("r", 1)
      .style("fill","black")
      .style("opacity",0.5)

  vdeg.selectAll("dot")
    .data(data.filter(d => d.u))
    .enter()
    .append("circle")
      .attr("cx", d => x(Math.sqrt(d.vt_x**2+d.vt_y**2)))
      .attr("cy", d => {
        const deg=( Math.atan2(d.vt_y,d.vt_x)*180/Math.PI + 360 ) % 90
        const odeg=( Math.atan2(d.gs_y,d.gs_x)*180/Math.PI + 360 ) % 90
        return y( deg-odeg>45 ? deg-90 : deg )})
      .attr("r", 1)
      .style("fill","blue")
      .style("opacity",0.5)

  //x axis
  roll.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3
      .axisBottom(x.domain([-6,6]))
      .tickValues(d3.range(-6,7,1))
      .tickFormat(val => val% 2 == 0 ? val : ''))
    .style("font-size",20)
    .append("text")
      .attr("fill", "black")
      .attr("x", width / 2 )
      .attr("y", 40)
      .html('Radius: |rolling| [&deg;]')
  roll.append("g")
    .call(d3
      .axisTop(x)
      .tickValues(d3.range(-6,7,1))
      .tickFormat(''))
  //y axis
  roll.append("g")
    .call(d3
      .axisLeft(y.domain([-6,6]))
      .tickValues(d3.range(-6,7,1))
      .tickFormat(val => val % 10 == 9 ? val.toString() : ''))
    .style("font-size",20)
    .append("text")
    .attr("fill","black")
    .attr("text-anchor","middle")
    .attr("x",  - height / 2 - margin.top)
    .attr("y", -55)
    .attr("transform","rotate(-90)")
    .html("Angle: wind direction [&deg;]")
  roll.append("g")
    .attr('transform',"translate(" + width + ",0)")
    .call(d3
      .axisRight(y)
      .tickValues(d3.range(-6,7,1))
      .tickFormat(''))

  roll.selectAll("circle")
    .data(d3.range(8,0.9,-1))
    .enter()
    .append("circle")
    .attr("fill","none")
    .attr("stroke","black")
    .attr("cx",x(0))
    .attr("cy",y(0))
    .attr("r",d => d*17000/(2*width)) //parameter
    .style("opacity", 0.1)
    .attr("clip-path","url(#clip-t)")

  roll.selectAll("dot")
    .data(data.filter(d => d.u))
    .enter()
    .append("circle")
      .attr("cx", d => x(d.u*Math.abs(d.roll)/Math.sqrt(d.u**2+d.v**2)))
      .attr("cy", d => y(d.v*Math.abs(d.roll)/Math.sqrt(d.u**2+d.v**2)))
      .attr("r", 2)
      .style("fill", d => '#'+d.hex)
      .style("opacity", 0.5)
    .on("mouseover",function(event,d){
      d3.select(event.target).style("opacity",1)
      tooltip
        .style("visibility","visible")
        .html('Roll: '+Math.round(d.roll*10)/10+"deg<br>u: "+Math.round(d.u*100)/100+'m/s<br>v: '+Math.round(d.v*100)/100+'m/s')
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
})
