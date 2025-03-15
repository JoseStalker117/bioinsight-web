import React, { useEffect, useState } from "react";
import NavComponent from "../Components/Nav";
import axios from "axios";
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from "recharts";

function SensorChart({ title, data, keys, colors }) {
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
            <Area key={key} type="monotone" dataKey={key} stackId="a" stroke={colors[index]} fill={colors[index]} fillOpacity={0.6}/>
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

const Atlas1 = () => {
  const [sensorData, setSensorData] = useState({
    CO2: [],
    DO: [],
    EC: [],
    HUM: [],
    PH: [],
    RTD: [],
  });

  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('idToken='))
      ?.split('=')[1];

    if (token) {
      axios.get("http://127.0.0.1:8000/rest/modulo1", {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
        .then(response => {
          const rawData = Object.values(response.data);
          const formattedData = {
            CO2: rawData.map((item) => ({ time: new Date(item.timestamp * 1000).toLocaleString(), CO2: item.CO2 })),
            DO: rawData.map((item) => ({ time: new Date(item.timestamp * 1000).toLocaleString(), DO: item.DO })),
            EC: rawData.map((item) => ({ time: new Date(item.timestamp * 1000).toLocaleString(), EC: item.EC })),
            HUM: rawData.map((item) => ({ time: new Date(item.timestamp * 1000).toLocaleString(), HUM: item.HUM })),
            PH: rawData.map((item) => ({ time: new Date(item.timestamp * 1000).toLocaleString(), PH: item.PH })),
            RTD: rawData.map((item) => ({ time: new Date(item.timestamp * 1000).toLocaleString(), RTD: item.RTD })),
          };

          setSensorData(formattedData);
        })
        .catch(error => {
          console.error("Error al obtener los datos del sensor:", error.response ? error.response.data : error.message);
        });
    } else {
      console.error("No se encontró el token en las cookies.");
    }
  }, []);

  return (
    <NavComponent>
      <div style={{ padding: "0px 20px" }}>
        <div className="contenedor-primario">
          <h1 className="text-2x2 font-bold mb-4">Atlas 1</h1>

          <SensorChart
            title="CO2 Medición"
            data={sensorData.CO2}
            keys={["CO2"]}
            colors={["#6d6d6d"]}
          />
          <SensorChart
            title="DO Medición"
            data={sensorData.DO}
            keys={["DO"]}
            colors={["#ecae19"]}
          />
          <SensorChart
            title="EC Medición"
            data={sensorData.EC}
            keys={["EC"]}
            colors={["#248d6c"]}
          />
          <SensorChart
            title="HUM Medición"
            data={sensorData.HUM}
            keys={["HUM"]}
            colors={["#00a08c"]}
          />
          <SensorChart
            title="PH Medición"
            data={sensorData.PH}
            keys={["PH"]}
            colors={["#ff392d"]}
          />
          <SensorChart
            title="RTD Medición"
            data={sensorData.RTD}
            keys={["RTD"]}
            colors={["#ffc600"]}
          />
        </div>
      </div>
    </NavComponent>
  );
};

export default Atlas1;
