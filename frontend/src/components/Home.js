import React from "react";
import imagen1 from '../images/Fondo.jpg';
import './Home.css'; // Importa el archivo CSS

const Home = () => {
    return (
        <div className="home-container">
            <div className="content-container">
                <div className="about-container">
                    <div className="about-desc">
                        <h3>Vilaflor y propiedades</h3>
                        <p>
                            Bienvenido. Aquí nos dedicamos a la cría y cuidado de ganado, así como al cultivo de tierras fértiles. Nuestro objetivo es proporcionar productos de alta calidad y promover prácticas sostenibles que beneficien tanto a nuestros animales como a nuestro entorno.
                        </p>
                    </div>
                    <div className="image-container">
                        <img src={imagen1} alt="Finca Maragos" className="about-image" />
                    </div>
                </div>
            </div>
            <footer>
                <p>&copy; Todos los derechos reservados :: López, Galicia :: 2024</p>
            </footer>
        </div>
    );
};

export default Home;
