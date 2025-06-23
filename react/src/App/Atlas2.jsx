import React, { useState, useEffect } from "react";
import NavComponent from "../Components/Nav";
import axios from "axios";
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";

function AreaSensorChart({ title, data, keys, colors }) {
  return (
    <div className="bg-white shadow-md p-4 rounded-lg mb-6">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          {keys.map((key, index) => (
            <Area key={key} type="monotone" dataKey={key} stroke={colors[index]} fill={colors[index]} opacity={5} />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

const Atlas2 = () => {
  const [sensorData, setSensorData] = useState({
    CO2: [],
    DO: [],
    EC: [],
    HUM: [],
    PH: [],
    RTD: [],
  })
  const [selectedWeek, setSelectedWeek] = useState("");
  const [rawData, setRawData] = useState([]);

  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('idToken='))
      ?.split('=')[1];

    if (token) {
      axios.get("http://127.0.0.1:8000/rest/modulo2", {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
        .then(response => {
          const rawData = response.data;
          setRawData(rawData);
          const formattedData = {
            CO2: rawData.map((item) => ({ time: new Date(item.timestamp * 1000).toLocaleString(), CO2: item.CO2, timestamp: item.timestamp })),
            DO: rawData.map((item) => ({ time: new Date(item.timestamp * 1000).toLocaleString(), DO: item.DO, timestamp: item.timestamp })),
            EC: rawData.map((item) => ({ time: new Date(item.timestamp * 1000).toLocaleString(), EC: item.EC, timestamp: item.timestamp })),
            HUM: rawData.map((item) => ({ time: new Date(item.timestamp * 1000).toLocaleString(), HUM: item.HUM, timestamp: item.timestamp })),
            PH: rawData.map((item) => ({ time: new Date(item.timestamp * 1000).toLocaleString(), PH: item.PH, timestamp: item.timestamp })),
            RTD: rawData.map((item) => ({ time: new Date(item.timestamp * 1000).toLocaleString(), RTD: item.RTD, timestamp: item.timestamp })),
          };

          setSensorData(formattedData);
        })
        .catch(error => {
          console.error("Error al obtener los datos del sensor:", error);
        });
    } else {
      console.error("No se encontró el token en localStorage.");
    }
  }, []);

  // Función para obtener el año y semana ISO de una fecha
  function getISOWeekAndYear(date) {
    const d = new Date(date.getTime());
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return { year: d.getFullYear(), week: weekNo };
  }

  // Filtrar los datos por semana seleccionada
  function filterByWeek(dataArr) {
    if (!selectedWeek) return dataArr;
    const [year, week] = selectedWeek.split("-W");
    return dataArr.filter(item => {
      const date = new Date(item.timestamp * 1000);
      const { year: itemYear, week: itemWeek } = getISOWeekAndYear(date);
      return String(itemYear) === year && String(itemWeek).padStart(2, '0') === week;
    });
  }

  const filteredData = {
    CO2: filterByWeek(sensorData.CO2),
    DO: filterByWeek(sensorData.DO),
    EC: filterByWeek(sensorData.EC),
    HUM: filterByWeek(sensorData.HUM),
    PH: filterByWeek(sensorData.PH),
    RTD: filterByWeek(sensorData.RTD),
  };

  return (
    <NavComponent>
      <div style={{ padding: "0px 20px" }}>
        <div className="contenedor-primario">
          <h1 className="text-2x2 font-bold mb-4">Atlas 2</h1>
          <div style={{ marginBottom: 20 }}>
            <label htmlFor="weekPicker" style={{ marginRight: 8 }}>Filtrar por semana:</label>
            <input
              id="weekPicker"
              type="week"
              value={selectedWeek}
              onChange={e => setSelectedWeek(e.target.value)}
            />
          </div>
          <AreaSensorChart
            title="CO2 Medición"
            data={filteredData.CO2}
            keys={["CO2"]}
            colors={["#6d6d6d"]}
          />
          <AreaSensorChart
            title="DO Medición"
            data={filteredData.DO}
            keys={["DO"]}
            colors={["#ecae19"]}
          />
          <AreaSensorChart
            title="EC Medición"
            data={filteredData.EC}
            keys={["EC"]}
            colors={["#248d6c"]}
          />
          <AreaSensorChart
            title="HUM Medición"
            data={filteredData.HUM}
            keys={["HUM"]}
            colors={["#00a08c"]}
          />
          <AreaSensorChart
            title="PH Medición"
            data={filteredData.PH}
            keys={["PH"]}
            colors={["#ff392d"]}
          />
          <AreaSensorChart
            title="RTD Medición"
            data={filteredData.RTD}
            keys={["RTD"]}
            colors={["#ffc600"]}
          />
        </div>
      </div>
    </NavComponent>
  );
};

export default Atlas2;
