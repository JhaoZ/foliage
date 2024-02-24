// INITIALIZE ALL TO ROOT

drawTree();
jumpNode("root");
document.getElementById("displaygraph").style.display  = "none";


function drawTree() {
    fetch('http://127.0.0.1:5000/get_json_of_tree')
    .then(data => {
        return data.json();
    })
    .then(post => {
        // console.log(JSON.parse(JSON.stringify(post)));
        buildTree(JSON.parse(JSON.stringify(post)));
    })
}



current_node = "root"

function changeLegend(text) {
    document.getElementById("legend").innerText = text;
}

function changeTextBox(text) {
    document.getElementById("textbox").value = text;
}


function buildTree(data) { // data as a parameter, passing in a map
        console.log(data.id)

        d3.select("#visualization").selectAll("*").remove();

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
            .force("link", d3.forceLink(links).id(d => d.data.id).distance(function(d){
                console.log(d);
                return d.target.data.difference * 100;
            }))
            .force("charge", d3.forceManyBody().strength(-500))
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
            .attr("class", "node").attr("id", d => d.data.id).attr("onclick", "clicknode(this)").attr("onmouseover", "hovernode(this)")
            .html(d => String(d.data.id).substring(0,7));
    
    
    
        // Update positions on simulation tick
        simulation.on("tick", () => {
            svg.selectAll("line")
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);
    
            nodeElements
                .style("left", d => `${d.x - 20}px`) // Centering the node
                .style("top", d => `${d.y - 20}px`); // Centering the node
        });
    // });

}

    
function clicknode(ob) {
    clicked_node_name = ob.id;
    jumpNode(clicked_node_name);
}

function hovernode(ob) {
    hover_node_name = ob.id
    fetch('http://127.0.0.1:5000/get_commit_by_name/' + hover_node_name)
    .then(data => {
        return data.json();
    })
    .then(post => {
        map = JSON.parse(JSON.stringify(post));
        document.getElementById(hover_node_name).title = map['text']
    });
}

function jumpNode(name) {
    console.log("JUMPING");
    fetch('http://127.0.0.1:5000/get_text_by_name/' + name)
    .then(data => {
        return data.json();
    })
    .then(post => {
        map = JSON.parse(JSON.stringify(post));
        console.log(map['text']);
        changeTextBox(map['text']);
        changeLegend(name)
    });
    current_node = name;
}

async function submit() {
    the_text = document.getElementById("textbox").value;
    the_text.replace(/\n/g , "\\n");
    node_name = document.getElementById("fname").value;
    commit_mes = document.getElementById("commitMessage").value;
    url = 'http://127.0.0.1:5000/add_node/' + current_node + '/' + node_name + '/'
    // post request to server to add a new node
    await fetch (url, {
        method: "POST",
        body: JSON.stringify({
            text: the_text,
            commit: commit_mes,
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    drawTree();
    jumpNode(node_name);
}

function setgraphcode() {
    fetch('http://127.0.0.1:5000/get_graph')
    .then(data => {
        return data.json();
    })
    .then(post => {
        str = JSON.parse(JSON.stringify(post))['text'];
        document.getElementById("thegraph").src = "data:image/png;base64, " + str;

    })
}

function showgraph() {
    document.getElementById("displaygraph").style.display  = 'block';
    document.getElementById("visualization").style.display  = 'none';

    
    setgraphcode();
    
}

function showtree() {
    document.getElementById("displaygraph").style.display  = 'none';
    document.getElementById("visualization").style.display  = 'block';
}

