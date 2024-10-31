var chart = new ApexCharts(document.querySelector("#basic-radialbar"), options),
    colors = (chart.render(), ["#6c757d", "#ffbc00", "#727cf5", "#0acf97"]),
    dataColors = $("multiple-radialbar").data("colors"),
    options = {
        chart: { height: 320, type: "radialBar" },
        plotOptions: {
            circle: { dataLabels: { showOn: "hover" } },
            radialBar: { track: { background: "rgba(170,184,197, 0.2)" } },
        },
        colors: (colors = dataColors ? dataColors.split(",") : colors),
        series: [44, 55, 67, 83],
        labels: ["Apples", "Oranges", "Bananas", "Berries"],
        responsive: [{ breakpoint: 380, options: { chart: { height: 260 } } }],
    }
