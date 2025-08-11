import React, { useState, useEffect } from "react";
import '../css/Dashboard.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import HeaderDashboard from "../utils/HeaderDashboard";
import { apiGet, API_ENDPOINTS } from "../utils/apiConfig";

// Definimos la interfaz para los datos del sensor
interface SensorData {
  CO2_IN: number;
  CO2_OUT: number;
  NO2_IN: number;
  NO2_OUT: number;
  SO2_IN: number;
  SO2_OUT: number;
  PAR: number;
  TEMP_1: number;
  TEMP_2: number;
  // timestamp: number;
}

// Definimos la estructura de los datos formateados
interface FormattedSensorData {
  CO2: { time: string; CO2_IN: number; CO2_OUT: number }[];
  NO2: { time: string; NO2_IN: number; NO2_OUT: number }[];
  SO2: { time: string; SO2_IN: number; SO2_OUT: number }[];
  PAR: { time: string; PAR: number }[];
  TEMP: { time: string; TEMP_1: number; TEMP_2: number }[];
}

function SensorChart({ title, data, keys, colors }: { title: string; data: any[]; keys: string[]; colors: string[] }) {
  return (
    <div className="bg-white shadow-md p-4 rounded-lg mb-6">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          {keys.map((key, index) => (
            <Bar key={key} dataKey={key} fill={colors[index]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function Modbus() {
  const [sensorData, setSensorData] = useState<FormattedSensorData>({
    CO2: [],
    NO2: [],
    SO2: [],
    PAR: [],
    TEMP: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiGet(API_ENDPOINTS.MODBUSDATA);
        console.log("Respuesta del backend:", response);

        const rawData = Object.values(response)[0] as SensorData;
        const formattedData: FormattedSensorData = {
          CO2: [{ time: "Ahora", CO2_IN: rawData.CO2_IN, CO2_OUT: rawData.CO2_OUT }],
          NO2: [{ time: "Ahora", NO2_IN: rawData.NO2_IN, NO2_OUT: rawData.NO2_OUT }],
          SO2: [{ time: "Ahora", SO2_IN: rawData.SO2_IN, SO2_OUT: rawData.SO2_OUT }],
          PAR: [{ time: "Ahora", PAR: rawData.PAR }],
          TEMP: [{ time: "Ahora", TEMP_1: rawData.TEMP_1, TEMP_2: rawData.TEMP_2 }],
        };

        setSensorData(formattedData);
      } catch (error) {
        console.error("Error al obtener los datos del sensor:", error);
      }
    };

    fetchData();
  }, []);


  return (
    <>
      <HeaderDashboard />
      <div className="contenedor-primario">
        <h1 className="text-2xl font-bold mb-4">Modbus</h1>

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
    </>
  );
}

export default Modbus;
