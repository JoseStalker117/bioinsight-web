import React, { useState, useEffect } from "react";
import { FireOutlined, SafetyCertificateOutlined, HomeOutlined } from "@ant-design/icons"; // Importando iconos de Ant Design
import '../css/CardHome.css'

const CardHomeComponent = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const cards = [
        {
            title: "Compromiso",
            text: "En BioInsight nos comprometemos a que todos nuestros productos sean de calidad y que cumplan más allá de las expectativas.",
            icon: <FireOutlined />
        },
        {
            title: "Integridad",
            text: "Toda la información recopilada de los proyectos mantiene la seguridad y estructura para que esta información sea ágil y de acceso controlado por el usuario.",
            icon: <SafetyCertificateOutlined />
        },
        {
            title: "Responsividad",
            text: "Nuestras aplicaciones actúan responsivamente siendo susceptibles a fallos eléctricos o de conectividad, requiriendo poca interacción para solucionarse.",
            icon: <HomeOutlined />
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % cards.length);
        }, 12000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="cards-container">
            {cards.map((card, index) => (
                <div key={index} className={`card ${index === currentIndex ? "active" : ""}`}>
                    <div className="card-inner">
                        <div className="card-front">
                            <div className="icon-container">{card.icon}</div>
                            <h3>{card.title}</h3>
                        </div>
                        <div className="card-back">
                            <h3>{card.title}</h3>
                            <p>{card.text}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
export default CardHomeComponent;
