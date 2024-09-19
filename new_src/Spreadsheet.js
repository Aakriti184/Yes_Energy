import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';  // For CSV parsing

const Spreadsheet = () => {
    const [data, setData] = useState([]);

    // Preset start and end dates
    const startDate = '20240501';
    const endDate = '20240503';
    const forecastFiles = [
        "/D_load_fcst_archive.csv",
        "/J_load_fcst_archive.csv",
        "/MM_load_fcst_archive.csv",
        "/MW_load_fcst_archive.csv"
    ];
    const actualLoadFile = "/load_act.csv";

    // Function to fetch and process the CSV data
    useEffect(() => {
        const fetchAndProcessData = async () => {
            try {
                const actualLoadResponse = await fetch(actualLoadFile);
                const actualLoadText = await actualLoadResponse.text();
                const actualLoadData = Papa.parse(actualLoadText, { header: true }).data;

                // Fetch and process forecast files
                const forecastData = {};
                for (const file of forecastFiles) {
                    const response = await fetch(file);
                    const text = await response.text();
                    const parsedData = Papa.parse(text, { header: true }).data;

                    parsedData.forEach((row) => {
                        const date = row.date;
                        const time = row.time;

                        // Only consider rows within the preset dates
                        if (date >= startDate && date <= endDate) {
                            const key = `${date}_${time}`;

                            // If this date/time pair doesn't exist or has an older revision, update it
                            if (!forecastData[key] || new Date(forecastData[key].revision) < new Date(row.revision)) {
                                forecastData[key] = { ...row }; // Store the latest revision
                            }
                        }
                    });
                }

                // Prepare the combined data (48 rows)
                const combinedData = [];
                for (const [key, forecastRow] of Object.entries(forecastData)) {
                    const [date, time] = key.split('_');
                    const actualRow = actualLoadData.find((row) => row.date === date && row.time === time);

                    combinedData.push({
                        date,
                        time,
                        d_forecast: forecastRow.load_fcst,
                        j_forecast: forecastRow.load_fcst,
                        mm_forecast: forecastRow.load_fcst,
                        mw_forecast: forecastRow.load_fcst,
                        actual_load: actualRow ? actualRow.load_act : 'N/A'
                    });
                }

                // Sort data by date and time and limit to 48 rows
                combinedData.sort((a, b) => (a.date + a.time) > (b.date + b.time) ? 1 : -1);
                setData(combinedData.slice(0, 48));
            } catch (error) {
                console.error('Error fetching or processing data:', error);
            }
        };

        fetchAndProcessData();
    }, []); // Run once when the component mounts

    return (
        <div>
            <h1>Spreadsheet</h1>
            <table border="1">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Time</th>
                        <th>D Forecast</th>
                        <th>J Forecast</th>
                        <th>Actual Load</th>
                        <th>MM Forecast</th>
                        <th>MW Forecast</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr key={index}>
                            <td>{row.date}</td>
                            <td>{row.time}</td>
                            <td>{row.d_forecast}</td>
                            <td>{row.j_forecast}</td>
                            <td>{row.actual_load}</td>
                            <td>{row.mm_forecast}</td>
                            <td>{row.mw_forecast}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Spreadsheet;
