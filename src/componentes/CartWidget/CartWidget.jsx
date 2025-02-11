import { useContext } from "react";
import { CarritoContext } from "../../context/CarritoContext";
import { Link } from "react-router-dom";
import "./CartWidget.css";

const CartWidget = () => {
  const { cantidadTotal } = useContext(CarritoContext);
  const imgCarrito = "https://media.istockphoto.com/id/1206806317/es/vector/icono-del-carrito-de-compras-aislado-sobre-fondo-blanco.jpg?s=612x612&w=0&k=20&c=sdScWRH_AeHdG6vHzMn8xUHCpe7iM6O1Skgi2lPuKG0=";


  return (
    <div>
      <Link to="/cart">
        <img className='imgCarrito' src={imgCarrito} alt="Carrito de Compras" />
        {
          cantidadTotal > 0 && <strong> {cantidadTotal} </strong>
        }
      </Link>
    </div>
  )
}

export default CartWidget