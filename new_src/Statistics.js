import React, { useState } from 'react';
import Papa from 'papaparse';  // For CSV parsing

const Statistics = () => {
    const [rmse1, setRmse1] = useState(null);
    const [rmse2, setRmse2] = useState(null);
    const [rmse3, setRmse3] = useState(null);
    const [rmse4, setRmse4] = useState(null);

    // Function to calculate RMSE
    const calculateRmse = (forecastData, actualData) => {
        let sum = 0;
        let count = 0;

        forecastData.forEach((forecastRow) => {
            const forecastDate = forecastRow.date;
            const forecastValue = parseFloat(forecastRow.load_fcst);
            
            // Find the corresponding actual load row by matching the date
            const actualRow = actualData.find((row) => row.date === forecastDate);
            if (actualRow) {
                const actualValue = parseFloat(actualRow.load_act);
                if (!isNaN(forecastValue) && !isNaN(actualValue)) {
                    sum += Math.pow(forecastValue - actualValue, 2);
                    count++;
                }
            }
        });

        return count > 0 ? Math.sqrt(sum / count) : NaN;  // Prevent divide-by-zero errors
    };

    // Function to read and parse the CSVs
    const handleShowRmse = () => {
        const forecastFiles = [
            "/D_load_fcst_archive.csv",
            "/J_load_fcst_archive.csv",
            "/MM_load_fcst_archive.csv",
            "/MW_load_fcst_archive.csv"
        ];
        const actualLoadFile = "/load_act.csv";

        // Fetch the actual load CSV data first
        fetch(actualLoadFile)
            .then(response => response.text())
            .then(actualDataText => {
                const actualData = Papa.parse(actualDataText, { header: true }).data;
                
                // Fetch and calculate RMSE for each forecast file
                forecastFiles.forEach((forecastFile, index) => {
                    fetch(forecastFile)
                        .then(response => response.text())
                        .then(forecastDataText => {
                            const forecastData = Papa.parse(forecastDataText, { header: true }).data;

                            const rmse = calculateRmse(forecastData, actualData);
                            switch (index) {
                                case 0:
                                    setRmse1(rmse);
                                    break;
                                case 1:
                                    setRmse2(rmse);
                                    break;
                                case 2:
                                    setRmse3(rmse);
                                    break;
                                case 3:
                                    setRmse4(rmse);
                                    break;
                                default:
                                    break;
                            }
                        })
                        .catch(error => console.error("Error loading forecast file:", forecastFile, error));
                });
            })
            .catch(error => console.error("Error loading actual load file:", actualLoadFile, error));
    };

    return (
        <div className="statistics-container">
            <h1>Statistics</h1>
            <button onClick={handleShowRmse}>Show RMSE Values</button>
            {rmse1 !== null && (
                <div className="rmse-display">
                    <p>RMSE for File 1 (D): {rmse1}</p>
                </div>
            )}
            {rmse2 !== null && (
                <div className="rmse-display">
                    <p>RMSE for File 2 (J): {rmse2}</p>
                </div>
            )}
            {rmse3 !== null && (
                <div className="rmse-display">
                    <p>RMSE for File 3 (MM): {rmse3}</p>
                </div>
            )}
            {rmse4 !== null && (
                <div className="rmse-display">
                    <p>RMSE for File 4 (MW): {rmse4}</p>
                </div>
            )}
        </div>
    );
};

export default Statistics;
