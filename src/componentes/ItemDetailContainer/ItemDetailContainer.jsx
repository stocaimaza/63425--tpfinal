//import { getUnProducto } from "../../asyncmock";
import { useState, useEffect } from "react";
import ItemDetail from "../ItemDetail/ItemDetail";

//Modificamos para trabajar con Firebase: 
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../services/config";
//Seguda Pre Entrega: 
import { useParams } from "react-router-dom";

const ItemDetailContainer = () => {
    const [producto, setProducto] = useState(null); 

    //Me guardo el idItem: 
    const { idItem } = useParams();

    useEffect( () => {
       const nuevoDoc = doc(db, "inventario", idItem ); 

       getDoc(nuevoDoc)
        .then(res => {
          const data = res.data(); 
          const nuevoProducto = {id: res.id, ...data}; 
          setProducto(nuevoProducto); 
        })
        .catch((error) => console.log("Todo mal!", error))
    }, [idItem])

  return (
    <div>
        <ItemDetail {...producto} />
    </div>
  )
}

export default ItemDetailContainer