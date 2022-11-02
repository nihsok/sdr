const margin = {top:10, right:15, bottom:50, left:60},
  width = 300 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

const x = d3.scaleLinear().range([0, width])
const y = d3.scaleLinear().range([height, 0])

const t_profile = d3.select("#profiles")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform","translate(" + margin.left + "," + margin.top + ")");

const u_profile = d3.select("#profiles")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform","translate(" + margin.left + "," + margin.top + ")");

const v_profile = d3.select("#profiles")
  .append("svg")
   .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform","translate(" + margin.left + "," + margin.top + ")");

d3.csv("./data.csv").then(function(data){
  function axes(svg,title,range){
    //x axis
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3
        .axisBottom(x.domain(range))
        .tickValues(d3.range(...range,10))
        .tickFormat((val) => val % 30 == 0 ? val.toString() : ''))
      .style("font-size",20)
      .append("text")
        .attr("fill", "black")
        .attr("x", width / 2 )
        .attr("y", 45)
        .html(title)
    svg.append("g")
      .call(d3
        .axisTop(x.domain(range))
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
  }
  axes(t_profile,"(Virtual) Temperature [&#8451]",[-80,30])

  const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("background-color", "white")

  t_profile.selectAll("dot")
    .data(data.filter(d => d.alt && d.t))
    .enter()
    .append("circle")
      .attr("cx", (d) => x(d.t))
      .attr("cy", (d) => y(d.alt))
      .attr("r", 3)
      .style("fill", (d) => '#'+d.hex)
      .style("opacity", 0.5)
    .on("mouseover",function(event,d){
      d3.select(event.target).style("opacity",1)
      tooltip
        .style("visibility","visible")
        .html('z: '+Math.round(d.alt)/1000+"km<br>T: "+Math.round(d.t*100)/100+'&#8451')
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
  //setting only for T profile
  t_profile.append("clipPath")
    .attr("id","clip-rect")
    .append("rect")
      .attr("x",0)
      .attr("y",0)
      .attr("width",width)
      .attr("height",height)

  for (i=-60; i<=160; i+=20){
    t_profile.append("path")
      .datum([0,15000])
      .style("opacity",0.2)
      .attr("stroke","red")
      .attr("clip-path","url(#clip-rect)")
      .attr("d",d3.line()
        .x((d) => x(i-9.8*d/1000))
        .y((d) => y(d))
      )
    t_profile.append("path")
      .datum([0,15000])
      .style("opacity",0.2)
      .attr("stroke","blue")
      .attr("clip-path","url(#clip-rect)")
      .attr("d",d3.line()
        .x((d) => x(i-5*d/1000))
        .y((d) => y(d))
      )
  }

  const u_max=80
  axes(u_profile,'Zonal wind [m/s]',[-u_max,u_max])
  u_profile.selectAll("dot")
    .data(data.filter(d => d.alt && d.u && Math.abs(d.u)<u_max))
    .enter()
    .append("circle")
      .attr("cx", (d) => x(d.u))
      .attr("cy", (d) => y(d.alt))
      .attr("r", 3)
      .style("fill", (d) => '#'+d.hex)
      .style("opacity", 0.5)
    .on("mouseover",function(event,d){
      d3.select(event.target).style("opacity",1)
      tooltip
        .style("visibility","visible")
        .html('z: '+Math.round(d.alt)/1000+"km<br>u: "+Math.round(d.u*100)/100+'m/s')
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
  u_profile.selectAll(null)
    .data(d3.range(-u_max,u_max+1,10).concat([0]))
    .enter()
    .append("line")
    .attr("x1",d=>x(d))
    .attr("y1",y(0))
    .attr("x2",d=>x(d))
    .attr("y2",y(15000))
    .attr("clip-path","url(#clip-t)")
    .style("stroke","black")
    .style("opacity",0.1)

  axes(v_profile,'Meridional Wind [m/s]',[-u_max,u_max])
  v_profile.selectAll("dot")
    .data(data.filter(d => d.alt && d.v && Math.abs(d.v)<u_max))
   .enter()
   .append("circle")
     .attr("cx", (d) => x(d.v))
     .attr("cy", (d) => y(d.alt))
     .attr("r", 3)
     .style("fill", (d) => '#'+d.hex)
     .style("opacity", 0.5)
   .on("mouseover",function(event,d){
     d3.select(event.target).style("opacity",1)
     tooltip
       .style("visibility","visible")
       .html('z: '+Math.round(d.alt)/1000+"km<br>v: "+Math.round(d.v*100)/100+'m/s')
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
  v_profile.selectAll(null)
    .data(d3.range(-u_max,u_max-1,10).concat([0]))
    .enter()
    .append("line")
    .attr("x1",d=>x(d))
    .attr("y1",y(0))
    .attr("x2",d=>x(d))
    .attr("y2",y(15000))
    .attr("clip-path","url(#clip-t)")
    .style("stroke","black")
    .style("opacity",0.1)
});


