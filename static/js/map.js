const url = "http://127.0.0.1:5000";
let le_data;

(async () => {
    // Grab Data from flask API
    try {
        le_data = await d3.json(url).then(function (data) {
            return data.lifespan;
        });
    } catch (error) {
        console.error("Error fetching JSON data:", error);
    }

    // console.log(le_data);
    function filter_and_unpack(rows, key, year) {
        return rows.filter((row) => row["Year"] == year).map((row) => row[key]);
    }

    var frames = [];
    var slider_steps = [];

    var n = 60;
    var num = 1960;
    for (var i = 0; i <= n; i++) {
        var z = filter_and_unpack(
            le_data,
            "Life expectancy at birth, total (years)",
            num
        );
        var locations = filter_and_unpack(le_data, "Code", num);
        var full_name = filter_and_unpack(le_data, "Entity", num);
        frames[i] = {
            data: [{ z: z, locations: locations, text: full_name }],
            name: num,
        };

        slider_steps.push({
            label: num.toString(),
            method: "animate",
            args: [
                [num],
                {
                    mode: "immediate",
                    transition: { duration: 300 },
                    frame: { duration: 300 },
                },
            ],
        });
        num = num + 1;
    }

    var data = [
        {
            type: "choropleth",
            locationmode: "world",
            locations: frames[0].data[0].locations,
            z: frames[0].data[0].z,
            text: frames[0].data[0].text,
            zauto: false,
            zmin: 30,
            zmax: 90,
            colorscale: [
                [0, "#ffffd9"],
                [0.3, "#edf8b1"],
                [0.35, "#c7e9b4"],
                [0.4, "#7fcdbb"],
                [0.45, "#41b6c4"],
                [0.65, "#1d91c0"],
                [0.7, "#225ea8"],
                [0.75, "#253494"],
                [0.8, "rgb(23, 41, 118)"],
                [1, "#081d58"],
            ],
            colorbar: {
                title: "Years",
                // thickness: 80,
                xanchor: "right",
            },
        },
    ];

    var dropdownOptions = [
        { label: "World", value: "world" },
        { label: "Africa", value: "africa" },
        { label: "North America", value: "north america" },
        { label: "South America", value: "south america" },
        { label: "Asia", value: "asia" },
        { label: "Europe", value: "europe" },
    ];

    var dropdown = {
        type: "dropdown",
        active: 0,
        x: 0.1,
        y: 1,
        yanchor: "bottom",
        xanchor: "right",
        direction: "down",
        buttons: [],
    };

    for (let i = 0; i < dropdownOptions.length; i++) {
        dropdown.buttons.push({
            method: "relayout",
            args: ["geo.scope", dropdownOptions[i].value],
            label: dropdownOptions[i].label,
        });
    }

    var layout = {
        title: "Life Expectancy<br>1960 - 2020",
        geo: {
            // scope: "world",
            countrycolor: "rgb(255, 255, 255)",
            showland: true,
            landcolor: "rgb(217, 217, 217)",
            showlakes: false,
            // lakecolor: "rgb(255, 255, 255)",
            subunitcolor: "rgb(255, 255, 255)",
            lonaxis: {},
            lataxis: {},
            // projection: { type: "robinson" },
        },
        updatemenus: [
            {
                x: 0.1,
                y: 0,
                yanchor: "top",
                xanchor: "right",
                showactive: false,
                direction: "left",
                type: "buttons",
                pad: { t: 87, r: 10 },
                buttons: [
                    {
                        method: "animate",
                        args: [
                            null,
                            {
                                fromcurrent: true,
                                transition: {
                                    duration: 200 / 5,
                                },
                                frame: {
                                    duration: 500 / 5,
                                },
                            },
                        ],
                        label: "Play",
                    },
                    {
                        method: "animate",
                        args: [
                            [null],
                            {
                                mode: "immediate",
                                transition: {
                                    duration: 0,
                                },
                                frame: {
                                    duration: 0,
                                },
                            },
                        ],
                        label: "Pause",
                    },
                ],
            },
            dropdown,
        ],
        sliders: [
            {
                active: 0,
                steps: slider_steps,
                x: 0.1,
                len: 0.9,
                xanchor: "left",
                y: 0,
                yanchor: "top",
                pad: { t: 50, b: 10 },
                currentvalue: {
                    visible: true,
                    prefix: "Year:",
                    xanchor: "right",
                    font: {
                        size: 20,
                        color: "#666",
                    },
                },
                transition: {
                    duration: 300,
                    easing: "cubic-in-out",
                },
            },
        ],
    };
    Plotly.newPlot("map", data, layout).then(function () {
        Plotly.addFrames("map", frames);
        Plotly.createDropdown("map", dropdown);
    });
})();
