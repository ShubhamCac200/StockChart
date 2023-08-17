
    async function fetchJSONData(stockCompany) {
        try {
            const response = await fetch(`${stockCompany}.json`);
            const jsonData = await response.json();
            return jsonData;
        } catch (error) {
            console.error('Error fetching JSON data:', error);
            return [];
        }
    }

    async function createChart(stockCompany, timePeriod = 'all') {
        const jsonData = await fetchJSONData(stockCompany);
        let filteredData = jsonData;
        const currentDate = luxon.DateTime.local(2021, 4, 30); 

        if (timePeriod === '7days') {
            const sevenDaysAgo = currentDate.minus({ days: 7 });
            filteredData = jsonData.filter(item => {
                const itemDate = luxon.DateTime.fromISO(item.Date).setZone('Asia/Kolkata');
                return itemDate >= sevenDaysAgo && itemDate <= currentDate;
            });
        } else if (timePeriod === '1month') {
            const oneMonthAgo = currentDate.minus({ months: 1 });
            filteredData = jsonData.filter(item => {
                const itemDate = luxon.DateTime.fromISO(item.Date).setZone('Asia/Kolkata');
                return itemDate >= oneMonthAgo && itemDate <= currentDate;
            });
        } else if (timePeriod === '1year') {
            const oneYearAgo = currentDate.minus({ years: 1 });
            filteredData = jsonData.filter(item => {
                const itemDate = luxon.DateTime.fromISO(item.Date).setZone('Asia/Kolkata');
                return itemDate >= oneYearAgo && itemDate <= currentDate;
            });
        }

        const data = {
            datasets: [{
                label: `${stockCompany} STOCK`,
                data: filteredData.map(item => ({
                    x: luxon.DateTime.fromISO(item.Date).setZone('Asia/Kolkata').valueOf(),
                    o: parseFloat(item.Open),
                    h: parseFloat(item.High),
                    l: parseFloat(item.Low),
                    c: parseFloat(item.Close)
                })),
            }]
        };

        const config = {
            type: 'candlestick', 
            data,
            options: {
                
            }
        };

        if (currentChart) {
            currentChart.data = data;
            currentChart.update(); 
        } else {
            currentChart = new Chart(
                document.getElementById('myChart'),
                config
            );
        }

        return currentChart; 
    }

    let currentChart = null; 

    function setupChartButtons() {
        const stockCompanyDropdown = document.getElementById('stockCompany');

        stockCompanyDropdown.addEventListener('change', () => {
            const selectedStockCompany = stockCompanyDropdown.value;
            createChart(selectedStockCompany);
        });

        document.getElementById('btn7Days').addEventListener('click', () => {
            console.log("7 Days button clicked");
            const selectedStockCompany = stockCompanyDropdown.value;
            createChart(selectedStockCompany, '7days');
        });

        document.getElementById('btn1Month').addEventListener('click', () => {
            console.log("1 Month button clicked");
            const selectedStockCompany = stockCompanyDropdown.value;
            createChart(selectedStockCompany, '1month');
        });

        document.getElementById('btn1Year').addEventListener('click', () => {
            console.log("1 Year button clicked");
            const selectedStockCompany = stockCompanyDropdown.value;
            createChart(selectedStockCompany, '1year');
        });

        document.getElementById('btnAll').addEventListener('click', () => {
            console.log("All button clicked");
            const selectedStockCompany = stockCompanyDropdown.value;
            createChart(selectedStockCompany, 'all');
        });
    }

    async function initializeChart() {
        setupChartButtons();
        const selectedStockCompany = document.getElementById('stockCompany').value;
        createChart(selectedStockCompany, '1year'); 
    }

    initializeChart();
