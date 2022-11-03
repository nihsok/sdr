d3.csv("./dz.csv").then(function(data){
  const margin = {top:10, right:10, bottom:45, left:75},
    width = 202.5 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;
  const x = d3.scaleLinear().range([0, width])
  const y = d3.scaleLinear().range([height, 0])

  const n2 = d3.select("#dz")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform","translate(" + margin.left + "," + margin.top + ")");

  const ri = d3.select("#dz")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform","translate(" + margin.left + "," + margin.top + ")");

  const dwdt = d3.select("#dz")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform","translate(" + margin.left + "," + margin.top + ")");

  function axes(svg,title,range,rabel,tick){
    //x axis
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3
        .axisBottom(x.domain(range))
        .tickValues(d3.range(...range,tick).concat(range[1]))
        .tickFormat((val) => val % rabel == 0 ? val.toString() : ''))
      .style("font-size",20)
      .append("text")
        .attr("fill", "black")
        .attr("x", width / 2 )
        .attr("y", 40)
        .html(title)
    svg.append("g")
      .call(d3
        .axisTop(x.domain(range))
        .tickValues(d3.range(...range,tick))
        .tickFormat(''))
    //y axis
    svg.append("g")
      .call(d3
        .axisLeft(y.domain([0, 15000]))
        .tickValues(d3.range(0,15000,1000))
        .tickFormat((val) => val % 2000 == 0 ? (val/1000).toString() : ''))
      .style("font-size",20)
      .append("text")
      .attr("fill","black")
      .attr("text-anchor","middle")
      .attr("x",  - height / 2 - margin.top)
      .attr("y", -40)
      .attr("transform","rotate(-90)")
      .text("Altitude [km]")
    svg.append("g")
      .attr('transform',"translate(" + width + ",0)")
      .call(d3
        .axisRight(y.domain([0, 15000]))
        .tickValues(d3.range(0,15000,1000))
        .tickFormat(''))
    svg.selectAll(null)
      .data([0])
      .enter()
      .append("line")
      .attr("x1",d=>x(d))
      .attr("y1",y(0))
      .attr("x2",d=>x(d))
      .attr("y2",y(15000))
      .style("stroke","black")
      .style("opacity",0.1)
  }
  const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("background-color", "white")
  const g = 9.8

  axes(n2,'N&sup2; [/s&sup2;]',[-0.001,0.00099],0.001,0.0005)
  n2.selectAll(null)
    .data(data.filter(d=>d.dtdz && d.theta1>0 && d.theta2>0))
    .enter()
    .append("line")
    .attr("x1", d=>x(g/d.theta1*d.dtdz))
    .attr("y1", d=>y(d.z1))
    .attr("x2", d=>x(g/d.theta2*d.dtdz))
    .attr("y2", d=>y(d.z2))
    .style("stroke", d=>'#'+d.hex)
    .style("stroke-width",4)
    .style("opacity",0.5)
    .on("mouseover",function(event,d){
      d3.select(event.target).style("opacity",1)
      tooltip
        .style("visibility","visible")
        .html('z: '+Math.round(d.z1)/1000+'~'+Math.round(d.z2)/1000+'km'+'<br>N&sup2;: '+Math.round(g/d.theta1*d.dtdz*100000)/10+'~'+Math.round(g/d.theta2*d.dtdz*100000)/10+'&times;10<sup>-4</sup>s<sup>-2</sup>')
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

  axes(ri,"Ri",[-8,8],4,2)
  ri.selectAll(null)
    .data(data.filter(d=>d.dtdz && d.theta1>0 && d.theta2>0))
    .enter()
    .append("line")
    .attr("x1", d=>x(g/d.theta1*d.dtdz/d.dvdz_square))
    .attr("y1", d=>y(d.z1))
    .attr("x2", d=>x(g/d.theta2*d.dtdz/d.dvdz_square))
    .attr("y2", d=>y(d.z2))
    .style("stroke", d=>'#'+d.hex)
    .style("stroke-width",4)
    .style("opacity",0.5)
    .on("mouseover",function(event,d){
      d3.select(event.target).style("opacity",1)
      tooltip
        .style("visibility","visible")
        .html('z: '+Math.round(d.z1)/1000+'~'+Math.round(d.z2)/1000+'km'+'<br>Ri: '+Math.round(g/d.theta1*d.dtdz/d.dvdz_square*100)/100+'~'+Math.round(g/d.theta2*d.dtdz/d.dvdz_square*100)/100)
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

  axes(dwdt,"Dw/Dt [m/s&sup2;]",[-10,10],4,2)
  dwdt.selectAll(null)
    .data(data.filter(d=>d.dpdz && d.theta1>0 && d.theta2>0))
    .enter()
    .append("line")
    .attr("x1", d=>x(-g-d.p1/(287*d.t1)*d.dpdz)) //R=287
    .attr("y1", d=>y(d.z1))
    .attr("x2", d=>x(-g-d.p2/(287*d.t2)*d.dpdz))
    .attr("y2", d=>y(d.z2))
    .style("stroke", d=>'#'+d.hex)
    .style("stroke-width",4)
    .style("opacity",0.5)
    .on("mouseover",function(event,d){
      d3.select(event.target).style("opacity",1)
      tooltip
        .style("visibility","visible")
        .html('z: '+Math.round(d.z1)/1000+'~'+Math.round(d.z2)/1000+'km'+'<br>Dw/Dt: '+Math.round((-g-d.p1/(287*d.t1)*d.dpdz)*10)/10+'~'+Math.round((-g-d.p2/(287*d.t2)*d.dpdz)*10)/10+'[m/s&sup2;]')
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

d3.csv("./data.csv").then(function(data){
  const margin = {top:10, right:10, bottom:45, left:75},
    width = 202.5 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;
  const x = d3.scaleLinear().range([0, width])
  const y = d3.scaleLinear().range([height, 0])

  const cas = d3.select("#dz")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform","translate(" + margin.left + "," + margin.top + ")");

      //x axis
  cas.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3
      .axisBottom(x.domain([-3,3]))
      .tickValues(d3.range(-3,3,1))
      .tickFormat((val) => val % 2 == 0 ? val.toString() : ''))
    .style("font-size",20)
    .append("text")
      .attr("fill", "black")
      .attr("x", width / 2 - 5)
      .attr("y", 40)
      .html('CAS-IAS [m/s]')
  cas.append("g")
    .call(d3
      .axisTop(x.domain([-3,3]))
      .tickValues(d3.range(-3,3,1))
      .tickFormat(''))
  //y axis
  cas.append("g")
    .call(d3
      .axisLeft(y.domain([0, 15000]))
      .tickValues(d3.range(0,15000,1000))
      .tickFormat((val) => val % 2000 == 0 ? (val/1000).toString() : ''))
    .style("font-size",20)
    .append("text")
    .attr("fill","black")
    .attr("text-anchor","middle")
    .attr("x",  - height / 2 - margin.top)
    .attr("y", -40)
    .attr("transform","rotate(-90)")
    .text("Altitude [km]")
  cas.append("g")
    .attr('transform',"translate(" + width + ",0)")
    .call(d3
      .axisRight(y.domain([0, 15000]))
      .tickValues(d3.range(0,15000,1000))
      .tickFormat(''))
  cas.selectAll(null)
    .data([0])
    .enter()
    .append("line")
    .attr("x1",d=>x(d))
    .attr("y1",y(0))
    .attr("x2",d=>x(d))
    .attr("y2",y(15000))
    .style("stroke","black")
    .style("opacity",0.1)
  const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("background-color", "white")

  cas.selectAll("dot")
    .data(data.filter(d => d.alt && d.ias && d.cas))
    .enter()
    .append("circle")
      .attr("cx", (d) => x(d.cas-d.ias))
      .attr("cy", (d) => y(d.alt))
      .attr("r", 3)
      .style("fill", (d) => '#'+d.hex)
      .style("opacity", 0.5)
    .on("mouseover",function(event,d){
      d3.select(event.target).style("opacity",1)
      tooltip
        .style("visibility","visible")
        .html('z: '+Math.round(d.alt)/1000+"km<br>CAS: "+Math.round(d.cas*100)/100+'m/s<br>IAS: '+Math.round(d.ias*100)/100+'m/s<br>Δ: '+Math.round((d.cas-d.ias)*100)/100+'m/s')
    })
    .on("mousemove",function(event,d){
      tooltip
        .style("left", event.pageX + 15 + "px")
        .style("top", event.pageY -20 + "px")
    })
    .on("mouseout",function(event){
      d3.select(event.target).style("opacity",0.5)
      tooltip.style("visibility","hidden")
    })
})