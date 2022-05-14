const margin = {top:10, right:10, bottom:40, left:40},
  width = 300 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

const x = d3.scaleLinear().range([0, width])
const y = d3.scaleLinear().range([height, 0])

const t_profile = d3.select("#temperature")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform","translate(" + margin.left + "," + margin.top + ")");

const u_profile = d3.select("#zonal_wind")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform","translate(" + margin.left + "," + margin.top + ")");

const v_profile = d3.select("#meridional_wind")
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
        .tickFormat((val) => val % 20 == 0 ? val.toString() : ''))
      .append("text")
        .attr("fill", "black")
        .attr("x", width / 2 )
        .attr("y", 35)
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
      .append("text")
      .attr("fill","black")
      .attr("text-anchor","middle")
      .attr("x",  - height / 2 - margin.top)
      .attr("y", -30)
      .attr("transform","rotate(-90)")
      .text("Altitude [km]")
    svg.append("g")
      .attr('transform',"translate(" + width + ",0)")
      .call(d3
        .axisRight(y.domain([0, 15000]))
        .tickValues(d3.range(0,15000,1000))
        .tickFormat(''))
  }
  axes(t_profile,"Temperature [&#8451]",[-80,30])

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
        .style("left",60+x(d.t)+"px")
        .style("top",y(d.alt)+"px")
        .html('z: '+Math.round(d.alt)/1000+"km<br>T: "+Math.round(d.t*100)/100+'&#8451')
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
      .attr("fill","none")
      .attr("stroke","red")
      .attr("clip-path","url(#clip-rect)")
      .attr("d",d3.line()
        .x((d) => x(i-9.8*d/1000))
        .y((d) => y(d))
    )
    t_profile.append("path")
    .datum([0,15000])
    .style("opacity",0.2)
    .attr("fill","none")
    .attr("stroke","blue")
    .attr("clip-path","url(#clip-rect)")
    .attr("d",d3.line()
      .x((d) => x(i-5*d/1000))
      .y((d) => y(d))
    )
  }

  axes(u_profile,'Zonal wind [m/s]',[-60,60])
  u_profile.selectAll("dot")
   .data(data.filter(d => d.alt && d.u))
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
        .style("left",60+x(d.u)+"px")
        .style("top",400+y(d.alt)+"px")
        .html('z: '+Math.round(d.alt)/1000+"km<br>u: "+Math.round(d.u*100)/100+'m/s')
      })
    .on("mouseout",function(event){
      d3.select(event.target).style("opacity",0.5)
      tooltip.style("visibility","hidden")
  })
  u_profile.append("path")
  .datum([0,15000])
  .style("opacity",0.2)
  .attr("fill","none")
  .attr("stroke","black")
  .attr("clip-path","url(#clip-rect)")
  .attr("d",d3.line()
    .x(x(0))
    .y(d => y(d))
  )

  axes(v_profile,'Meridional Wind [m/s]',[-60,60])
  v_profile.selectAll("dot")
  .data(data.filter(d => d.alt && d.u))
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
       .style("left",60+x(d.v)+"px")
       .style("top",800+y(d.alt)+"px")
       .html('z: '+Math.round(d.alt)/1000+"km<br>v: "+Math.round(d.v*100)/100+'m/s')
     })
   .on("mouseout",function(event){
     d3.select(event.target).style("opacity",0.5)
     tooltip.style("visibility","hidden")
  })
  v_profile.append("path")
  .datum([0,15000])
  .style("opacity",0.2)
  .attr("fill","none")
  .attr("stroke","black")
  .attr("clip-path","url(#clip-rect)")
  .attr("d",d3.line()
    .x(x(0))
    .y(d => y(d))
  )
});


