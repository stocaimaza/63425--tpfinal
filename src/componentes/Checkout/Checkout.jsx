//CHECKOUT SIN DESCUENTO DE STOCK: 

// import { useState, useEffect, useContext } from "react";
// import { db } from "../../services/config";
// import { CarritoContext } from "../../context/CarritoContext";
// import { collection, addDoc } from "firebase/firestore";

// const Checkout = () => {
//     const { carrito, vaciarCarrito, total, cantidadTotal } = useContext(CarritoContext);
//     //Me traigo las funciones necesarias del Context. 

//     //Crear los estados para el formulario de checkout: 
//     const [nombre, setNombre] = useState("");
//     const [apellido, setApellido] = useState("");
//     const [telefono, setTelefono] = useState("");
//     const [email, setEmail] = useState("");
//     const [emailConfirmacion, setEmailConfirmacion] = useState("");
//     const [orderId, setOrderId] = useState("");
//     const [error, setError] = useState("");

//     const manejadorFormulario = (event) => {
//         event.preventDefault();

//         //Verificamos que todos los campos este completos: 
//         if (!nombre || !apellido || !telefono || !email || !emailConfirmacion) {
//             setError("Por favor completa todos los campos");
//             return;
//         }

//         //Validamos que el campo del email coincida: 
//         if (email !== emailConfirmacion) {
//             setError("Los emails no coinciden, rata de dos patas!");
//             return;
//         }

//         //Crear un objeto con todos los datos de la orden de compra: 

//         const orden = {
//             items: carrito.map(producto => ({
//                 id: producto.item.id,
//                 nombre: producto.item.nombre,
//                 cantidad: producto.cantidad
//             })),
//             total: total,
//             fecha: new Date(),
//             nombre,
//             apellido,
//             telefono,
//             email
//         }

//         console.log(orden);

//         //Guardar la orden de compras en la base de datos: 

//         addDoc(collection(db, "ordenes"), orden)
//             .then(docRef => {
//                 setOrderId(docRef.id);
//                 vaciarCarrito();
//             })
//             .catch(error => {
//                 console.log(error);
//                 setError("No se puede crear la orden, revisa el codigoo1")
//             })
//     }

//     return (
//         <div>
//             <h2>Checkout</h2>

//             <form onSubmit={manejadorFormulario}>
//                 {
//                     carrito.map(producto => (
//                         <div key={producto.item.id}>
//                             <p> {producto.item.nombre} x {producto.cantidad} </p>
//                             <p> Precio: ${producto.item.precio} </p>
//                             <hr />
//                         </div>
//                     ))
//                 }
//                 <hr />

//                 <div>
//                     <label htmlFor=""> Nombre: </label>
//                     <input type="text" onChange={(e) => setNombre(e.target.value)} />
//                 </div>

//                 <div>
//                     <label htmlFor=""> Apellido: </label>
//                     <input type="text" onChange={(e) => setApellido(e.target.value)} />
//                 </div>

//                 <div>
//                     <label htmlFor=""> Telefono: </label>
//                     <input type="text" onChange={(e) => setTelefono(e.target.value)} />
//                 </div>

//                 <div>
//                     <label htmlFor=""> Email: </label>
//                     <input type="text" onChange={(e) => setEmail(e.target.value)} />
//                 </div>

//                 <div>
//                     <label htmlFor=""> Email confirmación: </label>
//                     <input type="text" onChange={(e) => setEmailConfirmacion(e.target.value)} />
//                 </div>

//                 {
//                     error && <p> {error} </p>
//                 }


//                 {
//                     orderId && (
//                         <strong>¡Gracias por tu compra! Tu número de orden es: {orderId} </strong>
//                     )
//                 }
//                 <button type="submit"> Finalizar Orden </button>
//             </form>
//         </div>
//     )
// }

// export default Checkout

//VERSION CON DESCUENTO DE STOCK: 

import { useState, useEffect, useContext } from "react";
import { db } from "../../services/config";
import { CarritoContext } from "../../context/CarritoContext";
import { collection, addDoc, updateDoc, getDoc, doc } from "firebase/firestore";

const Checkout = () => {
    const { carrito, vaciarCarrito, total, cantidadTotal } = useContext(CarritoContext);
    //Me traigo las funciones necesarias del Context. 

    //Crear los estados para el formulario de checkout: 
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [telefono, setTelefono] = useState("");
    const [email, setEmail] = useState("");
    const [emailConfirmacion, setEmailConfirmacion] = useState("");
    const [orderId, setOrderId] = useState("");
    const [error, setError] = useState("");

    const manejadorFormulario = (event) => {
        event.preventDefault();

        //Verificamos que todos los campos este completos: 
        if (!nombre || !apellido || !telefono || !email || !emailConfirmacion) {
            setError("Por favor completa todos los campos");
            return;
        }

        //Validamos que el campo del email coincida: 
        if (email !== emailConfirmacion) {
            setError("Los emails no coinciden, rata de dos patas!");
            return;
        }

        //Crear un objeto con todos los datos de la orden de compra: 

        const orden = {
            items: carrito.map(producto => ({
                id: producto.item.id,
                nombre: producto.item.nombre,
                cantidad: producto.cantidad
            })),
            total: total,
            fecha: new Date(),
            nombre,
            apellido,
            telefono,
            email
        }

        //Vamos a modificar el código para que ejecute varias promesas en paralelo, por un lado que pueda crear la orden de compra y por el otro que actualice el stock. 

        Promise.all(
            //1) Actualizamos el stock. 
            orden.items.map(async (productoOrden) => {
                //Por cada producto obtengo una referencia y a partir de esa referencia obtengo el DOC: 
                const productoRef = doc(db, "inventario", productoOrden.id);
                const productoDoc = await getDoc(productoRef);
                const stockActual = productoDoc.data().stock;
                //data() me trae todos los datos del documento. 
                await updateDoc(productoRef, {
                    stock: stockActual - productoOrden.cantidad
                })
                //Se modifica el stock y se sube la info actualizada. 
                //Agregar una validación para evitar que se compre mas del stock disponible. 
            })
        )
            //2) Guardamos en la base de datos la orden de compra: 
            .then(() => {
                addDoc(collection(db, "ordenes"), orden)
                    .then(docRef => {
                        setOrderId(docRef.id);
                        vaciarCarrito();
                    })
                    .catch(error => {
                        console.log(error);
                        setError("No se puede crear la orden, revisa el codigoo1")
                    })

            })
            .catch(error => {
                console.log("No se puede actualizar el stock: ", error);
                setError("No se puede actualizar el stock");
            })

    }

    return (
        <div>
            <h2>Checkout</h2>

            <form onSubmit={manejadorFormulario}>
                {
                    carrito.map(producto => (
                        <div key={producto.item.id}>
                            <p> {producto.item.nombre} x {producto.cantidad} </p>
                            <p> Precio: ${producto.item.precio} </p>
                            <hr />
                        </div>
                    ))
                }
                <hr />

                <div>
                    <label htmlFor=""> Nombre: </label>
                    <input type="text" onChange={(e) => setNombre(e.target.value)} />
                </div>

                <div>
                    <label htmlFor=""> Apellido: </label>
                    <input type="text" onChange={(e) => setApellido(e.target.value)} />
                </div>

                <div>
                    <label htmlFor=""> Telefono: </label>
                    <input type="text" onChange={(e) => setTelefono(e.target.value)} />
                </div>

                <div>
                    <label htmlFor=""> Email: </label>
                    <input type="text" onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div>
                    <label htmlFor=""> Email confirmación: </label>
                    <input type="text" onChange={(e) => setEmailConfirmacion(e.target.value)} />
                </div>

                {
                    error && <p style={{ color: "red" }}> {error} </p>
                }


                {
                    orderId && (
                        <strong>¡Gracias por tu compra! Tu número de orden es: {orderId} </strong>
                    )
                }
                <button type="submit"> Finalizar Orden </button>
            </form>
        </div>
    )
}

export default Checkout
