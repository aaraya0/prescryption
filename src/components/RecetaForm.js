import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import PrescripcionContract from '../contracts/Prescripcion.json';

const RecetaForm = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    nro_afiliado: '',
    dni: '',
    plan: '',
    edad: '',
    medicacion: '',
    cantidad: '',
  });
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [recetas, setRecetas] = useState([]);

  useEffect(() => {
    const initWeb3 = async () => {
      const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = PrescripcionContract.networks[networkId];
      
      if (deployedNetwork) {
        const instance = new web3.eth.Contract(
          PrescripcionContract.abi,
          deployedNetwork.address
        );
        const accounts = await web3.eth.getAccounts();
        setContract(instance);
        setAccounts(accounts);

        // Cargar recetas existentes al inicio
        const numRecetas = await instance.methods.obtenerCantidadRecetas().call();
        const recetasArray = [];
        for (let i = 0; i < numRecetas; i++) {
          const receta = await instance.methods.obtenerReceta(i).call();
          recetasArray.push(receta);
        }
        setRecetas(recetasArray);
      } else {
        console.error('Contrato no desplegado en esta red.');
      }
    };

    initWeb3();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (contract) {
      await contract.methods
        .agregarReceta(
          formData.nombre,
          formData.apellido,
          parseInt(formData.nro_afiliado),
          parseInt(formData.dni),
          formData.plan,
          parseInt(formData.edad),
          formData.medicacion,
          parseInt(formData.cantidad)
        )
        .send({ from: accounts[0], gas: 3000000 });

      // Actualizar lista de recetas después de agregar una nueva
      const numRecetas = await contract.methods.obtenerCantidadRecetas().call();
      const recetasArray = [];
      for (let i = 0; i < numRecetas; i++) {
        const receta = await contract.methods.obtenerReceta(i).call();
        recetasArray.push(receta);
      }
      setRecetas(recetasArray);

      alert('Receta agregada con éxito!');
    } else {
      console.error('Contrato no inicializado.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre" required />
        <input name="apellido" value={formData.apellido} onChange={handleChange} placeholder="Apellido" required />
        <input name="nro_afiliado" value={formData.nro_afiliado} onChange={handleChange} placeholder="Nro Afiliado" required />
        <input name="dni" value={formData.dni} onChange={handleChange} placeholder="DNI" required />
        <input name="plan" value={formData.plan} onChange={handleChange} placeholder="Plan" required />
        <input name="edad" value={formData.edad} onChange={handleChange} placeholder="Edad" type="number" required />
        <input name="medicacion" value={formData.medicacion} onChange={handleChange} placeholder="Medicación" required />
        <input name="cantidad" value={formData.cantidad} onChange={handleChange} placeholder="Cantidad" type="number" required />
        <button type="submit">Agregar Receta</button>
      </form>

      <h2>Recetas Agregadas:</h2>
      <ul>
        {recetas.map((receta, index) => (
          <li key={index}>
            <strong>Nombre:</strong> {receta.nombre} <br />
            <strong>Apellido:</strong> {receta.apellido} <br />
            <strong>Nro Afiliado:</strong> {receta.nro_afiliado} <br />
            <strong>DNI:</strong> {parseInt(receta.dni)} <br />
            <strong>Plan:</strong> {receta.plan} <br />
            <strong>Edad:</strong> {parseInt(receta.edad)} <br /> {/* Convertir a número */}
            <strong>Medicación:</strong> {receta.rp.medicacion} <br />
            <strong>Cantidad:</strong> {parseInt(receta.rp.cantidad)} <br /> {/* Convertir a número */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecetaForm;
