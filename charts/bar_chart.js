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
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
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

    // 3. Create a variable that holds the samples array. 
    let samplesData = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    let selectedSample = samplesData.filter(sampleFilter => sampleFilter.id == sample);
  
    //  5. Create a variable that holds the first sample in the array.
    let firstSample = selectedSample[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    
    let otuIds = firstSample.otu_ids;
    let otuLabels = firstSample.otu_labels;
    let otuValue = firstSample.sample_values;
    console.log(otuIds);
    console.log(otuLabels);
    console.log(otuValue);
    
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    let yticks= otuIds.map(outIdSamples => `OTU ${outIdSamples}`).slice(0,10).reverse();
    console.log(yticks)

    let xticks= otuValue.slice(0,10).reverse();
    let reverseLabels= otuLabels.slice(0,10).reverse();
    

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: xticks,
      y: yticks,
      type: "bar",
      orientation: "h",
      text: reverseLabels
  }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found"
      

    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

 

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIds,
      y: otuValue,
      mode: "markers",
      marker: {
      
        size: otuValue,
        color: otuIds,
        colorscale: "Picnic"
    },
      text: otuLabels,
      type: "scatter"
  }];
    
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
        title: "Bacteria Cultures Per Sample",
        xaxis: {title: "OTU ID"}
    };
    
    // 3. Use Plotly to plot the data with the layout.
        Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
    });
    };

