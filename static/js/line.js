// Async and await function to ensure data is grabbed properly and stored in variable lifeData.
// All code should be within the async function.
let lifeData;

(async () => {
    // Grab Data from flask API
    try {
        lifeData = await d3.json(url).then(function (data) {
            return data.lifespan;
        });
        createLineChart(lifeData);
    } catch (error) {
        console.error("Error fetching JSON data:", error);
    }

    // All remaining code goes here:
    // New line chart function!
    function createLineChart(data) {
        // Extract the unique country names
        let countryNames = Array.from(new Set(data.map((item) => item.Entity)));

        // Create dropdown menu with country options
        let dropdown = document.createElement("select");
        dropdown.id = "country-dropdown";
        dropdown.className = "form-select";

        // Create option for each country
        countryNames.forEach((country) => {
            let option = document.createElement("option");
            option.value = country;
            option.text = country;
            dropdown.appendChild(option);
        });

        // Add dropdown menu to the document
        let plotDiv = document.getElementById("line_buttons");
        plotDiv.appendChild(dropdown);

        // Create reset button
        let resetButton = document.createElement("button");
        resetButton.textContent = " Reset";
        resetButton.className = "btn btn-primary bi bi-arrow-clockwise";
        resetButton.style.float = "left";
        resetButton.style.width = "100%";
        resetButton.style.marginTop = "10px";
        plotDiv.appendChild(resetButton);

        // Create income comparison button
        let incomeButton = document.createElement("button");
        incomeButton.textContent = " Income Comparison";
        incomeButton.className = "btn btn-primary bi bi-currency-exchange";
        incomeButton.style.float = "left";
        incomeButton.style.width = "100%";
        incomeButton.style.marginTop = "10px";
        plotDiv.appendChild(incomeButton);

        // Create a region comparison button
        let regionButton = document.createElement("button");
        regionButton.textContent = " Region Comparison";
        regionButton.className = "btn btn-primary bi bi-globe";
        regionButton.style.float = "left";
        regionButton.style.width = "100%";
        regionButton.style.marginTop = "10px";
        plotDiv.appendChild(regionButton);

        // Set dimensions
        plotDiv.style.width = "100%";
        plotDiv.style.height = "600px";

        // Create array for line chart traces
        let traces = [];

        // Create function to update line chart per selected country
        function updateLineChart(country) {
            // Filter data for country selected
            let filteredData = data.filter((item) => item.Entity === country);

            // Extract year and lifespan
            let years = filteredData.map((item) => item.Year);
            let lifespan = filteredData.map(
                (item) => item["Life expectancy at birth, total (years)"]
            );

            // Create line chart trace
            let trace = {
                x: years,
                y: lifespan,
                name: country,
                type: "line",
                mode: "lines+markers",
                line: {
                    color: randomColor,
                    width: 3,
                },
                marker: {
                    size: 6,
                    opacity: 0.5,
                },
            };

            // Add trace to traces array
            traces.push(trace);

            // Create plot layout
            let layout = {
                title: "Lifespan Country Comparison",
                showlegend: true,
                legend: {
                    xanchor: "center",
                    yanchor: "top",
                    y: -0.2,
                    x: 0.5,
                },
                xaxis: {
                    title: "Year",
                },
                yaxis: {
                    title: "Life Expectancy (Age)",
                },
                autosize: true,
            };

            // Plot line chart with all traces
            Plotly.newPlot("line-chart", traces, layout);
        }

        // Initialize line chart with first country in dropdown
        updateLineChart('World'); // World
        updateLineChart('Nigeria'); // Nigeria
        updateLineChart('Japan'); // Japan

        // Add event listener for income comparisons
        incomeButton.addEventListener("click", () => {

            // Create trace length
            traces.length = 0;

            // Create empty layout
            let blankLayout = {
                title: "Lifespan Country Comparison",
                showlegend: true,
                legend: {
                    xanchor: "center",
                    yanchor: "top",
                    y: -0.2,
                    x: 0.5,
                },
                xaxis: {
                    title: "Year",
                },
                yaxis: {
                    title: "Life Expectancy (Age)",
                },
                autosize: true,
            };

            // Plot blank chart with the empty traces
            Plotly.newPlot("line-chart", [], blankLayout);

            // Reset dropdown menu to first country
            dropdown.selectedIndex = 0;

            // Add incomes
            updateLineChart(countryNames[218]); // World income
            updateLineChart(countryNames[117]); // Low income
            updateLineChart(countryNames[116]); // Low & middle income
            updateLineChart(countryNames[118]); // Lower middle income
            updateLineChart(countryNames[133]); // Middle income
            updateLineChart(countryNames[212]); // Upper middle income
            updateLineChart(countryNames[85]); // High income
        })

        // Add event listener for region comparisons
        regionButton.addEventListener("click", () => {

            // Create trace length
            traces.length = 0;

            // Create empty layout
            let blankLayout = {
                title: "Lifespan Country Comparison",
                showlegend: true,
                legend: {
                    xanchor: "center",
                    yanchor: "top",
                    y: -0.2,
                    x: 0.5,
                },
                xaxis: {
                    title: "Year",
                },
                yaxis: {
                    title: "Life Expectancy (Age)",
                },
                autosize: true,
            };

            // Plot blank chart with the empty traces
            Plotly.newPlot("line-chart", [], blankLayout);

            // Reset dropdown menu to first country
            dropdown.selectedIndex = 0;

            // Add regions
            updateLineChart('Europe and Central Asia');
            updateLineChart('North America');
            updateLineChart('South Asia');
            updateLineChart('South Africa');
            updateLineChart('European Union');
            updateLineChart('Sub-Saharan Africa');
            updateLineChart('Latin America and Caribbean');
            updateLineChart('East Asia and Pacific');
        })
        

        // Add event listener for line chart update when the dropdown selection change
        dropdown.addEventListener("change", () => {
            let selectedCountry = dropdown.value;
            updateLineChart(selectedCountry);
        });

        // Add event listener to reset button to reset chart
        resetButton.addEventListener("click", () => {
            // Reset traces array to empty
            traces.length = 0;

            // Create empty layout
            let blankLayout = {
                title: "Lifespan Country Comparison",
                showlegend: true,
                legend: {
                    xanchor: "center",
                    yanchor: "top",
                    y: -0.2,
                    x: 0.5,
                },
                xaxis: {
                    title: "Year",
                },
                yaxis: {
                    title: "Life Expectancy (Age)",
                },
                autosize: true,
            };

            // Plot blank chart with the empty traces
            Plotly.newPlot("line-chart", [], blankLayout);

            // Reset dropdown menu to first country
            dropdown.selectedIndex = 0;
        });
    }
})();

// To make lines a random color :D
function randomColor() {
    let maxVal = 0xffffff; // 16777215
    let randomNumber = Math.random() * maxVal;
    randomNumber = Math.floor(randomNumber);
    randomNumber = randomNumber.toString(16);
    let randColor = randomNumber.padStart(6, 0);
    return `#${randColor.toUpperCase()}`;
}
