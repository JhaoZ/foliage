fetch('http://127.0.0.1:5000/get_json_of_tree')
.then(data => {
    return data.json();
    
})
.then(post => {
    console.log(JSON.stringify(post))
    buildTree(JSON.parse(JSON.stringify(post)));
})

fetch('http://127.0.0.1:5000/get_text_by_name/root')
.then(data => {
    return data.json();
    
})
.then(post => {
    map = JSON.parse(JSON.stringify(post));
    changeTextBox(map['text']);
    changeLegend("root")
})



current_node = "root"

function changeLegend(text) {
    console.log("p");
    document.getElementById("legend").innerText = text;
}

function changeTextBox(text) {
    document.getElementById("textbox").value = text;
}


function buildTree(data) { // data as a parameter, passing in a map
        console.log(data.id)


        const width = 800;
        const height = 600;
        const container = d3.select("#visualization");
        const svg = container.append("svg")
            .attr("width", width)
            .attr("height", height)
            .style("position", "absolute")
            .style("top", "0")
            .style("left", "0");
    
        // Convert hierarchical data to a flat structure
        const rootNode = d3.hierarchy(data);
        const links = rootNode.links();
        const nodes = rootNode.descendants();
    
        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.data.id).distance(50))
            .force("charge", d3.forceManyBody().strength(-100))
            .force("center", d3.forceCenter(width / 2, height / 2));
    
        // Render links
        svg.selectAll("line")
            .data(links)
            .enter().append("line")
            .attr("stroke", "#aaa");
    
        // Render nodes
        const nodeElements = container.selectAll(".node")
            .data(nodes)
            .enter().append("div")
            .attr("class", "node").attr("id", d => d.data.id).attr("onclick", "func(this)")
            .html(d => d.data.id);
    
    
    
        // Update positions on simulation tick
        simulation.on("tick", () => {
            svg.selectAll("line")
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);
    
            nodeElements
                .style("left", d => `${d.x - 10}px`) // Centering the node
                .style("top", d => `${d.y - 10}px`); // Centering the node
        });
    // });

}

    
function func(ob) {
    console.log(ob.id);
}

function submit() {
    text = document.getElementById("textbox").value;
    node_name = document.getElementById("fname").value;
    
}