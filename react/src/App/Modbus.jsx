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
  const [selectedWeek, setSelectedWeek] = useState("");
  const [rawData, setRawData] = useState([]);

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
          setRawData(rawData);
          const formattedData = {
            CO2: rawData.map(item => ({
              time: item.timestamp ? new Date(item.timestamp * 1000).toLocaleString() : "Sin fecha",
              CO2_IN: item.CO2_IN,
              CO2_OUT: item.CO2_OUT,
              timestamp: item.timestamp
            })),
            NO2: rawData.map(item => ({
              time: item.timestamp ? new Date(item.timestamp * 1000).toLocaleString() : "Sin fecha",
              NO2_IN: item.NO2_IN,
              NO2_OUT: item.NO2_OUT,
              timestamp: item.timestamp
            })),
            SO2: rawData.map(item => ({
              time: item.timestamp ? new Date(item.timestamp * 1000).toLocaleString() : "Sin fecha",
              SO2_IN: item.SO2_IN,
              SO2_OUT: item.SO2_OUT,
              timestamp: item.timestamp
            })),
            PAR: rawData.map(item => ({
              time: item.timestamp ? new Date(item.timestamp * 1000).toLocaleString() : "Sin fecha",
              PAR: item.PAR,
              timestamp: item.timestamp
            })),
            TEMP: rawData.map(item => ({
              time: item.timestamp ? new Date(item.timestamp * 1000).toLocaleString() : "Sin fecha",
              TEMP_1: item.TEMP_1,
              TEMP_2: item.TEMP_2,
              timestamp: item.timestamp
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
      if (!item.timestamp) return false;
      const date = new Date(item.timestamp * 1000);
      const { year: itemYear, week: itemWeek } = getISOWeekAndYear(date);
      return String(itemYear) === year && String(itemWeek).padStart(2, '0') === week;
    });
  }

  const filteredData = {
    CO2: filterByWeek(sensorData.CO2),
    NO2: filterByWeek(sensorData.NO2),
    SO2: filterByWeek(sensorData.SO2),
    PAR: filterByWeek(sensorData.PAR),
    TEMP: filterByWeek(sensorData.TEMP),
  };

  return (
    <NavComponent >
      <div style={{ padding: "0px 20px" }}>
        <div className="contenedor-primario">
          <h1 className="text-2x2 font-bold mb-4">Modbus</h1>
          <div style={{ marginBottom: 20 }}>
            <label htmlFor="weekPicker" style={{ marginRight: 8 }}>Filtrar por semana:</label>
            <input
              id="weekPicker"
              type="week"
              value={selectedWeek}
              onChange={e => setSelectedWeek(e.target.value)}
            />
          </div>
          <SensorChart
            title="CO2 Medición"
            data={filteredData.CO2}
            keys={["CO2_IN", "CO2_OUT"]}
            colors={["#8884d8", "#82ca9d"]}
          />
          <SensorChart
            title="NO2 Medición"
            data={filteredData.NO2}
            keys={["NO2_IN", "NO2_OUT"]}
            colors={["#FF8042", "#FFBB28"]}
          />
          <SensorChart
            title="SO2 Medición"
            data={filteredData.SO2}
            keys={["SO2_IN", "SO2_OUT"]}
            colors={["#d62728", "#7f7f7f"]}
          />
          <SensorChart
            title="PAR Medición"
            data={filteredData.PAR}
            keys={["PAR"]}
            colors={["#0088FE"]}
          />
          <SensorChart
            title="Temperatura"
            data={filteredData.TEMP}
            keys={["TEMP_1", "TEMP_2"]}
            colors={["#E377C2", "#17BECF"]}
          />
        </div>
      </div>
    </NavComponent>
  );
}

export default Modbus;
