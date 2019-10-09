function buildMetadata(sample) {

    // @TODO: Complete the following function that builds the metadata panel

    // Use `d3.json` to fetch the metadata for a sample
    const url = `/metadata/${sample}`;

    d3.json(url).then(function(sampledata) {
      // console.log(sampledata);
    
    
      // Promise Pending  SF Note .then is the Promise
      // const dataPromise = d3.json(url);
      // console.log("Data Promise: ", dataPromise);

      var sample_metadata = d3.select("#sample-metadata")

      // Use selector.html(""); to clear any existing metadata
      sample_metadata.html("");

      // Use `Object.entries` to add each key and value pair to the panel
      Object.entries(sampledata).forEach(function([key,value]){
        var row = sample_metadata.append("panel");
        row.text(`${key}: ${value}`);
        // console.log(`${key}: ${value}`);
      });
    });
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart

    // SF Note Need to reference the bonus.js and put code there.
    // buildGauge(data.WFREQ);

    // function buildGauge(sample) {
    // const url = `/metadata/${sample}`;

      d3.json(url).then(function(sampledata) {
        // console.log(sampledata.WFREQ);
        // level is the # of washes from the selection in the Meta Data
        level = sampledata.WFREQ

        // Semi Circle 180 degress; 9 positions; so we divide 180 degrees by 9 = 20 degrees for each position
        // the 0 degree position is the bottom of 9 so 9 would be (160 degrees -180) and 1 would be (20 degrees - 180)
        // multiply by a negative 1 to keep the needle on the top half of the semi circle.
        var degrees = ((level)*20-180)*-1;
        // alert(degrees);
        radius = .5;
        var radians = degrees * Math.PI / 180;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);

        // Path: may have to change to create a better triangle
        var mainPath = 'M -.0 -0.035 L .0 0.035 L ',
            pathX = String(x),
            space = ' ',
            pathY = String(y),
            pathEnd = ' Z';
        var path = mainPath.concat(pathX,space,pathY,pathEnd);

        var data = [{ type: 'category',
          x: [0], y:[0],
            marker: {size: 28, color:'850000'},
            showlegend: false,
            name: 'speed',
            text: level,
            hoverinfo: 'text+name'
          },
          { values: [81,81/9,81/9,81/9,81/9,81/9,81/9,81/9,81/9,81/9],
            rotation: 90,
            
            text: [" ","8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1"],
            textinfo: 'text',
            textposition:'inside',      
            marker: {colors:['rgba(255,255,255,1)','','','','','','','','','']},
            labels: [" ","8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1"],
            hoverinfo: 'label',
            hole: .5,
            type: 'pie',
            showlegend: false
          }];

        var layout = {
          shapes:[{
              type: 'path',
              path: path,
              fillcolor: '850000',
              line: {
                color: '850000'
              }
            }],
          title: 'Belly Button Washing Frequency <br> Scrubs per Week',
          height: 800,
          width:  900,
          xaxis: {visible: false, range: [-1, 1]},
          yaxis: {visible: false, range: [-1, 1]}
        };
        Plotly.newPlot('gauge', data, layout);

  });
}
    function buildCharts(sample) {

    // @TODO: Use `d3.json` to fetch the sample data for the plots
    const url = `/samples/${sample}`;
    d3.json(url).then(function(chartdata) {

      // @TODO: Build a Bubble Chart using the sample data
      // Set up variables to pull in a list of chart values
      var xval = chartdata.otu_ids;
      var yval = chartdata.sample_values;
      var msize = chartdata.sample_values;
      var mcolor = chartdata.otu_ids;
      var tval = chartdata.otu_labels;
        
      var trace1 = {
        x:xval,
        y:yval,
        text:tval,
        mode:'markers',
        marker:{
          color:mcolor,
          size:msize,
        }
      };
      var bubbledata = [trace1];
      
      var bubblelayout = {
        title: 'OTU ID',
        height: 600,
        width: 800,
      };

      Plotly.newPlot("bubble", bubbledata, bubblelayout);
      
      // @TODO: Build a Pie Chart
      // d3.json(url).then(function(sampledata) {

      var data = [{
        values: yval.slice(0,10), 
        labels: mcolor.slice (0,10),
        type: "pie"
      }];
      
      var layout = {
        height: 600,
        width: 800,
      };
      
      Plotly.plot("pie", data, layout);
    });

  }

  function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    d3.json("/names").then((sampleNames) => {
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });

      // Use the first sample from the list to build the initial plots
      const firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
      // buildGauge(firstSample);
    });
  }

  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
    // buildGauge(newSample);
  }

// Initialize the dashboard
init();