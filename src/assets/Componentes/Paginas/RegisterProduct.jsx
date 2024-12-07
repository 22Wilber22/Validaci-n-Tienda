import { addDoc, collection } from 'firebase/firestore';
import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { db } from './Config';

export default function RegisterProduct() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm()
    /**
     * register = hace referencia a lo que capturo en la entrada de dato
     * watch = permite observar alguna entrada de dato (valor)
     * handleSubmit = es la accion de lo que voy hacer con la informacion
     */

    //creando una constante para redirigir a una ruta
    const navigate = useNavigate()

    console.log(watch('name'));
    //metodo para guardar un producto
    const saveProduct = async (data) => {
        console.log("Se ha guardado");
        console.log(data); //{ name: cebolla, description: cebollas moradas }

        //conectarnos a la bd y guardamos un documento
        try {
            await addDoc(collection(db, "products"), {
                name: data.name, //cebolla
                description: data.description, //cebollas moradas
                precio: data.precio
            })
        } catch (error) {
            console.error("Error al registrar el producto", error)
        }
        //redireccionamos a lista de productos
        navigate("/inicio")
    }

    return (
        <div>
            <h2>Registro de Productos</h2>
            <div className='mb-3'>

                <div className="row">
                    <div className="col-md-8 offset-md-2">
                        <div className="card shadow-sm">
                            <div className="card-body">


                                <form action="" onSubmit={handleSubmit(saveProduct)}>
                                    <div>
                                        <label htmlFor="" className='form-floating mb-4'>Ingresar Producto: </label>
                                        <input type="text" {...register('name')} />
                                    </div>

                                    <div>
                                        <label htmlFor="" className='form-floating mb-4'>Descripcion: </label>
                                        <input type="text" {...register('description')} />
                                    </div>

                                    <div>
                                        <label htmlFor="" className='form-floating mb-4'>Precio: </label>
                                        <input type="text" {...register('precio')} />
                                    </div>
                                    <div>
                                        <button type='submit' className='btn btn-success'>Guardar Producto</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

