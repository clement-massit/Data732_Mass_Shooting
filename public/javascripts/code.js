

let margin_map = { top: 10, bottom: 10, left: 10, right: 10 };

let width_map = 750;
width_map = width_map - margin_map.left - margin_map.right;
let ratio_map = 0.7;
let height_map = width_map * ratio_map;


let svgMap = d3.select('.card')
    .append('svg')
    .attr("id", "cards")
    .attr('class', 'center-container Blues')
    .attr('height', height_map + margin_map.top + margin_map.bottom)
    .attr('width', width_map + margin_map.left + margin_map.right)
    .attr('x', 0)
    .attr('y', 0);

svgMap.append('rect')
    .attr('class', 'background center-container')
    .attr('height', height_map + margin_map.top + margin_map.bottom)
    .attr('width', width_map + margin_map.left + margin_map.right)

let projection_map = d3.geoAlbersUsa()
    .translate([width_map / 2, height_map / 2])
    .scale(width_map);

let path_map = d3.geoPath().projection(projection_map);

let gmap = svgMap.append("g")
    .attr('class', 'center-container center-items us-state')
    .attr('transform', 'translate(' + margin_map.left + ',' + margin_map.top + ')')
    .attr('width', width_map + margin_map.left + margin_map.right)
    .attr('height', height_map + margin_map.top + margin_map.bottom);

let div1 = d3.select(".card").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

///////////////////// Création de la carte ////////////////////////////
promises = []
promises.push(d3.json('javascripts/us2.json'))
promises.push(d3.json('./data/Mass_shooting_data.json'))

var states_data = {};

all_states = {
    "Alabama": "01",
    "Alaska": "02",
    "Arizona": "04",
    "Arkansas": "05",
    "California": "06",
    "Colorado": "08",
    "Connecticut": "09",
    "Delaware": "10",
    "District of Columbia": "11",
    "Florida": "12",
    "Georgia": "13",
    "Hawaii": "15",
    "Idaho": "16",
    "Illinois": "17",
    "Indiana": "18",
    "Iowa": "19",
    "Kansas": "20",
    "Kentucky": "21",
    "Louisiana": "22",
    "Maine": "23",
    "Maryland": "24",
    "Massachusetts": "25",
    "Michigan": "26",
    "Minnesota": "27",
    "Mississippi": "28",
    "Missouri": "29",
    "Montana": "30",
    "Nebraska": "31",
    "Nevada": "32",
    "New Hampshire": "33",
    "New Jersey": "34",
    "New Mexico": "35",
    "New York": "36",
    "North Carolina": "37",
    "North Dakota": "38",
    "Ohio": "39",
    "Oklahoma": "40",
    "Oregon": "41",
    "Pennsylvania": "42",
    "Rhode Island": "44",
    "South Carolina": "45",
    "South Dakota": "46",
    "Tennessee": "47",
    "Texas": "48",
    "Utah": "49",
    "Vermont": "50",
    "Virginia": "51",
    "Washington": "53",
    "West Virginia": "54",
    "Wisconsin": "55",
    "Wyoming": "56",
    "Puerto Rico": "72",
    "Virgin Islands": "78"
}

/////////////////////////////////// Display Carte ///////////////////////////////////
let total_death = 0;
states_data = {};
var cpt = 0




Promise.all(promises).then(function (values) {
    let us = values[0]
    let data = values[1]
    cpt = 0
    for (var i = 0; i < data.length; i++) {
        total_death += parseInt(data[i]["# Killed"]);

        if (!states_data.hasOwnProperty(data[i]["State"])) {
            state = {};
            state["id"] = all_states[data[i]["State"]];
            state["kill"] = 0;
            states_data[data[i]["State"]] = state;

            cpt++;
        }
        states_data[data[i]["State"]]["kill"] += data[i]["# Killed"];

    }
    

    let states = [];
    let kills = []

    for (const [state, values] of Object.entries(states_data)) {
        states.push(state);
        kills.push(values["kill"])
    }

    data2 = []

    for (let i in states_data) {

        tmp = {}
        tmp["id"] = states_data[i]["id"]
        tmp["State"] = i
        tmp["# Killed"] = states_data[i]["kill"]
        data2.push(tmp)
    }
    max_kill = Math.max(...kills)


    ///////////////////////////////////////////////// CIRCULAR POINTS ////////////////////////////////////////////////////////

    // set the dimensions and margins of the graph
    var width_circular = 750
    var height_circular = 531

    // append the svg object to the body of the page
    var svg_circular = d3.select(".card")
        .append("svg")
        .attr("id", "cards")
        .attr("width", width_circular)
        .attr("height", height_circular)

    YlOrRd = ["#ffeda0", "#FFA536", "#f03b20"]
    range_color = ["#ffffb2", "#e31a1c"]
    var color = d3.scaleLinear()
        .domain([0, max_kill])
        .range(range_color);

    // Size scale for countries
    var size = d3.scaleLinear()
        .domain([0, 200])
        .range([7, 55])  // circle will be between 7 and 55 px wide

    var mouseover = function (d) {
        div2
            .style("opacity", 1)
    }

    var mousemove = function (d) {
        div2
            .html("State : " + d["State"] + "<br>Kills : " + d["# Killed"])
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY + 20) + "px")
    }

    var mouseleave = function (d) {
        div2
            .style("opacity", 0)
    }

    // Initialize the circle: all located at the center of the svg area
    var node = svg_circular.append("g")
        .selectAll("circle")
        .data(data2)
        .enter()
        .append("circle")
        .attr("r", d => size(d["# Killed"]))
        .attr("cx", width_circular / 2)
        .attr("cy", height_circular / 2)
        .style("fill", function (data2) {

            return color(data2["# Killed"])
        })
        .style("fill-opacity", 0.99)
        .attr("stroke", "#612420")
        .style("stroke-width", 2)
        .on("mouseover", mouseover) // What to do when hovered
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
        .call(d3.drag() // call specific function when circle is dragged
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))

    svg_circular.append("text")
        .attr("x", (width_circular / 2))
        .attr("y", 35)
        .attr("text-anchor", "middle")
        .style("font-size", "24px")
        .attr("font-family", "sans-serif")
        .text("Circular Packing concerning mass shooting");






    // Features of the forces applied to the nodes:
    var simulation = d3.forceSimulation()
        .force("center", d3.forceCenter().x(width_circular / 2).y(height_circular / 2)) // Attraction to the center of the svg area
        .force("charge", d3.forceManyBody().strength(1)) // Nodes are attracted one each other of value is > 0
        .force("collide", d3.forceCollide().strength(.2).radius(function (d) { return (size(d["# Killed"]) + 3) }).iterations(1)) // Force that avoids circle overlapping

    // Apply these forces to the nodes and update their positions.
    // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
    simulation
        .nodes(data2)
        .on("tick", function (d) {
            node
                .attr("cx", function (d) { return d.x; })
                .attr("cy", function (d) { return d.y; })
        });

    // What happens when a circle is dragged?
    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(.03).restart();
        d.fx = d.x;
        d.fy = d.y;
    }
    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }
    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(.03);
        d.fx = null;
        d.fy = null;
    }

    //////////////////////////////////////////////////////////////////BAR CHART//////////////////////////////////////////////////////////////////

    const margin = { top: 20, right: 20, bottom: 90, left: 70 },
        width = 750 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    const x = d3.scaleBand()
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .range([height, 0]);

    let svg = d3.select(".card").append("svg")
        .attr("id", "svg")
        .attr("id", "cards")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    let div2 = d3.select(".card").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);


    /////////////////////////////////////////////////CARTE/////////////////////////////////////////////////

    var myColor = d3.scaleLinear()
        .domain([1, max_kill])
        .range(["#ffffb2", "#e31a1c"])


    array_states_data = Object.values(states_data)

    gmap.append("g")
        .attr("id", "counties")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.states).features)
        .enter().append("path")
        .attr("d", path_map)
        .attr('id', d => "d" + d["id"])
        .attr("class", "county-boundary")


    /*
        gmap.append("g")
            .selectAll("path")
            .data(topojson.feature(us, us.objects.states).features)
            .enter().append("path")
            .attr('id', d => "d" + d["id"])
            .attr("d", path_map);
    */
    //Append a defs (for definition) element to your SVG
    var defs = svg.append("defs");

    //Append a linearGradient element to the defs and give it a unique id
    var linearGradient = defs.append("linearGradient")
        .attr("id", "linear-gradient");

    //Set the color for the start (0%)
    linearGradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#ffffb2"); //light blue

    //Set the color for the end (100%)
    linearGradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#e31a1c"); //dark blue
    //Horizontal gradient
    linearGradient
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "0%")
        .attr("y2", "100%");

    svgMap.append("rect")
        .attr("width", 20)
        .attr("height", 180)
        .attr('transform', 'translate(645, 100)')
        .style("fill", "url(#linear-gradient)");

    svgMap.append("text")
        .attr("x", (width_map / 2))
        .attr("y", 20 + margin_map.top)
        .attr("text-anchor", "middle")
        .attr("padding-bottom", "20px")
        .style("font-size", "24px")
        .attr("font-family", "sans-serif")
        .text("Distribution of mass shootings by states");

    var legendScale = d3.scaleLinear()
        .domain([0, max_kill])
        .range([0, 9 * 20]);


    var legendAxis = svgMap.append("g")
        .attr('transform', 'translate(670, 100)')
        .call(d3.axisRight(legendScale).ticks(6))


    data2.forEach(function (e, i) {
        d3.select("#d" + e["id"])
            .style("fill", function (d) {
                return myColor(data2[i]["# Killed"])
            })
            .on("mouseover", function (d) {
                div1.transition()
                    .duration(200)
                    .style("opacity", 0.9);
                div1.html("<b>State : </b>" + data2[i]["State"] + "<br>"
                    + "<b>Kills : </b>" + data2[i]["# Killed"] + "<br>")
                    .style("left", (event.pageX + 20) + "px")
                    .style("top", (event.pageY + 10) + "px");
            })
            .on("mouseout", function () {
                div1.style("opacity", 0);
                div1.html("")
                    .style("left", "-500px")
                    .style("top", "-500px");
            });

    });

    d3.select("select")
        .on("change", function () {
            d3.selectAll("svg").attr("class", this.value);
        });



    ///////////////////// Création du barchart ////////////////////////////
    let globalPopulation = { "Alabama": 4779736, "Alaska": 710231, "Arizona": 6392017, "Arkansas": 2915918, "California": 37253956, "Colorado": 5029196, "Connecticut": 3574097, "Delaware": 897934, "District of Columbia": 601723, "Florida": 18801310, "Georgia": 9687653, "Hawaii": 1360301, "Idaho": 1567582, "Illinois": 12830632, "Indiana": 6483802, "Iowa": 3046355, "Kansas": 2853118, "Kentucky": 4339367, "Louisiana": 4533372, "Maine": 1328361, "Maryland": 5773552, "Massachusetts": 6547629, "Michigan": 9883640, "Minnesota": 5303925, "Mississippi": 2967297, "Missouri": 5988927, "Montana": 989415, "Nebraska": 1826341, "Nevada": 2700551, "New Hampshire": 1316470, "New Jersey": 8791894, "New Mexico": 2059179, "New York": 19378102, "North Carolina": 9535483, "North Dakota": 672591, "Ohio": 11536504, "Oklahoma": 3751351, "Oregon": 3831074, "Pennsylvania": 12702379, "Rhode Island": 1052567, "South Carolina": 4625364, "South Dakota": 814180, "Tennessee": 6346105, "Texas": 25145561, "Utah": 2763885, "Vermont": 625741, "Virginia": 8001024, "Washington": 6724540, "West Virginia": 1852994, "Wisconsin": 5686986, "Wyoming": 563626 };

    data2.forEach(d => d["# Killed"] = +d["# Killed"]);

    let key_max_globalpop = Object.keys(globalPopulation).reduce((a, b) => globalPopulation[a] > globalPopulation[b] ? a : b)

    var arraystate = Object.keys(globalPopulation)
    var arraypop = Object.values(globalPopulation)

    // Mise en relation du scale avec les données de notre fichier
    // Pour l'axe X, c'est la liste des pays
    // Pour l'axe Y, c'est le max des populations

    x.domain(Object.keys(globalPopulation));
    y.domain([0, globalPopulation[key_max_globalpop]]);


    // Ajout de l'axe X au SVG
    // Déplacement de l'axe horizontal et du futur texte (via la fonction translate) au bas du SVG
    // Selection des noeuds text, positionnement puis rotation
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSize(0))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");
    // Ajout de l'axe Y au SVG avec 6 éléments de légende en utilisant la fonction ticks (sinon D3JS en place autant qu'il peut).
    svg.append("g")
        .call(d3.axisLeft(y).ticks(6));
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 + margin.top)
        .attr("text-anchor", "middle")
        .style("font-size", "24px")
        .attr("font-family", "sans-serif")
        .text("Population by states in USA");

    // Ajout des bars en utilisant les données de notre fichier data.tsv
    // La largeur de la barre est déterminée par la fonction x
    // La hauteur par la fonction y en tenant compte de la population
    // La gestion des events de la souris pour le popup
    var color_chart = ["#f7fbff", "#e1edf8", "#cadef0", "#abcfe6", "#82badb", "#59a1cf", "#3787c0", "#1c6aaf", "#0b4d94", "#08306b"]

    svg.selectAll(".bar")
        .data(arraystate)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d))
        .attr("width", x.bandwidth())
        .attr("y", d => y(globalPopulation[d]))
        .attr("height", d => height - y(globalPopulation[d]))
        .style("fill", color_chart[6])
        .on("mousemove", function (e, d) {
            div2.html("State : " + e + "<br>Population : " + arraypop[d])
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY + 20) + "px");


        })
        .on("mouseover", function (event, d) {
            div2
                .style("opacity", 0.9);
        })
        .on("mouseleave", function (d) {
            div2.transition()
                .duration(100)
                .style("opacity", 0);
        });

    

});


