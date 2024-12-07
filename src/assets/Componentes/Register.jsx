import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth_user } from './Paginas/Config';

// Ccreamos esuqema de validacion
const schema = yup.object().shape({
  email: yup.string()
    .required("El correo es obligatorio")
    .email("Correo inválido, ejemplo: usuario@dominio.com"),
  password: yup.string()
    .required("Campo Obligatorio")
    .min(8, "La contraseña debe contener al menos 8 caracteres"),
  confirmarPass: yup.string()
    .oneOf([yup.ref('password'), null], "Las contraseñas no son iguales")
});

function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
})
//constante paa la navegacion
const navigate = useNavigate()
const registerForm = (data) => {
    console.log(data);
    createUserWithEmailAndPassword(auth_user, data.email, data.password).then((userCredential)=>
    {
        const user = userCredential.user;
        console.log(user);
        //redirigir a la pagina principal
        navigate('/inicio')
    }).catch((error)=>{
        console.log("Error al registrar el usuario", error)
    })
}

  return (
    <div className="container">
      <h2 className="text-center mb-4">Registro</h2>
      <form onSubmit={handleSubmit(registerForm)}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input 
            type="email" 
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            id="email"
            {...register('email')}
          />
          {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
        </div>
        
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input 
            type="password" 
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            id="password"
            {...register('password')}
          />
          {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
        </div>
        
        <div className="mb-3">
          <label htmlFor="confirmarPass" className="form-label">Confirmar Password</label>
          <input 
            type="password" 
            className={`form-control ${errors.confirmarPass ? 'is-invalid' : ''}`}
            id="confirmarPass"
            {...register('confirmarPass')}
          />
          {errors.confirmarPass && <div className="invalid-feedback">{errors.confirmarPass.message}</div>}
        </div>
        
        <button type="submit" className="btn btn-primary w-100">Registrar</button>
        
        <div className="text-center mt-3">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </div>
      </form>
    </div>
  );
}

export default Register;