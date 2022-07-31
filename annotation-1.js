const annotations = [
       // first annotation
        {
      note: {
        label: "Earnings plummeted",
        title: "April 17th - 19th",
        wrap: 150,  // try something smaller to see text split in several lines
        padding: 10   // More = text lower
      
     },
     color: ["#cc0000"],
     x: x(parseDate('2018-04-18')),
     y: y(8197),
     dy: -100,
     dx: -5,
     subject: {
      radius: 50,
      radiusPadding: 5
    },
    type: d3.annotationCalloutCircle,
    },
    // second annotation
        {
      note: {
        label: "Strong Recovery",
        title: "April 20th",
        wrap: 150,  // try something smaller to see text split in several lines
        padding: 10   // More = text lower
      
     },
     color: [" #00b300"],
     x: x(parseDate('2018-04-20')),
     y: y(8880.23),
     dy: 40,
     dx: 40,
    type: d3.annotationCalloutElbow,
    },
    
      ]
      
      window.makeAnnotations = d3.annotation()
        .annotations(annotations)
     
        svg.append("g")
    .call(makeAnnotations)
