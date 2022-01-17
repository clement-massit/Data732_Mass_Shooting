

let margin_map = { top: 10, bottom: 10, left: 10, right: 10 };

let width_map = 960;
width_map = width_map - margin_map.left - margin_map.right;
let ratio_map = 0.5;
let height_map = width_map * ratio_map;


let svgMap = d3.select('body').append('svg')
    .attr("id", "svg")
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

let div1 = d3.select("body").append("div")   
    .attr("class", "tooltip")               
    .style("opacity", 0);
///////////////////// Création de la carte ////////////////////////////
promises = []
promises.push(d3.json('javascripts/us.json'))
promises.push(d3.json('./data/Mass_shooting_data.json'))

var states_data = {};

all_states = {
    "Alabama"                :  "01",
    "Alaska"                 :  "02",
    "Arizona"                :  "04",
    "Arkansas"               :  "05",
    "California"             :  "06",
    "Colorado"               :  "08",
    "Connecticut"            :  "09",
    "Delaware"               :  "10",
    "District of Columbia"   :  "11",
    "Florida"                :  "12",
    "Georgia"                :  "13",
    "Hawaii"                 :  "15",
    "Idaho"                  :  "16",
    "Illinois"               :  "17",
    "Indiana"                :  "18",
    "Iowa"                   :  "19",
    "Kansas"                 :  "20",
    "Kentucky"               :  "21",
    "Louisiana"              :  "22",
    "Maine"                  :  "23",
    "Maryland"               :  "24",
    "Massachusetts"          :  "25",
    "Michigan"               :  "26",
    "Minnesota"              :  "27",
    "Mississippi"            :  "28",
    "Missouri"               :  "29",
    "Montana"                :  "30",
    "Nebraska"               :  "31",
    "Nevada"                 :  "32",
    "New Hampshire"          :  "33",
    "New Jersey"             :  "34",
    "New Mexico"             :  "35",
    "New York"               :  "36",
    "North Carolina"         :  "37",
    "North Dakota"           :  "38",
    "Ohio"                   :  "39",
    "Oklahoma"               :  "40",
    "Oregon"                 :  "41",
    "Pennsylvania"           :  "42",
    "Rhode Island"           :  "44",
    "South Carolina"         :  "45",
    "South Dakota"           :  "46",
    "Tennessee"              :  "47",
    "Texas"                  :  "48",
    "Utah"                   :  "49",
    "Vermont"                :  "50",
    "Virginia"               :  "51",
    "Washington"             :  "53",
    "West Virginia"          :  "54",
    "Wisconsin"              :  "55",
    "Wyoming"                :  "56",
    "Puerto Rico"            :  "72",
    "Virgin Islands"         :  "78"
  }


  //////////////////////////////////////////////////////////////////BAR CHART//////////////////////////////////////////////////////////////////

const margin = {top: 20, right: 20, bottom: 90, left: 120},
width = 800 - margin.left - margin.right,
height = 400 - margin.top - margin.bottom;

const x = d3.scaleBand()
.range([0, width])
.padding(0.1);

const y = d3.scaleLinear()
.range([height, 0]);

let svg = d3.select("body").append("svg")
.attr("id", "svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let div2 = d3.select("body").append("div")   
    .attr("class", "tooltip")               
    .style("opacity", 0);

let total_death = 0;
states_data = {};
var cpt = 0

/////////////////////////////////// Display ///////////////////////////////////

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
    

    states = [];
    kills = []
    
    for(const [state, values] of Object.entries(states_data)){
        states.push(state);
        kills.push(values["kill"])
    }

    data2 = []
 
    for(let i in states_data){
    
        tmp = {}
        tmp["id"]  = states_data[i]["id"]
        tmp["State"] = i
        tmp["# Killed"] = states_data[i]["kill"]
        data2.push(tmp)
    }
    
    
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
    var quantile = d3.scaleQuantile()
        .domain([0, d3.max(data, e => +e["# Killed"])])
        .range(d3.range(9));
    
    var legend = svgMap.append('g')
        .attr('transform', 'translate(850, 150)')
        .attr('id', 'legend');
        
    legend.selectAll('.colorbar')
        .data(d3.range(9))
        .enter().append('svg:rect')
            .attr('y', d => d * 20 + 'px')
            .attr('height', '20px')
            .attr('width', '20px')
            .attr('x', '0px')
            .attr("class", d => "Blues q" + d + "-9")

    var legendScale = d3.scaleLinear()
        .domain([0, d3.max(data, e => +e["# Killed"])])
        .range([0, 9 * 20]);
    
    var legendAxis = svg.append("g")
        .attr('transform', 'translate(550, -100)')
        .call(d3.axisRight(legendScale).ticks(6));
    console.log(data2)
    data2.forEach(function(e,i) {
        d3.select("#d" + e["id"])     
            .attr("class", d =>"state q" + quantile(+e["# Killed"]) + "+9")   
            .on("mouseover", function(event, d) {
                console.log(e)
                div1.transition()        
                    .duration(200)      
                    .style("opacity", .9);
                div1.html("<b>State : </b>" + data2[i]["State"] + "<br>"
                        + "<b>Kills : </b>" + data2[i]["# Killed"] + "<br>")
                    .style("left", (event.pageX + 30) + "px")     
                    .style("top", (event.pageY - 30) + "px");
                    
            })
            .on("mouseout", function(event, d) {
                div1.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
    });
    d3.select("select").on("change", function() {
        d3.selectAll("svg").attr("class", this.value);
    });




    ///////////////////// Création du barchart ////////////////////////////

    data2.forEach(d => d["# Killed"] = +d["# Killed"]);

    // Mise en relation du scale avec les données de notre fichier
    // Pour l'axe X, c'est la liste des pays
    // Pour l'axe Y, c'est le max des populations
    //console.log(data.map(d => d["State"]))
    x.domain(data2.map(d => d["State"]));
    y.domain([0, d3.max(kills)]);
    
    
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

    // Ajout des bars en utilisant les données de notre fichier data.tsv
    // La largeur de la barre est déterminée par la fonction x
    // La hauteur par la fonction y en tenant compte de la population
    // La gestion des events de la souris pour le popup
  
    
    

    svg.selectAll(".bar")
        .data(data2)
        .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d["State"]))
            .attr("width", x.bandwidth())
            .attr("y", d => y(d["# Killed"]))
            .attr("height", d => height - y(d["# Killed"]))
            .on("mouseover", function(event, d) {
                div2.transition()        
                    .duration(200)      
                    .style("opacity", .9);
                
                div2.html("State : " + data2[d]["State"] + "<br>Kills : " + data2[d]["# Killed"])
                    .style("left", (event.pageX + 10) + "px")     
                    .style("top", (event.pageY - 50) + "px");
            })
            .on("mouseout", function(event, d) {
                div2.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
    

});






    
