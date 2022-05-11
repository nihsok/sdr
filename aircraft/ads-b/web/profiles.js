const margin = {top:10, right:10,bottom:20,left:30},
  width = 200 - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom;

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
  //y axis
  svg.append("g")
    .call(d3
      .axisLeft(y.domain([0, 15000]))
      .tickFormat((val) => val % 2000 == 0 ? (val/1000).toString() : ''))

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
});

