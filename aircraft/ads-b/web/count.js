d3.csv("./stat.csv").then(function(data){
  const margin = {top:10, right:20, bottom:90, left:80},
        width  = 990 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

  const x = d3.scaleTime().domain([new Date(data[0].time),new Date(data[data.length-1].time)]).range([0, width])//長すぎる場合は切るように
  const y = d3.scaleLinear().domain([0,650]).range([height, 0])

  const svg = d3.select("#count")
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
      .axisBottom(x)
      .tickFormat(d3.timeFormat("%m/%d %H")))
      .style("font-size",15)
    // .append("text")
    //   .attr("fill", "black")
    //   .attr("x", width / 2 )
    //   .attr("y", 45)
    //   .text('Time')
  svg.append("g")
    .call(d3
      .axisTop(x)
    //  .tickValues(d3.range(0,10,1))
      .tickFormat(''))
  //y axis
  svg.append("g")
    .call(d3
      .axisLeft(y)
      .tickValues(d3.range(0,651,50))
      .tickFormat((val) => val % 100 == 0 ? val.toString() : ''))
    .style("font-size",20)
    .append("text")
    .attr("fill","black")
    .attr("text-anchor","middle")
    .attr("x",  - height / 2 - margin.top)
    .attr("y", -60)
    .attr("transform","rotate(-90)")
    .text("Number of data")
  svg.append("g")
    .attr('transform',"translate(" + width + ",0)")
    .call(d3
      .axisRight(y)
      .tickValues(d3.range(0,651,50))
      .tickFormat(''))

  const color=['rgb(53,161,107)','rgb(255,40,0)','rgb(0,65,255)','rgb(102,51,0)','rgb(154,0,121)']

  svg.selectAll("mylayers")
    .data(d3.stack()
      .keys(['t','u','latlon','alt','little'])(data))
    .join("path")
    .style("fill",(d,i)=>color[i])
    .style("opacity",0.8)
    .attr("d",d3.area()
      .x(d=>x(new Date(d.data.time)))
      .y0(d=>y(d[0]))
      .y1(d=>y(d[1]))
    )
})