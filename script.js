let slideramt = -6109585200000;
let dateFilter = [
  "all",
  ["<=", ["get", "start_epoch"], slideramt],
  [">", ["get", "end_epoch"], slideramt],
];
let slider = document.getElementById("dateslider");
slider.addEventListener("input", (event) => {
  slideramt = parseInt(event.target.value);
  dateFilter = [
    "all",
    ["<=", ["get", "start_epoch"], slideramt],
    [">", ["get", "end_epoch"], slideramt],
  ];
  map.setFilter("outline-layer", dateFilter);
  map.setFilter("fill-layer", dateFilter);
  map.setFilter("text-labels", dateFilter);
  map.setFilter("plantations", dateFilter);
});

let amount = document.getElementById("amount");
let date = new Date(slideramt).toDateString();
amount.innerHTML = date;

slider.oninput = function (input) {
  date = new Date(slideramt).toDateString();
  amount.innerHTML = date;
};

mapboxgl.accessToken =
  "pk.eyJ1Ijoia2VycnliYW5uZW4iLCJhIjoiY2owNXlzamEwMG80cTMycXJ1OTN3cGhuMiJ9.mtAv-FAXTH-capn2iRzm7g";

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/kerrybannen/cluh2t0cj01dc01qfbkfs5ehw",
  center: [-78.83, 36.1],
  zoom: 12,
  projection: "mercator",
});

const nav = new mapboxgl.NavigationControl({
  showCompass: false,
});
map.addControl(nav, "bottom-right");

let hoveredTractId = null;

map.on("load", () => {
  map.addSource("cameron", {
    type: "geojson",
    data: "cameron.geojson",
    generateId: true,
  });

  map.addSource("centroids", {
    type: "geojson",
    data: "cameron_centroids.geojson",
    generateId: true,
  });

  map.addSource("plantations", {
    type: "geojson",
    data: "plantations.geojson",
  });

  map.addSource("satellite", {
    type: "raster",
    url: "mapbox://mapbox.satellite",
  });

  map.addLayer({
    id: "satellite-layer",
    type: "raster",
    source: "satellite",
    "source-layer": "mapbox-satellite",
    layout: {
      visibility: "none",
    },
  });

  map.addLayer({
    id: "fill-layer",
    type: "fill",
    source: "cameron",
    paint: {
      "fill-color": "#ffffff",

      /* ["match", ["get", "owner"],
        "Richard Bennehan", 
        "#ebadad",
        "Thomas D. Bennehan",
        "#ebadad",
        "Duncan Cameron",
        "#add6eb",
        "Margaret B. Cameron",
        "#ebc2ad",
        "Mildred C. Cameron",
        "#ebe1ad",
        "Paul C. Cameron",
        "#b8adeb"] */

      "fill-outline-color": "#ffffff",
      "fill-opacity": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        0.8,
        0.5,
      ],
    },
    filter: dateFilter,
  });

  map.addLayer({
    id: "outline-layer",
    type: "line",
    source: "cameron",
    visibility: "visible",
    paint: {
      "line-width": 0.4,
      "line-color": "#707070",
    },
    filter: dateFilter,
  });

  map.addLayer({
    id: "text-labels",
    type: "symbol",
    source: "centroids",
    layout: {
      "text-field": ["get", "from"],
      "text-variable-anchor": ["center"],
      "text-radial-offset": 0,
      "text-justify": "center",
      visibility: "visible",
    },
    paint: {
      "text-halo-color": "#FFFFFF",
      "text-halo-width": 1,
      "text-halo-blur": 1,
      "text-color": "#3d3d3d",
    },
    filter: dateFilter,
  });

  map.addLayer({
    id: "plantations",
    type: "symbol",
    source: "plantations",
    layout: {
      "text-field": ["get", "name"],
      "text-variable-anchor": ["center", "left", "right", "top", "bottom"],
      "text-radial-offset": 0,
      "text-justify": "auto",
      visibility: "none",
    },
    paint: {
      "text-halo-color": "#FFFFFF",
      "text-halo-width": 1,
      "text-halo-blur": 1,
      "text-color": "#6e5757",
    },
    filter: dateFilter,
  });

  map.setLayoutProperty("text-labels", "text-field", [
    "format",
    ["get", "owner"],
    {
      "font-scale": 0.9,
      "text-font": ["literal", ["DIN Pro Medium", "Arial Unicode MS Regular"]],
    },
    "\n",
    "from",
    {
      "font-scale": 0.7,
      "text-font": ["literal", ["DIN Pro Medium", "Arial Unicode MS Regular"]],
    },
    "\n",
    ["get", "from"],
    {
      "font-scale": 0.7,
      "text-font": ["literal", ["DIN Pro Medium", "Arial Unicode MS Regular"]],
    },
  ]);

  map.setLayoutProperty("plantations", "text-field", [
    "format",
    ["get", "name"],
    {
      "font-scale": 0.7,
      "text-font": ["literal", ["DIN Pro Medium", "Arial Unicode MS Regular"]],
    },
  ]);

  const satelliteToggle = document.querySelector("#satellite-toggle");
  const labelsToggle = document.querySelector("#labels-toggle");
  const bordersToggle = document.querySelector("#borders-toggle");
  const plantationsToggle = document.querySelector("#plantations-toggle");

  satelliteToggle.addEventListener("change", () => {
    if (satelliteToggle.checked) {
      map.setLayoutProperty("satellite-layer", "visibility", "visible");
      map.setPaintProperty("outline-layer", "line-color", "#DBDBDB");
      map.setPaintProperty("fill-layer", "fill-opacity", [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        0.5,
        0.2,
      ]);
      map.setPaintProperty("text-labels", "text-color", "#FFFFFF");
      map.setPaintProperty("text-labels", "text-halo-color", "#000000");
      map.setPaintProperty("plantations", "text-color", "#FFFFFF");
      map.setPaintProperty("plantations", "text-halo-color", "#000000");
    } else {
      map.setLayoutProperty("satellite-layer", "visibility", "none");
      map.setPaintProperty("outline-layer", "line-color", "#707070");
      map.setPaintProperty("fill-layer", "fill-opacity", [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        0.8,
        0.5,
      ]);
      map.setPaintProperty("text-labels", "text-color", "#646464");
      map.setPaintProperty("text-labels", "text-halo-color", "#FFFFFF");
      map.setPaintProperty("plantations", "text-color", "#646464");
      map.setPaintProperty("plantations", "text-halo-color", "#FFFFFF");
    }
  });

  labelsToggle.addEventListener("change", () => {
    if (labelsToggle.checked) {
      map.setLayoutProperty("text-labels", "visibility", "visible");
    } else {
      map.setLayoutProperty("text-labels", "visibility", "none");
    }
  });

  bordersToggle.addEventListener("change", () => {
    if (bordersToggle.checked) {
      map.setLayoutProperty("outline-layer", "visibility", "visible");
    } else {
      map.setLayoutProperty("outline-layer", "visibility", "none");
    }
  });

  plantationsToggle.addEventListener("change", () => {
    if (plantationsToggle.checked) {
      map.setLayoutProperty("plantations", "visibility", "visible");
    } else {
      map.setLayoutProperty("plantations", "visibility", "none");
    }
  });

  map.on("mouseenter", "fill-layer", () => {
    map.getCanvas().style.cursor = "pointer";
  });

  map.on("mouseleave", "fill-layer", () => {
    map.getCanvas().style.cursor = "";
  });

  map.on("mousemove", "fill-layer", (e) => {
    if (e.features.length > 0) {
      if (hoveredTractId !== null) {
        map.setFeatureState(
          { source: "cameron", id: hoveredTractId },
          { hover: false }
        );
      }
      hoveredTractId = e.features[0].id;
      map.setFeatureState(
        { source: "cameron", id: hoveredTractId },
        { hover: true }
      );
    }
  });

  map.on("mouseleave", "fill-layer", () => {
    if (hoveredTractId !== null) {
      map.setFeatureState(
        { source: "cameron", id: hoveredTractId },
        { hover: false }
      );
    }
    hoveredTractId = null;
  });

  map.on("click", "fill-layer", (e) => {
    let grantor = e.features[0].properties.from;
    let grantee = e.features[0].properties.owner;
    let startdate = e.features[0].properties.deed_date;
    let enddate = e.features[0].properties.end_date;
    let deedcounty = e.features[0].properties.deedcounty;
    let itemnotes = e.features[0].properties.notes;
    let plantationname = e.features[0].properties.plantation;
    let county;
    if (deedcounty !== null && deedcounty !== undefined) {
      county = deedcounty + " DB ";
    } else {
      county = "";
    }
    let db = e.features[0].properties.DB;
    let notes;
    if (itemnotes !== null && itemnotes !== undefined) {
      notes = itemnotes;
    } else {
      notes = "";
    }
    let plantation;
    if (plantationname !== null && plantationname !== undefined) {
      plantation = plantationname;
    } else {
      plantation = "";
    }
    let popuphtml = [
      "<p><strong>Grantor: </strong>" +
        grantor +
        "<p><strong>Grantee: </strong>" +
        grantee +
        "</p>" +
        "<p><strong>Dates: </strong>" +
        startdate +
        " through " +
        enddate +
        "</p>" +
        "<p><strong>Source: </strong>" +
        county +
        db +
        "</p>" +
        notes +
        "</p>" +
        plantation,
    ];
    const popup = new mapboxgl.Popup({
      className: "popup",
      closeButton: true,
      closeOnClick: true,
    })
      .setLngLat(e.lngLat)
      .setHTML(popuphtml)
      .addTo(map);
  });

  map.setFilter("outline-layer", dateFilter);
  map.setFilter("fill-layer", dateFilter);
  map.setFilter("text-labels", dateFilter);
  map.setFilter("plantations", dateFilter);
});
