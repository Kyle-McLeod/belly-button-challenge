const sampleUrl = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
var samplesPromise = d3.json(sampleUrl);

samplesPromise.then(data => console.log(data));

var dropdownMenu = d3.select("#selDataset") 

function populateDropdown(data){
    for (i=0; i < data.names.length; i++) {
        var newOption = dropdownMenu.append("option");
        newOption.attr("value", data.names[i]);
        newOption.text(data.names[i]);
    }
};

function currentSample(data) {
    var sample = {};
    for (i=0; i<data.samples.length; i++) {
        if (dropdownMenu.node().value == data.samples[i].id) {
            sample = data.samples[i];
        };
    };
    return sample
};

function populateDemographics(data) {
    var subjectMetadata = {};
    for (i=0; i<data.metadata.length; i++) {
        if (dropdownMenu.node().value == data.metadata[i].id) {
            subjectMetadata = data.metadata[i];
        };
    };
    console.log(subjectMetadata);
    var metadataKeys = Object.keys(subjectMetadata);
    var metadataValues = Object.values(subjectMetadata);

    var demographicString = "";
    for (i=0; i<metadataKeys.length; i++) {
        var key = metadataKeys[i];
        var value = metadataValues[i];
        
        var newString = `${metadataKeys[i]}: ${metadataValues[i]}<br>`;
        demographicString += newString;
    };

    d3.select("#sample-metadata").html(demographicString);
    
};

function init(data) {
    populateDropdown(data);

    populateDemographics(data);

    var sample = currentSample(data);
    console.log(sample);

    var samplesArray = [];
    for (i=0; i<sample.otu_ids.length; i++) {
        var newSample = {};
        newSample.otu_id = `OTU ${String(sample.otu_ids[i])}`;
        newSample.sample_value = sample.sample_values[i];
        newSample.otu_label = sample.otu_labels[i];
        samplesArray.push(newSample)

    };
    console.log(samplesArray);

    var topTenSamples = samplesArray.sort(function(a,b) {
        return b.sample_value - a.sample_value;
    }).slice(0,10).reverse();
    console.log(topTenSamples);

    var barTrace = {
        x: topTenSamples.map(sample => sample.sample_value),
        y: topTenSamples.map(sample => sample.otu_id),
        text: topTenSamples.map(sample => sample.otu_label),
        type: 'bar',
        orientation: 'h'
    };
    
    var barLayout = {
        title: `Top 10 Sample Values for Subject ${dropdownMenu.node().value}`,
        height: 700,
        width: 1000
    }

    var barTraceData = [barTrace];
    Plotly.newPlot("bar", barTraceData, barLayout);

    var bubbvarrace = {
        x: sample.otu_ids.map(oid => oid),
        y: sample.sample_values.map(value => value),
        text: sample.otu_labels.map(label => label),
        mode: 'markers',
        marker: {
            color: sample.otu_ids.map(oid => oid),
            size: sample.sample_values.map(value => value)
        }
      };
    
    var bubbvarraceData = [bubbvarrace];

    var bubbleLayout = {
        title: `Subject ${dropdownMenu.node().value} Bubble Chart of Sample Values`,
        xaxis: {title: "OTU IDs"},
        showlegend: false,
        height: 700,
        width: 1000
      };
    
    Plotly.newPlot("bubble", bubbvarraceData, bubbleLayout);
};

function updateCharts(data) {
    populateDemographics(data);

    var sample = currentSample(data);
    console.log(sample);

    var samplesArray = [];
    for (i=0; i<sample.otu_ids.length; i++) {
        var newSample = {};
        newSample.otu_id = `OTU ${String(sample.otu_ids[i])}`;
        newSample.sample_value = sample.sample_values[i];
        newSample.otu_label = sample.otu_labels[i];
        samplesArray.push(newSample)

    };
    console.log(samplesArray);

    var topTenSamples = samplesArray.sort(function(a,b) {
        return b.sample_value - a.sample_value;
    }).slice(0,10).reverse();
    console.log(topTenSamples);

    var updateBarX = topTenSamples.map(sample => sample.sample_value);
    var updateBarY = topTenSamples.map(sample => sample.otu_id);
    var updateBarText = topTenSamples.map(sample => sample.otu_label);
    
    Plotly.restyle("bar", "x", [updateBarX]);
    Plotly.restyle("bar", "y", [updateBarY]);
    Plotly.restyle("bar", "text", [updateBarText]);
    Plotly.relayout("bar", "title", `Top 10 Sample Values for Subject ${dropdownMenu.node().value}`);

    var updateBubbleOid = sample.otu_ids.map(oid => oid);
    var updateBubbleValue =  sample.sample_values.map(value => value);
    var updateBubbvarext = sample.otu_labels.map(label => label);

    Plotly.restyle("bubble", "x", [updateBubbleOid]);
    Plotly.restyle("bubble", "y", [updateBubbleValue]);
    Plotly.restyle("bubble", "text", [updateBubbvarext]);
    Plotly.restyle("bubble", "marker.color", [updateBubbleOid]);
    Plotly.restyle("bubble", "marker.size", [updateBubbleValue]);

    Plotly.relayout("bubble", "title", `Subject ${dropdownMenu.node().value} Bubble Chart of Sample Values`);
};

function optionChanged() {
    samplesPromise.then(updateCharts);
};

samplesPromise.then(init);