import { useState, useEffect } from "react";
import { db } from "./firebaseconfig";
import {
  deleteDoc,
  query,
  collection,
  getDocs,
  getDoc,
  addDoc,
  doc,
  setDoc,
} from "firebase/firestore/lite";

function App() {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idModificar, setIdModificar] = useState(null);

  useEffect(() => {
    getUsuarios();
  }, []);

  const deleteUsuario = async (id) => {
    console.log(id);
    await deleteDoc(doc(db, "agenda", id));
    getUsuarios();
    setError(null);
  };

  const saveUsuario = async () => {
    console.log(idModificar);

    if (!validarInput()) {
      return;
    }
    await setDoc(doc(db, "agenda", idModificar), {
      nombre: nombre,
      telefono: telefono,
    });

    setModoEdicion(false);
    setNombre("");
    setTelefono("");
    getUsuarios();
    setError(null);
  };

  function validarInput() {
    if (nombre.length === 0) {
      setError("El nombre no puede ser vacío");
      return false;
    } else {
      if (telefono.length === 0) {
        setError("El teléfono no puede ser vacío");
        return false;
      }
    }
    setError(null);

    return true;
  }

  const modificarUsuario = async (id) => {
    console.log(id);
    const docu = await getDoc(doc(db, "agenda", id));
    const { nombre, telefono } = docu.data();
    setNombre(nombre);
    setTelefono(telefono);
    setModoEdicion(true);
    setIdModificar(id);
    setError(null);
  };

  const addUsuario = async (e) => {
    e.preventDefault();
    if (!validarInput()) {
      return;
    }
    setError(null);

    try {
      const docRef = await addDoc(collection(db, "agenda"), {
        nombre: nombre,
        telefono: telefono,
      });
      console.log("Document written with ID: ", docRef.id);
      setNombre("");
      setTelefono("");
    } catch (err) {
      alert(err);
      console.log(err);
    }
    getUsuarios();
  };

  const getUsuarios = async () => {
    const { docs } = await getDocs(query(collection(db, "agenda")));
    const arreglo = docs.map((item) => ({ id: item.id, ...item.data() }));
    setUsuarios(arreglo);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h2>Formulario de usuarios</h2>
          <form onSubmit={(e) => addUsuario(e)} className="form-group">
            <div className="form-floating mb-3">
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                type="text"
                className="form-control"
                id="floatingInput"
                placeholder="Ingrese el nombre"
              />
              <label for="floatingInput">Nombre</label>
            </div>
            <div className="form-floating">
              <input
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                type="texto"
                className="form-control"
                id="floatingPassword"
                placeholder="Ingrese el teléfono"
              />
              <label for="floatingPassword">Teléfono</label>
            </div>
            <div className="d-grid gap-2 col-6 mx-auto">
              <input
                type="submit"
                value="Registrar"
                disabled={modoEdicion}
                className="btn btn-dark mt-3"
              />
            </div>
          </form>
          <div className="d-grid gap-2 col-6 mx-auto">
            <button
              value="Guardar Cambios"
              className="btn btn-info mt-3"
              disabled={!modoEdicion}
              onClick={() => saveUsuario()}
            >
              Guardar Cambios
            </button>
          </div>
          {error ? (
            <div
              className="alert alert-danger d-flex align-items-center mt-3"
              role="alert"
            >
              <svg
                className="bi flex-shrink-0 me-2"
                width="28"
                height="28"
                role="img"
                aria-label="Danger:"
              >
                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
              </svg>
              <div>{error}</div>
            </div>
          ) : (
            <div />
          )}
        </div>
        <div className="col">
          <h2>Lista de Contactos</h2>
          {usuarios.length > 0 ? (
            <ul className="list-group">
              {usuarios.map((item) => (
                <li key={item.id} className="list-group-item">
                  {item.nombre} - {item.telefono}
                  <button
                    className="btn btn-info mt-3 ml2 float-sm-end"
                    onClick={() => modificarUsuario(item.id)}
                  >
                    Modificar
                  </button>
                  <button
                    className="btn btn-danger mt-3 float-sm-end"
                    onClick={() => deleteUsuario(item.id)}
                  >
                    Borrar
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div>Nada que mostrar</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
