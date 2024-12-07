import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Importar el CSS de Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import { useForm } from 'react-hook-form';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth_user } from './Paginas/Config';


function Login() {
  const {register, handleSubmit, formState: {errors}} = useForm();
  const navigate = useNavigate();
  const loginForm = (data) => {
    signInWithEmailAndPassword(auth_user, data.email, data.password)
      .then((userCredentiales) => {
        //si el ususario existe extraemos solo su informacion (.user)
        const user = userCredentiales.user
        console.log(user);
      navigate('/inicio');
    }).catch((error) => {
      console.error(error.messge);
      Swal.fire({
        title: "Credeciales invalidas",
        text: "Revisa tu informacion",
        icon: "warning"
      });
    })
  }

  return (
    <div className="container mt-5">
      <div className="form-floating w-100 max-w-md mx-auto p-4">
        <form onSubmit={handleSubmit(loginForm)}>
          <h1 className="text-center fw-bold mb-4">Login</h1>

          <div className="form-floating mb-4">
            <input
              type="email"
              className="form-control"
              id="floatingInput"
              placeholder="name@example.com"
              {...register('email', { required: true })}
            />
            {errors.email && <span style={{ color: "red" }}>Campo obligatorio</span>}
            <label htmlFor="floatingInput">Email address</label>
          </div>

          <div className="form-floating mb-4">
            <input
              type="password"
              className="form-control"
              id="floatingPassword"
              placeholder="Password"
              {...register('password', { required: true })}
            />
            {errors.password && <span style={{ color: "red" }}>Campo obligatorio</span>}
            <label htmlFor="floatingPassword">Password</label>
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-outline-primary">
              Log In
            </button>
          </div>
          <div className="text-center mt-4">
            <span className="fw-bold">¿No tienes cuenta?</span>
            <Link to="/registro" className="fw-bold text-decoration-none"> Registrate aquí</Link>
          </div>
        </form>
      </div>
    </div>

  );
}

export default Login;