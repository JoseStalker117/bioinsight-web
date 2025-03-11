import React, { useEffect, useState } from "react";
// import HeaderDashboard from "../utils/HeaderDashboard";
// import axios from "axios";
// import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from "recharts";

// interface SensorData {
//   CO2: number;
//   DO: number;
//   EC: number;
//   HUM: number;
//   PH: number;
//   RTD: number;
// }
// interface FormattedSensorData {
//   CO2: { time: string; CO2: number }[];
//   DO: { time: string; DO: number }[];
//   EC: { time: string; EC: number }[];
//   HUM: { time: string; HUM: number }[];
//   PH: { time: string; PH: number }[];
//   RTD: { time: string; RTD: number }[];
// }

// function SensorChart({ title, data, keys, colors }: { title: string; data: any[]; keys: string[]; colors: string[] }) {
//   return (
//     <div className="bg-white shadow-md p-4 rounded-lg mb-6">
//       <h2 className="text-lg font-semibold mb-2">{title}</h2>
//       <ResponsiveContainer width="100%" height={300}>
//         <BarChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="time" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           {keys.map((key, index) => (
//             <Bar key={key} dataKey={key} fill={colors[index]} />
//           ))}
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }

const Modulo1 = () => {
//   const [sensorData, setSensorData] = useState<FormattedSensorData>({
//     CO2: [],
//     DO: [],
//     EC: [],
//     HUM: [],
//     PH: [],
//     RTD: [],
//   })

//   useEffect(() => {
//     const idToken = localStorage.getItem("authToken");
//     console.log("token:", idToken);
//     if (idToken) {
//       axios.get("http://127.0.0.1:8000/rest/modulo1", {
//         headers: {
//           Authorization: `Bearer ${idToken}`,
//         }
//       })
//         .then(Response => {
//           console.log("Repuesta del backend:", Response.data);

//           const rawData = Object.values(Response.data)[0] as SensorData;

//           const formattedData: FormattedSensorData = {
//             CO2: [{ time: "Ahora", CO2: rawData.CO2 }],
//             DO: [{ time: "Ahora", DO: rawData.DO }],
//             EC: [{ time: "Ahora", EC: rawData.EC }],
//             HUM: [{ time: "Ahora", HUM: rawData.HUM }],
//             PH: [{ time: "Ahora", PH: rawData.PH }],
//             RTD: [{ time: "Ahora", RTD: rawData.RTD }],
//           };

//           setSensorData(formattedData);
//         })
//         .catch(error => {
//           console.error("Error al obtener los datos del sensor:", error);
//         });
//     } else {
//       console.error("No se encontró el token en localStorage.");
//     }
//   }, []);  

  return (
    <>
      {/* <HeaderDashboard />
      <div className="contenedor-primario"></div>
      <h1 className="text-2xl font-bold mb-4">Modulo 1</h1>

      <SensorChart
        title="CO2 Medición"
        data={sensorData.CO2}
        keys={["CO2"]}
        colors={["#8884d8"]}
      />
      <SensorChart
        title="DO Medición"
        data={sensorData.DO}
        keys={["DO"]}
        colors={["#FF8042"]}
      />
      <SensorChart
        title="EC Medición"
        data={sensorData.EC}
        keys={["EC"]}
        colors={["#d62728"]}
      />
      <SensorChart
        title="HUM Medición"
        data={sensorData.HUM}
        keys={["HUM"]}
        colors={["#0088FE"]}
      />
      <SensorChart
        title="PH Medición"
        data={sensorData.PH}
        keys={["PH"]}
        colors={["#E377C2"]}
      />
      <SensorChart
        title="RTD Medición"
        data={sensorData.RTD}
        keys={["RTD"]}
        colors={["#82ca9d"]}
      /> */}
      <h1>Modulo1</h1>
    </>
  );
};

export default Modulo1;
