function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    let firstSample = sampleNames[0];
    buildMetadata(firstSample);
    buildCharts(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    console.log("Result is: ", result);
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);
    // 3. Create a variable that holds the samples array. 
    let samples = data.samples;
    resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    console.log(resultArray);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    
    //  5. Create a variable that holds the first sample in the array.
    let firstSample = resultArray[0];
    console.log(`FirstSample is: `,firstSample);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    let otu_ids = firstSample.otu_ids;
    let otu_labels = firstSample.otu_labels;
    let sample_values = firstSample.sample_values;
    let wfreq = data.metadata.filter((entry) => entry.id ==firstSample.id)[0].wfreq;
    console.log('wfreq: ', wfreq);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var otu_ids_GraphData = otu_ids.slice(0,10).reverse().map(id => `OTU ${id}`);
    console.log(otu_ids_GraphData);

    // 8. Create the trace for the bar chart. 
    var barData = {
      x: sample_values.slice(0,10).reverse(),
      y: otu_ids_GraphData,
      text: otu_labels.slice(0,10).reverse(),
      name: `Sample: ${sample.id}`,
      type: "bar",
      orientation: "h"
    };

    // console.log(barData.x);
    // console.log(barData.y);
    // console.log(barData.text);
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: {
        l: 100,
        r: 50,
        t: 50,
        b: 100
      },
      xaxis: {title: "Sample Values"},
      yaxis: {title: "OTU IDs"} 
    };

    var bubbleData = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Portland'
      },
    }

    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      margin: {
        l: 50,
        r: 50,
        t: 100,
        b: 50
      },
      xaxis: {title: "OTU IDs"},
      yaxis: {title: "Sample Values"}
    }
    //console.log('bubble Data: ', bubbleData);

    var gaugeData = {
      domain: { 'x': [0,1], 'y':[0,1]},
      type: 'indicator',
      mode: 'gauge+number',
      value: wfreq,
      gauge:{
        bar: {color: 'black'},
        axis: {range: [0, 10]},
        steps: [
          {range: [0,2], color: 'red'},
          {range: [2,4], color: 'orange'},
          {range: [4,6], color: 'yellow'},
          {range: [6,8], color: 'lightgreen'},
          {range: [8,10], color: 'green'}
        ]
      }
    }

    var gaugeLayout = {
      title: "Belly Button Washing Frequency",
      width:500,
      height: 400,
      margin: {
        l: 50,
        r: 50,
        t: 50,
        b: 50
      },
    }

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", [barData], barLayout);
    Plotly.newPlot("bubble", [bubbleData], bubbleLayout);
    Plotly.newPlot("gauge", [gaugeData],gaugeLayout);
  });
}
