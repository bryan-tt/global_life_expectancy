// const url = "http://127.0.0.1:5000";
const startYear = 1960,
    endYear = 2020,
    btn = document.getElementById("play-pause-button"),
    input = document.getElementById("play-range"),
    nbr = 20;

let life_data;
let barRaceData = {};
let chart;
let dumbbellData = [];
let dumbbellChart;

(async () => {
    // Grab Data from flask API
    try {
        life_data = await d3.json(url).then(function (data) {
            return data.lifespan;
        });
    } catch (error) {
        console.error("Error fetching JSON data:", error);
    }

    // All code goes here:

    // Transform data into dictionary of each country. Each country will have single dictionary with Year as key and life expectancy as value
    life_data.forEach(function (obj) {
        const key = obj.Entity;

        if (!barRaceData[key]) {
            barRaceData[key] = {};
        }

        barRaceData[key][obj.Year] =
            obj["Life expectancy at birth, total (years)"].toFixed(2);
    });

    // Transform data for dumbbell chart into array of dictionaries
    for (const country in barRaceData) {
        dumbbellData.push({
            name: country,
            low: Math.min(...Object.values(barRaceData[country]).map(Number)),
            high: Math.max(...Object.values(barRaceData[country]).map(Number)),
        });
    }
    // Dumbbell chart
    dumbbellChart = Highcharts.chart("dumbBell", {
        chart: {
            type: "dumbbell",
            inverted: true,
        },

        legend: {
            enabled: false,
        },

        subtitle: {
            text: "1960 vs 2020",
        },

        title: {
            text: "Life Expectancy Range",
        },

        tooltip: {
            shared: true,
        },

        xAxis: {
            type: "category",
        },

        yAxis: {
            opposite: false,
            title: {
                text: "Life Expectancy (years)",
            },
        },
        plotOptions: {
            series: {
                animation: false,
                groupPadding: 0,
                pointPadding: 0.1,
                borderWidth: 0,
                colorByPoint: false,
                dataSorting: {
                    enabled: true,
                    matchByName: true,
                },
                type: "line",
                dataLabels: {
                    enabled: false,
                },
            },
        },
        series: [
            {
                name: "Life expectancy change",
                data: getTop20(getData(input.value)[1]),
            },
        ],
    });

    // plot bar race chart
    chart = Highcharts.chart("barRace", {
        chart: {
            animation: {
                duration: 500,
            },
            marginRight: 50,
        },
        title: {
            text: "Top 20 Countries",
            align: "center",
        },
        subtitle: {
            useHTML: true,
            text: getSubtitle(),
            floating: true,
            align: "right",
            verticalAlign: "bottom",
            y: 0,
            x: 11,
        },

        legend: {
            enabled: false,
        },
        xAxis: {
            type: "category",
        },
        yAxis: {
            opposite: true,
            tickPixelInterval: 150,
            title: {
                text: null,
            },
        },
        plotOptions: {
            series: {
                animation: false,
                groupPadding: 0,
                pointPadding: 0.1,
                borderWidth: 0,
                colorByPoint: true,
                dataSorting: {
                    enabled: true,
                    matchByName: true,
                },
                type: "bar",
                dataLabels: {
                    enabled: true,
                },
            },
        },
        series: [
            {
                type: "bar",
                name: startYear,
                data: getData(startYear)[1],
            },
        ],
        responsive: {
            rules: [
                {
                    condition: {
                        maxWidth: 550,
                    },
                    chartOptions: {
                        xAxis: {
                            visible: false,
                        },
                        subtitle: {
                            x: 0,
                        },
                        plotOptions: {
                            series: {
                                dataLabels: [
                                    {
                                        enabled: true,
                                        y: 8,
                                    },
                                    {
                                        enabled: true,
                                        format: "{point.name}",
                                        y: -8,
                                        style: {
                                            fontWeight: "normal",
                                            opacity: 0.7,
                                        },
                                    },
                                ],
                            },
                        },
                    },
                },
            ],
        },
    });
})();

// ------------------------------------------------------------ Functions ------------------------------------------------------------

/*
 * Animate dataLabels functionality
 */
(function (H) {
    const FLOAT = /^-?\d+\.?\d*$/;

    // Add animated textSetter, just like fill/strokeSetters
    H.Fx.prototype.textSetter = function () {
        let startValue = this.start.replace(/ /g, ""),
            endValue = this.end.replace(/ /g, ""),
            currentValue = this.end.replace(/ /g, "");

        if ((startValue || "").match(FLOAT)) {
            startValue = parseInt(startValue, 10);
            endValue = parseInt(endValue, 10);

            // No support for float
            currentValue = Highcharts.numberFormat(
                Math.round(startValue + (endValue - startValue) * this.pos),
                0
            );
        }

        this.elem.endText = this.end;

        this.elem.attr(this.prop, currentValue, null, true);
    };

    // Add textGetter, not supported at all at this moment:
    H.SVGElement.prototype.textGetter = function () {
        const ct = this.text.element.textContent || "";
        return this.endText ? this.endText : ct.substring(0, ct.length / 2);
    };

    // Temporary change label.attr() with label.animate():
    // In core it's simple change attr(...) => animate(...) for text prop
    H.wrap(H.Series.prototype, "drawDataLabels", function (proceed) {
        const attr = H.SVGElement.prototype.attr,
            chart = this.chart;

        if (chart.sequenceTimer) {
            this.points.forEach((point) =>
                (point.dataLabels || []).forEach(
                    (label) =>
                        (label.attr = function (hash) {
                            if (
                                hash &&
                                hash.text !== undefined &&
                                chart.isResizing === 0
                            ) {
                                const text = hash.text;

                                delete hash.text;

                                return this.attr(hash).animate({ text });
                            }
                            return attr.apply(this, arguments);
                        })
                )
            );
        }

        const ret = proceed.apply(
            this,
            Array.prototype.slice.call(arguments, 1)
        );

        this.points.forEach((p) =>
            (p.dataLabels || []).forEach((d) => (d.attr = attr))
        );

        return ret;
    });
})(Highcharts);

function getTop20(arr) {
    var names = arr.map((record) => record[0]);
    var filteredData = dumbbellData.filter((obj) => names.includes(obj.name));
    // console.log(names.length, filteredData.length, _.uniqWith(filteredData, _.isEqual).length);
    return filteredData;
}

function getData(year) {
    const output = Object.entries(barRaceData)
        .map((country) => {
            const [countryName, countryData] = country;
            const value = Number(countryData[year]);
            return [countryName, isNaN(value) ? -Infinity : value]; // Replace NaN with negative Infinity
        })
        .sort((a, b) => {
            const valueA = a[1];
            const valueB = b[1];
            if (valueA === -Infinity && valueB !== -Infinity) {
                return 1; // Place negative Infinity (missing value) at the bottom
            } else if (valueA !== -Infinity && valueB === -Infinity) {
                return -1; // Place negative Infinity (missing value) at the bottom
            }
            return valueB - valueA; // Sort numbers in descending order
        });
    console.log(output.slice(0, nbr));
    return [output[0], output.slice(0, nbr)];
}

function getSubtitle() {
    const life_expectancy = getData(input.value)[0][1].toFixed(2);
    return `
        <span style="font-size: 0px">
        ${getData(input.value)[0][0]}: ${life_expectancy} years
        </span>
        <span style="font-size: 40px">${input.value}</span>
        `;
}

/*
 * Pause the timeline, either when the range is ended, or when clicking the pause button.
 * Pausing stops the timer and resets the button to play mode.
 */
function pause(button) {
    button.title = "play";
    button.className = "fa fa-play";
    clearTimeout(chart.sequenceTimer);
    chart.sequenceTimer = undefined;
}

/*
 * Update the chart. This happens either on updating (moving) the range input,
 * or from a timer when the timeline is playing.
 */
function update(increment) {
    if (increment) {
        input.value = parseInt(input.value, 10) + increment;
    }
    if (input.value >= endYear) {
        // Auto-pause
        pause(btn);
    }

    chart.update(
        {
            subtitle: {
                text: getSubtitle(),
            },
        },
        false,
        false,
        false
    );

    chart.series[0].update({
        name: input.value,
        data: getData(input.value)[1],
    });

    dumbbellChart.series[0].update({
        data: getTop20(getData(input.value)[1]),
    });
}

/*
 * Play the timeline.
 */
function play(button) {
    button.title = "pause";
    button.className = "fa fa-pause";
    chart.sequenceTimer = setInterval(function () {
        update(1);
    }, 500 * 2);
}

btn.addEventListener("click", function () {
    if (chart.sequenceTimer) {
        pause(this);
    } else {
        play(this);
    }
});
/*
 * Trigger the update on the range bar click.
 */
input.addEventListener("click", function () {
    update();
});
