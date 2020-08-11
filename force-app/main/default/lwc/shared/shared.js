export default function configureBar(data, titel) {
    if (Chart) {
        Chart.defaults.global.defaultFontSize = 14;
        Chart.defaults.global.legend.align = "start";
    }
    return {
        type: "bar",
        data: {
            labels: [""],
            datasets: [...data]
        },
        options: {
            tooltips: false,
            title: {
                display: false,
                text: titel
            },
            responsive: true,
            scales: {
                xAxes: [
                    {
                        stacked: true,
                        ticks: {
                            beginAtZero: true
                        }
                    }
                ],
                yAxes: [
                    {
                        ticks: {
                            display: false,
                            min: 0
                        },
                        stacked: true
                    }
                ]
            }
        }
    };
}
