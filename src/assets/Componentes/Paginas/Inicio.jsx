import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { onSnapshot, collection, deleteDoc, doc } from 'firebase/firestore';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import { auth_user, db } from './Config';


function Inicio() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Montando la información de los productos que hay en Firebase
  useEffect(() => {
    // Función que nos permite visualizar la info de la BD en tiempo real
    const unsubscribe = onSnapshot(
      collection(db, "products"),
      (snapshot) => {
        const array_products = snapshot.docs.map((doc) => ({
          ...doc.data(), 
          id: doc.id 
        }));

        setProducts(array_products);
      }
    );

    // Escuchar cambios en el estado de autenticación
    const authUnsubscribe = onAuthStateChanged(auth_user, (currentUser) => {
      setUser(currentUser);
    });

    // Limpiar los listeners cuando el componente se desmonte
    return () => {
      unsubscribe();
      authUnsubscribe();
    };
  }, []);

  const logout = () => {
    signOut(auth_user)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Sesión cerrada',
          text: 'Has cerrado sesión exitosamente'
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al cerrar sesión'
        });
      });
  };

  const deleteProduct = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        deleteDoc(doc(db, "products", id))
          .then(() => {
            Swal.fire({
              title: "Eliminado",
              text: "El producto ha sido eliminado.",
              icon: "success"
            });
          })
          .catch((error) => {
            Swal.fire({
              title: "Error",
              text: "No se pudo eliminar el producto",
              icon: "error"
            });
          });
      }
    });
  };

  const renderActionButtons = (product) => {
    return (
      <div className="btn-group" role="group" aria-label="Product Actions">
        <Link 
          to={`/editar/${product.id}`} 
          className="btn btn-sm btn-primary"
        >
          Editar
        </Link>
        <button 
          onClick={() => deleteProduct(product.id)} 
          className="btn btn-sm btn-danger"
        >
          Eliminar
        </button>
      </div>
    );
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      </nav>
      
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <div className="card shadow-sm">
              <div className="card-body">
                <h1 className="card-title text-center mb-4">Bienvenido</h1>
                {user ? (
                  <>
                    <p>Has iniciado sesión.</p>
                    <button className="btn btn-danger" onClick={logout}>
                      Cerrar sesión
                    </button>
                  </>
                ) : (
                  <Link to="/">Inicia sesión aquí</Link>
                )}
              </div>
            </div>
          </div>
        </div>
                <Link to='/agregar'>
                <button className="btn btn-success">
                      Agregar producto
                    </button></Link>

        <div className="container mt-5">
          {products.length > 0 ? (
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Precio</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.description}</td>
                    <td>{product.precio}</td>
                    <td>{renderActionButtons(product)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hay productos por el momento</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Inicio;