import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { useForm } from 'react-hook-form'
import Swal from 'sweetalert2'
import 'bootstrap/dist/css/bootstrap.min.css';
import { db } from './Config'

export default function EditForm() {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch product details
  useEffect(() => {
    const getProductById = async () => {
      if (!id) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se proporcionó un ID de producto válido'
        });
        navigate('/inicio');
        return;
      }

      try {
        const productDoc = await getDoc(doc(db, "products", id));
        
        if (productDoc.exists()) {
          const data = productDoc.data();
          setProductData(data);
          
          // Populate form with existing data
          setValue('name', data.name);
          setValue('description', data.description);
          setValue('precio', data.precio);
          
          setLoading(false);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Producto no encontrado',
            text: 'El producto que intentas editar no existe',
            confirmButtonText: 'Volver'
          }).then(() => {
            navigate('/inicio');
          });
        }
      } catch (error) {
        console.error("Error al cargar el producto:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar la información del producto'
        });
        setLoading(false);
      }
    };

    getProductById();
  }, [id, navigate, setValue]);

  const editProduct = async (data) => {
    try {
      // Validate that we have an ID and existing product data
      if (!id || !productData) {
        throw new Error('Datos de producto no válidos');
      }

      // Update the document in Firestore
      await updateDoc(doc(db, "products", id), {
        name: data.name,
        description: data.description,
        precio: parseFloat(data.precio)  // Ensure precio is a number
      });

      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Producto Actualizado',
        text: 'El producto se ha actualizado correctamente',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        navigate("/inicio");
      });
    } catch (error) {
      console.error('Error al actualizar el producto', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'No se pudo actualizar el producto'
      });
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h2 className="text-center">Editar Producto</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit(editProduct)}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Nombre del Producto</label>
                  <input 
                    type="text" 
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    {...register('name', { 
                      required: 'El nombre del producto es obligatorio',
                      minLength: {
                        value: 3,
                        message: 'El nombre debe tener al menos 3 caracteres'
                      }
                    })}
                  />
                  {errors.name && (
                    <div className="invalid-feedback">
                      {errors.name.message}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Descripción</label>
                  <textarea 
                    className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                    {...register('description', { 
                      required: 'La descripción es obligatoria',
                      minLength: {
                        value: 10,
                        message: 'La descripción debe tener al menos 10 caracteres'
                      }
                    })}
                  />
                  {errors.description && (
                    <div className="invalid-feedback">
                      {errors.description.message}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="precio" className="form-label">Precio</label>
                  <input 
                    type="number" 
                    step="0.01"
                    className={`form-control ${errors.precio ? 'is-invalid' : ''}`}
                    {...register('precio', { 
                      required: 'El precio es obligatorio',
                      min: {
                        value: 0,
                        message: 'El precio no puede ser negativo'
                      }
                    })}
                  />
                  {errors.precio && (
                    <div className="invalid-feedback">
                      {errors.precio.message}
                    </div>
                  )}
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}