

let margin_map = { top: 10, bottom: 10, left: 10, right: 10 };

let width_map = 960;
width_map = width_map - margin_map.left - margin_map.right;
let ratio_map = 0.5;
let height_map = width_map * ratio_map;

let currentId = 0;

let svgMap = d3.select('body').append('svg')
    .attr('class', 'center-container')
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

let g = svgMap.append("g")
    .attr('class', 'center-container center-items us-state')
    .attr('transform', 'translate(' + margin_map.left + ',' + margin_map.top + ')')
    .attr('width', width_map + margin_map.left + margin_map.right)
    .attr('height', height_map + margin_map.top + margin_map.bottom);

Promise.resolve(d3.json('javascripts/us.json')).then(function (us) {
    g.append("g")
        .attr("id", "counties")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.states).features)
        .enter().append("path")
        .attr("d", path_map)
        .attr("class", "county-boundary")
        .on('mouseover', function (d) {
            tableFirstId = 0;
            displayStateDeath(currentId);
            //drawPieCharts(getStateDataForPie(currentId));
            //setViewLabel(currentId);
            //showTable(currentId);
            //showBarChart(currentId);
            console.log(currentId);
        });
});

function displayStateDeath(currentId) {

}



var datas;
var total_death = 0;
var states_data = new Map();
var cpt = 0


d3.json("./data/Mass_shooting_data.json").then(function (data) {
    datas = data
    for (var i = 0; i < data.length; i++) {
        total_death += parseInt(data[i]["# Killed"]);
        if (!states_data.has(data[i]["State"])) {
            state = {};
            state["id"] = cpt;
            state["kill"] = 0;
            states_data[data[i]["State"]] = state;

            cpt++;
        }
        states_data[data[i]["State"]]["kill"] += data[i]["# Killed"];

        /*
                console.log(data[i]["Incident ID"]);
                console.log(data[i]["Incident Date"]);
                console.log(data[i]["State"]);
                console.log(data[i]["City Or County"]);
                console.log(data[i]["Address"]);
                console.log(data[i]["# Killed"]);
                console.log(data[i]["# Injured"]);
                console.log(data[i]["Operations"]);*/
    }

});

console.log(states_data);
console.log(total_death);


const margin_barchart = { top: 20, right: 20, bottom: 90, left: 120 },
    width_barchart = 800 - margin_barchart.left - margin_barchart.right,
    height_barchart = 400 - margin_barchart.top - margin_barchart.bottom;

const x_barchart = d3.scaleBand()
    .range([0, width_barchart])
    .padding(0.1);

const y_barchart = d3.scaleLinear()
    .range([height_barchart, 0]);

const svg_barchart = d3.select("body").append("svg_barchart")
    .attr("id", "svg")
    .attr("width", width_barchart + margin_barchart.left + margin_barchart.right)
    .attr("height", height_barchart + margin_barchart.top + margin_barchart.bottom)
    .append("g")
    .attr("transform", "translate(" + margin_barchart.left + "," + margin_barchart.top + ")");

const div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 1);



states_data.forEach(state => {

    // Mise en relation du scale avec les données de notre fichier
    // Pour l'axe X, c'est la liste des pays
    // Pour l'axe Y, c'est le max des populations
    x.domain(state.getKey());
    y.domain(state["kill"]);

    // Ajout de l'axe X au SVG
    // Déplacement de l'axe horizontal et du futur texte (via la fonction translate) au bas du SVG
    // Selection des noeuds text, positionnement puis rotation
    svg_barchart.append("g")
        .attr("transform", "translate(0," + height_barchart + ")")
        .call(d3.axisBottom(x).tickSize(0))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

    // Ajout de l'axe Y au SVG avec 6 éléments de légende en utilisant la fonction ticks (sinon D3JS en place autant qu'il peut).
    svg_barchart.append("g")
        .call(d3.axisLeft(y).ticks(6));

    // Ajout des bars en utilisant les données de notre fichier data.tsv
    // La largeur de la barre est déterminée par la fonction x
    // La hauteur par la fonction y en tenant compte de la population
    // La gestion des events de la souris pour le popup
    svg_barchart.selectAll(".bar")
        .data(states_data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", x(state.getKey()))
        .attr("width", x.bandwidth())
        .attr("y", y(state["kill"]))
        .attr("height", height_barchart - y(state["kill"]))
        
});
