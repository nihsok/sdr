d3.csv("./stat.csv").then(function(data){
  if(data.length>240) data = data.slice(data.length-240) //24 times per day
  const margin = {top:10, right:10, bottom:25, left:75},
        width  = 810 - margin.left - margin.right,
        height = 280 - margin.top - margin.bottom;

  const x = d3.scaleTime().domain([new Date(data[0].time),new Date(data[data.length-1].time)]).range([0, width])
  const y = d3.scaleLinear().range([height, 0])
  const maxval = 70

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
  svg.append("g")
    .call(d3
      .axisTop(x)
      .tickFormat(''))
  //y axis
  svg.append("g")
    .call(d3
      .axisLeft(y.domain([0,maxval]))
      .tickValues(d3.range(0,maxval+1,5))
      .tickFormat((val) => val % 10 == 0 ? val.toString() : ''))
    .style("font-size",20)
    .append("text")
    .attr("fill","black")
    .attr("text-anchor","middle")
    .attr("x", - height / 2 - margin.top + 10)
    .attr("y", -55)
    .attr("transform","rotate(-90)")
    .text("# [60/hour] & Rate [%]")
  svg.append("g")
    .attr('transform',"translate(" + width + ",0)")
    .call(d3
      .axisRight(y)
      .tickValues(d3.range(0,maxval,5))
      .tickFormat(''))

  svg.append("clipPath")
    .attr("id","clip-count")
    .append("rect")
      .attr("x",0)
      .attr("y",0)
      .attr("width",width)
      .attr("height",height)

  svg.selectAll(null)
    .data(d3.range(0,maxval,5))
    .enter()
    .append("line")
    .attr("x1",x(new Date(data[0].time)))
    .attr("y1",d=>y(d))
    .attr("x2",x(new Date(data[data.length-1].time)))
    .attr("y2",d=>y(d))
    .attr("clip-path","url(#clip-count)")
    .style("stroke","black")
    .style("opacity",0.1)

  const color=['rgb(102,51,0)','rgb(53,161,107)','rgb(255,40,0)','rgb(0,65,255)','rgb(154,0,121)']
  const legend={t:'T,U,Position',u:'U,Position',latlon:'Position (lon,lat,alt)',alt:'Altitude',little:'All'}

  svg.selectAll("mylayers")
    .data(d3.stack()
      .keys(['t','u','latlon','alt','little'])(data).reverse())
    .join("path")
    .style("fill",(d,i)=>color[i])
    .style("opacity",0.3)
    .attr("clip-path","url(#clip-count)")
    .attr("d",d3.area()
      .x(d=>x(new Date(d.data.time)))
      .y0(y(0))
      .y1(d=>y(d[1]/60))
    )
    .on("mouseover",function(event,d){
      d3.select(event.target).style("opacity",1)
      tooltip
        .style("visibility","visible")
        .html(legend[d.key]
          +'<br>Latest=' +Math.round(d[d.length-1][1]        /60 *10)/10
          +', Max='      +Math.round(d3.max(      d,(d)=>d[1]/60)*10)/10
          +', Median='   +Math.round(d3.median(   d,(d)=>d[1]/60)*10)/10
          +', Mean='     +Math.round(d3.mean(     d,(d)=>d[1]/60)*10)/10
          +', Deviation='+Math.round(d3.deviation(d,(d)=>d[1]/60)*10)/10
        )
    })
    .on("mousemove",function(event,d){
      tooltip
        .style("left", event.pageX + 15 + "px")
        .style("top", event.pageY -20 + "px")
    })
    .on("mouseout",function(event){
      d3.select(event.target).style("opacity",0.3)
      tooltip.style("visibility","hidden")
    })

  svg.append("path")
    .datum(data)
    .attr("fill",'none')
    .attr("stroke","black")
    .attr("clip-path","url(#clip-count)")
    .attr("d",d3.line()
      .x(d=>x(new Date(d.time)))
      .y(d=>y(d.t/(Number(d.little)+Number(d.alt)+Number(d.latlon)+Number(d.u)+Number(d.t))*100 || 0 ))
    ).on("mouseover", () => {
      const z = data[data.length-1]
      tooltip
        .style("visibility","visible")
        .html('ratio of valid / all [%]'
          +'<br>Latest=' +Math.round(                    (z.t/(Number(z.little)+Number(z.alt)+Number(z.latlon)+Number(z.u)+Number(z.t))*100 || 0)*10)/10
          +', Max='      +Math.round(d3.max(      data,d=>d.t/(Number(d.little)+Number(d.alt)+Number(d.latlon)+Number(d.u)+Number(d.t))*100 || 0)*10)/10
          +', Median='   +Math.round(d3.median(   data,d=>d.t/(Number(d.little)+Number(d.alt)+Number(d.latlon)+Number(d.u)+Number(d.t))*100 || 0)*10)/10
          +', Mean='     +Math.round(d3.mean(     data,d=>d.t/(Number(d.little)+Number(d.alt)+Number(d.latlon)+Number(d.u)+Number(d.t))*100 || 0)*10)/10
          +', Deviation='+Math.round(d3.deviation(data,d=>d.t/(Number(d.little)+Number(d.alt)+Number(d.latlon)+Number(d.u)+Number(d.t))*100 || 0)*10)/10
        )
    })
    .on("mousemove",function(event,d){
      tooltip
        .style("left", event.pageX + 15 + "px")
        .style("top", event.pageY -20 + "px")
    })
    .on("mouseout",function(event){
      tooltip.style("visibility","hidden")
    })

})