d3.csv("./data.csv").then(function(data){
  const margin = {top:10, right:15, bottom:45, left:75},
        width  = 495 - margin.left - margin.right,
        height = width//495 - margin.top - margin.bottom;

  const x = d3.scaleLinear().range([0, width])
  const y = d3.scaleLinear().range([height, 0])

  const svg = d3.select("#check")
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
      .axisBottom(x.domain([0.5,0.9]))
      .tickValues(d3.range(0.5,0.91,0.02))
      .tickFormat(val => val*10 % 1 == 0 ? Math.round(val*100)/100 : ''))
    .style("font-size",20)
    .append("text")
      .attr("fill", "black")
      .attr("x", width / 2 )
      .attr("y", 40)
      .text('Mach number')
  svg.append("g")
    .call(d3
      .axisTop(x.domain([0.5,0.9]))
      .tickValues(d3.range(0.5,0.9,0.02))
      .tickFormat(''))
  //y axis
  svg.append("g")
    .call(d3
      .axisLeft(y.domain([165,270]))
      .tickValues(d3.range(165,271,5))
      .tickFormat((val) => val % 10 == 0 ? val.toString() : ''))
    .style("font-size",20)
    .append("text")
    .attr("fill","black")
    .attr("text-anchor","middle")
    .attr("x",  - height / 2 - margin.top)
    .attr("y", -55)
    .attr("transform","rotate(-90)")
    .text("True AirSpeed [m/s]")
  svg.append("g")
    .attr('transform',"translate(" + width + ",0)")
    .call(d3
      .axisRight(y.domain([165,270]))
      .tickValues(d3.range(165,270,5))
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
    .attr("x2",x(1))
    .attr("y2",d=>y(Math.sqrt(401.8*(273.15+d))))
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
      .attr("cx", d => x(d.mach))
      .attr("cy", d => y(d.tas))
      .attr("r", 3)
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
})