import React, { useEffect, useState } from "react";
import NavComponent from "../Components/Nav";
import axios from "axios";
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from "recharts";

function SensorChart({ title, data, keys, colors }) {
  // const adjustedData = data.length === 1
  //   ? Array.from({ length: 10 }).map((_, index) => ({
  //     time: `Time ${index + 1}`,
  //     ...keys.reduce((acc, key) => ({ ...acc, [key]: data[0][key] }), {}),
  //   }))
  //   : data;

  return (
    <div className="bg-white shadow-md p-4 rounded-lg mb-6">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        {/* <AreaChart data={adjustedData}> */}
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          {keys.map((key, index) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stackId="a"
              stroke={colors[index]}
              fill={colors[index]}
              fillOpacity={0.6}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function Modbus() {
  const [sensorData, setSensorData] = useState({
    CO2: [],
    NO2: [],
    SO2: [],
    PAR: [],
    TEMP: [],
  });

  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('idToken='))
      ?.split('=')[1];

    if (token) {
      axios.get("http://127.0.0.1:8000/rest/modbusdata", {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
        .then(response => {
          const rawData = Object.values(response.data);
          const formattedData = {
            CO2: rawData.map(item => ({
              time: item.timestamp ? new Date(item.timestamp * 1000).toLocaleString() : "Sin fecha",
              CO2_IN: item.CO2_IN,
              CO2_OUT: item.CO2_OUT
            })),
            NO2: rawData.map(item => ({
              time: item.timestamp ? new Date(item.timestamp * 1000).toLocaleString() : "Sin fecha",
              NO2_IN: item.NO2_IN,
              NO2_OUT: item.NO2_OUT
            })),
            SO2: rawData.map(item => ({
              time: item.timestamp ? new Date(item.timestamp * 1000).toLocaleString() : "Sin fecha",
              SO2_IN: item.SO2_IN,
              SO2_OUT: item.SO2_OUT
            })),
            PAR: rawData.map(item => ({
              time: item.timestamp ? new Date(item.timestamp * 1000).toLocaleString() : "Sin fecha",
              PAR: item.PAR
            })),
            TEMP: rawData.map(item => ({
              time: item.timestamp ? new Date(item.timestamp * 1000).toLocaleString() : "Sin fecha",
              TEMP_1: item.TEMP_1,
              TEMP_2: item.TEMP_2
            })),
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


  return (
    <NavComponent >
      <div style={{ padding: "0px 20px" }}>
        <div className="contenedor-primario">
          <h1 className="text-2x2 font-bold mb-4">Modbus</h1>

          <SensorChart
            title="CO2 Medición"
            data={sensorData.CO2}
            keys={["CO2_IN", "CO2_OUT"]}
            colors={["#8884d8", "#82ca9d"]}
          />
          <SensorChart
            title="NO2 Medición"
            data={sensorData.NO2}
            keys={["NO2_IN", "NO2_OUT"]}
            colors={["#FF8042", "#FFBB28"]}
          />
          <SensorChart
            title="SO2 Medición"
            data={sensorData.SO2}
            keys={["SO2_IN", "SO2_OUT"]}
            colors={["#d62728", "#7f7f7f"]}
          />
          <SensorChart
            title="PAR Medición"
            data={sensorData.PAR}
            keys={["PAR"]}
            colors={["#0088FE"]}
          />
          <SensorChart
            title="Temperatura"
            data={sensorData.TEMP}
            keys={["TEMP_1", "TEMP_2"]}
            colors={["#E377C2", "#17BECF"]}
          />
        </div>
      </div>
    </NavComponent>
  );
}

export default Modbus;
