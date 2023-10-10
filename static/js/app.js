const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

d3.json(url).then(function(data) {
  console.log(data);
});

function init() {
  let dropdownMenu = d3.select("#selDataset");

  // fetch JSON as data and assign names 
  d3.json(url).then((data) => {
    let names = data.names;
    // console.log(names);

    // loop through names to get list and append to dropdown menu
    names.forEach((id) => {
      console.log(id);
      dropdownMenu.append("option")
        .text(id)
        .property("value", id);
    });

    let first_id = names[0];
    
    //log value
    console.log(first_id);
    console.log("test message");

    // Call functions to build page
    build_bar_chart(first_id);
    build_bubble_chart(first_id);
    build_metadata(first_id);
    build_gauge_chart(first_id);
  });

  // event listener to call an update when dropdown selection changes
  dropdownMenu.on("change", function() {
    let selected_id = dropdownMenu.property("value");
    updatePlotly(selected_id);
  });
};

// Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
function build_bar_chart(sample_id) {
  d3.json(url).then((data) => {

    //
    let sampleData = data.samples;

    //filter to current sample selection
    let filterData = sampleData.filter(result => result.id == sample_id);
    let valueData = filterData[0];

    // get relavant data from JSON
    let sample_values = valueData.sample_values;
    let otu_ids = valueData.otu_ids;
    let otu_labels = valueData.otu_labels;


    //define barChart parameters
    let barChart = {
      y: (otu_ids).slice(0,10).map(id => `OTU ${id}`).reverse(),
      x: (sample_values).slice(0,10).reverse(),
      labels: (otu_labels).slice(0,10).reverse(),
      type: "bar",
      orientation: "h"
    };

    let barLayout = {
      title: "Top 10 OTUs for Sample",
      thickness: 50,
    };
    

    //render the chart with plotly
    Plotly.newPlot("bar", [barChart], barLayout)
  });
};

// Create a bubble chart that displays each sample.
function build_bubble_chart(sample_id) {
  
  // retrieve data 
  d3.json(url).then((data) => {
    let sampleData = data.samples;

    //filter data to current sample
    let filterData = sampleData.filter(result => result.id == sample_id);
    let valueData = filterData[0];
    let sample_values = valueData.sample_values;
    let otu_ids = valueData.otu_ids;
    let otu_labels = valueData.otu_labels;

    // define bubble chart parameters
    let bubbleChart = {
      x: sample_values,
      y: otu_ids,
      labels: otu_labels, 
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "icefire"
      }
    };

    let bubbleLayout = {
      title: "Bacteria per Sample",
      hovermode: "closest",
      xaxis: {title: "OTU ID"}
    };

    Plotly.newPlot("bubble", [bubbleChart], bubbleLayout)
  });
};

// Display demographic data
function build_metadata(sample_id) {
  d3.json(url).then((data) => {
    let metadata = data.metadata;
    let filterData = metadata.filter(result => result.id == sample_id);
    let valueData = filterData[0];
    d3.select("#sample-metadata").html("");

    Object.entries(valueData).forEach(([key, value]) => {
      d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
    });

  });
};

function build_gauge_chart(sample_id) {
  d3.json(url).then((data) => {
    let metadata = data.metadata;
    let filterData = metadata.filter(result => result.id == sample_id);
    let valueData = filterData[0];  
    let numScrubs = valueData.wfreq;
    console.log(numScrubs)
    let gaugeLayout = {
      title: "Number of Scrubs per Week",
      

    }
  });
};

console.log("test message for console");



function updatePlotly(sample_id) { 

  // Log the new value
  console.log(sample_id); 

  // Call all functions 
  build_bar_chart(sample_id);
  build_bubble_chart(sample_id);
  build_metadata(sample_id);
  build_gauge_chart(sample_id);
};

// call function to initialize
init();
