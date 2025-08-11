import React, { useState, useEffect } from "react";
import HeaderDashboard from "../utils/HeaderDashboard";
import { apiGet, API_ENDPOINTS } from "../utils/apiConfig";
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";

interface SensorData {
  timestamp: number;
  CO2: number;
  DO: number;
  EC: number;
  HUM: number;
  PH: number;
  RTD: number;
}

interface FormattedSensorData {
  CO2: { time: string; CO2: number }[];
  DO: { time: string; DO: number }[];
  EC: { time: string; EC: number }[];
  HUM: { time: string; HUM: number }[];
  PH: { time: string; PH: number }[];
  RTD: { time: string; RTD: number }[];
}

function AreaSensorChart({ title, data, keys, colors }: { title: string; data: any[]; keys: string[]; colors: string[] }) {
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
            <Area key={key} type="monotone" dataKey={key} stroke={colors[index]} fill={colors[index]} opacity={0.3} />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

const Modulo2 = () => {
  const [sensorData, setSensorData] = useState<FormattedSensorData>({
    CO2: [],
    DO: [],
    EC: [],
    HUM: [],
    PH: [],
    RTD: [],
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiGet(API_ENDPOINTS.MODULO2);
        console.log("Respuesta del backend:", response);
        const rawData = response as SensorData[];
        const formattedData: FormattedSensorData = {
          CO2: rawData.map((item) => ({ time: new Date(item.timestamp * 1000).toLocaleString(), CO2: item.CO2 })),
          DO: rawData.map((item) => ({ time: new Date(item.timestamp * 1000).toLocaleString(), DO: item.DO })),
          EC: rawData.map((item) => ({ time: new Date(item.timestamp * 1000).toLocaleString(), EC: item.EC })),
          HUM: rawData.map((item) => ({ time: new Date(item.timestamp * 1000).toLocaleString(), HUM: item.HUM })),
          PH: rawData.map((item) => ({ time: new Date(item.timestamp * 1000).toLocaleString(), PH: item.PH })),
          RTD: rawData.map((item) => ({ time: new Date(item.timestamp * 1000).toLocaleString(), RTD: item.RTD })),
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
      <div className="contenedor-primario"></div>
      <h1 className="text-2xl font-bold mb-4">Modulo 2</h1>

      <AreaSensorChart
        title="CO2 Medición"
        data={sensorData.CO2}
        keys={["CO2"]}
        colors={["#8884d8"]}
      />
      <AreaSensorChart
        title="DO Medición"
        data={sensorData.DO}
        keys={["DO"]}
        colors={["#FF8042"]}
      />
      <AreaSensorChart
        title="EC Medición"
        data={sensorData.EC}
        keys={["EC"]}
        colors={["#d62728"]}
      />
      <AreaSensorChart
        title="HUM Medición"
        data={sensorData.HUM}
        keys={["HUM"]}
        colors={["#0088FE"]}
      />
      <AreaSensorChart
        title="PH Medición"
        data={sensorData.PH}
        keys={["PH"]}
        colors={["#E377C2"]}
      />
      <AreaSensorChart
        title="RTD Medición"
        data={sensorData.RTD}
        keys={["RTD"]}
        colors={["#82ca9d"]}
      />
    </>
  );
};

export default Modulo2;
