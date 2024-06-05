// src/Inicio.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Inicio.css';

function Inicio() {
    return (
        <div className="container">
            <div className="content">
                <h1>Fantastique Books</h1>
                <h2>Te acompañamos en cada página de tu viaje</h2>
                </div>
            <div className="button-container">
                    <Link to="/button2"><button className="styled-button">GraphQL</button></Link>
                </div>
                <p>Bienvenidos a mi libreria virtual, donde la magia de los libros cobra vida</p>           
        </div>
    );
}

export default Inicio;
