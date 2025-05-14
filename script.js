document.addEventListener('DOMContentLoaded', () => {
    // Initialize the map
// In script.js

// Initialize the map
const map = L.map('map', {
    zoomControl: false,         // Disables the +/- zoom buttons
    scrollWheelZoom: false,     // Disables zoom by mouse scroll wheel
    doubleClickZoom: false,     // Disables zoom on double click
    touchZoom: false,           // Disables pinch-to-zoom on touch devices
    boxZoom: false,             // Disables box zoom (shift-drag)
    dragging: true,             // Keep map dragging enabled (optional, you can set to false if you want a static map until country click)
    keyboard: true              // Keep keyboard navigation (arrows for panning) (optional)
}).setView([62, 17], 4); // Adjusted center slightly for the new set of countries, initial zoom level

    // Add a tile layer (OpenStreetMap is a good free option)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    let geojsonLayer;
    let projectMarkers = L.layerGroup().addTo(map); // Layer group for project markers

    // DOM elements for the info box
    const projectInfoBox = document.getElementById('project-info-box');
    const infoBoxTitle = document.getElementById('info-box-title');
    const infoBoxTable = document.getElementById('info-box-table');
    const closeInfoBoxButton = document.getElementById('close-info-box');

    // Function to style country layers
    function style(feature) {
        return {
            fillColor: '#FFEDA0',
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
    }

    // Function to handle click on a country
    function onCountryClick(e) {
        const layer = e.target;
        map.fitBounds(layer.getBounds()); // Zoom to country

        // Clear previous project markers
        projectMarkers.clearLayers();

        // Filter and display projects for the clicked country
        const countryName = layer.feature.properties.name;
        const countryProjects = projectData.filter(proj => proj.country === countryName);

        countryProjects.forEach(project => {
            if (project.lat && project.lng) {
                const marker = L.marker([project.lat, project.lng])
                    .addTo(projectMarkers)
                    .on('click', () => displayProjectInfo(project)); // Add click listener to marker
                marker.bindTooltip(project.developer + ": " + project.projectSite);
            }
        });
    }
    
    // Function to display project information in the box
    function displayProjectInfo(project) {
        infoBoxTitle.textContent = project.developer + " - " + project.projectSite; //

        // Clear previous table content
        infoBoxTable.innerHTML = '';

        // Create table rows from project data
        const dataToShow = {
            "Country": project.country,
            "Technology Focus": project.technology,
            "Current Stage / Latest Milestone": project.currentStage,
            "Key Next Steps / Expected Timeline": project.nextSteps,
            "Financing Status / Key Mechanisms": project.financing,
            "Regulatory Status / Key Milestones": project.regulatory,
            "Key Challenges / Opportunities": project.challengesOpportunities
        };

        for (const key in dataToShow) {
            const row = infoBoxTable.insertRow();
            const cell1 = row.insertCell();
            const cell2 = row.insertCell();
            cell1.innerHTML = `<strong>${key}</strong>`;
            cell2.textContent = dataToShow[key];
        }

        projectInfoBox.classList.remove('hidden');
    }

    // Close button for the info box
    closeInfoBoxButton.addEventListener('click', () => {
        projectInfoBox.classList.add('hidden');
    });


    // Load GeoJSON data for countries
    fetch('nordicnuclear.geojson') // Make sure this path is correct
        .then(response => response.json())
        .then(data => {
            geojsonLayer = L.geoJSON(data, {
                style: style,
                onEachFeature: function(feature, layer) {
                    layer.on({
                        click: onCountryClick,
                        mouseover: function(e) {
                            var layer = e.target;
                            layer.setStyle({
                                weight: 5,
                                color: '#666',
                                dashArray: '',
                                fillOpacity: 0.7
                            });
                            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                                layer.bringToFront();
                            }
                        },
                        mouseout: function(e) {
                            geojsonLayer.resetStyle(e.target);
                        }
                    });
                    // Add a tooltip to show country name on hover
                    layer.bindTooltip(feature.properties.name, {sticky: true});
                }
            }).addTo(map);
        })
        .catch(error => console.error('Error loading GeoJSON:', error));

    // Link to the project data prepared in Step 4
    // Ensure projectData is defined as shown in Step 4
    // For example:
// In script.js
const projectData = [
    {
        country: "Denmark",
        developer: "Saltfoss Energy (previously Seaborg)", //
        technology: "CMSR (Compact Molten Salt Reactor)", //
        projectSite: "Floating Power Barges (export focus)", //
        currentStage: "Development. Feasibility study with GPSC (Thailand) ongoing. 1", //
        nextSteps: "First reactor H1 2030s; Series production mid-2030s. 1", //
        financing: "Primarily private investment. 1", //
        regulatory: "N/A (export-focused, will depend on client country regulations)", //
        challengesOpportunities: "Challenge: Fuel availability, technology maturation. Opp: MSR innovation hub. 2", //
        lat: 56.2639, // Approximate latitude for placing a marker
        lng: 9.5018   // Approximate longitude for placing a marker
    },
    {
        country: "Denmark",
        developer: "Copenhagen Atomics", //
        technology: "Thorium Molten Salt Reactor", //
        projectSite: "Mass-manufactured SMRs; Ammonia plant (1 GWe, 25 SMRs) in Borneo, Indonesia. 3", //
        currentStage: "Development, prototyping. Non-fission prototype tested (2022). First nuclear chain reaction at PSI planned 2027. 4", //
        nextSteps: "Borneo plant operational by 2028. First test of 100 MWt commercial reactor by 2028. 4", //
        financing: "Private investors (€20M raised 2023). Indonesian project est. $4Bn. Anticipates IPO. 5", //
        regulatory: "N/A (export-focused, will depend on client country regulations)", //
        challengesOpportunities: "Challenge: Large-scale funding, supply chain scaling. Opp: Thorium MSR development. 6", //
        lat: 55.6761,
        lng: 12.5683
    },
    {
        country: "Estonia",
        developer: "Fermi Energia (Vendor: GE Hitachi)", //
        technology: "SMR: BWRX-300 (2 units)", //
        projectSite: "Proposed NPP (600 MWe total) at Viru-Nigula or Lüganuse. 7", //
        currentStage: "State Spatial Planning process initiated (Jan 2025). Pre-FEED with Samsung C&T. 7", //
        nextSteps: "Site pre-selection 2025-2027; Site confirmation 2027-2029; Construction permit application 2029; Build start 2031; First SMR H2 2035. 7", //
        financing: "Est. €120M public funds for regulation/infra. 10 Project financing strategy development with Samsung C&T. 7", //
        regulatory: "Nuclear Energy & Safety Act drafting (submission June 2026). 11 Independent regulator proposal by end 2026. 11 IAEA INIR mission hosted (Oct 2023). 11", //
        challengesOpportunities: "Challenge: Building regulatory system from scratch, FOAK risks. Opp: Strong political/public support, regional first-mover. 11", //
        lat: 59.4370,
        lng: 24.7536
    },
    {
        country: "Finland",
        developer: "Steady Energy (Technology from VTT)", //
        technology: "SMR: LDR-50 (District Heating)", //
        projectSite: "Pilot plant (LDR-e, non-nuclear) construction 2025. Multiple commercial units planned (e.g., Helsinki, Kuopio). 14", //
        currentStage: "LDR-50 design under STUK assessment. LDR-e pilot construction to begin 2025. 14", //
        nextSteps: "LDR-50 plant design ready for technology assessment 2027. First commercial LDR-50 investment decision 2028, operation 2030. 15", //
        financing: "Pilot project €15-20M. Backed by 92 Capital. 2", //
        regulatory: "STUK assessing LDR-50 design. 15 Reform of Nuclear Energy Act ongoing. 17", //
        challengesOpportunities: "Challenge: FOAK for heating SMR, cost-competitiveness. Opp: Clear market for district heating, existing nuclear expertise. 18", //
        lat: 60.1699,
        lng: 24.9384
    },
    // ... Add all other projects from the document
];
    // This is now defined at the top of the script.
});