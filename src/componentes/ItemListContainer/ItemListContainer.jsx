import { useState, useEffect } from "react";
//import { getProductos, getProductosPorCategoria } from "../../asyncmock";
import ItemList from "../ItemList/ItemList";
import { useParams } from "react-router-dom";

//Trabajamos con Firebase: 
import { collection, getDocs, where, query } from "firebase/firestore";
import { db } from "../../services/config";

const ItemListContainer = () => {
  const [productos, setProductos] = useState([]);

  //Me guardo el idCat: 
  const { idCategoria } = useParams();

  useEffect(() => {
   const misProductos = idCategoria ? query(collection(db, "inventario"), where("idCat", "==", idCategoria)) : collection(db, "inventario"); 

   getDocs(misProductos)
    .then(res => {
      const nuevosProductos = res.docs.map(doc => {
        const data = doc.data();
        return {id: doc.id, ...data}
      }); 
      setProductos(nuevosProductos); 
    })
    .catch((error) => console.log("Error mortal, te van a rajar del laburo", error))

  }, [idCategoria])

  return (
    <div>
      <h2> Mis Productos </h2>
      <ItemList productos={productos} />
    </div>

  )
}

export default ItemListContainer