const margin = {top:10, right:10, bottom:40, left:40},
  width =300 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

const x = d3.scaleLinear().range([0, width])
const y = d3.scaleLinear().range([height, 0])

const svg = d3.select("#temperature")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform","translate(" + margin.left + "," + margin.top + ")");

d3.csv("./data.csv").then(function(data){
  //x axis
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3
      .axisBottom(x.domain([-80, 20]))
      .tickFormat((val) => val % 20 == 0 ? val.toString() : ''))
    .append("text")
    .attr("fill", "black")
    .attr("x", width / 2 )
    .attr("y", 35)
    .html("Temperature [&#8451]")
  //y axis
  svg.append("g")
    .call(d3
      .axisLeft(y.domain([0, 15000]))
      .tickValues(d3.range(0,15000,1000))
      .tickFormat((val) => val % 2000 == 0 ? (val/1000).toString() : ''))
    .append("text")
    .attr("fill","black")
    .attr("text-anchor","middle")
    .attr("x",  -height / 2 - margin.top)
    .attr("y", -30)
    .attr("transform","rotate(-90)")
    .text("Altitude [km]")

  const tooltiop = d3.select("#temperature")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")

  svg.selectAll("dot")
    .data(data.filter(d => d.alt && d.t))
    .enter()
    .append("circle")
      .attr("cx", (d) => x(d.t))
      .attr("cy", (d) => y(d.alt))
      .attr("r", 3)
      .style("fill", (d) => '#'+d.hex)
      .style("opacity", 0.5);

  svg.append("clipPath")
    .attr("id","clip-rect")
    .append("rect")
    .attr("x",0)
    .attr("y",0)
    .attr("width",width)
    .attr("height",height)

    const dataset=[0,15000]
    for (i=-60;i<=140;i+=20){
      svg.append("path")
        .datum([0,15000])
        .style("opacity",0.2)
        .attr("fill","none")
        .attr("stroke","red")
        .attr("clip-path","url(#clip-rect)")
        .attr("d",d3.line()
          .x((d) => x(i-9.8*d/1000))
          .y((d) => y(d))
      )
      svg.append("path")
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
});


