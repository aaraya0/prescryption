// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Prescripcion {

    struct Rp {
        string medicacion;
        uint cantidad;
    }

    struct Receta {
        string nombre;
        string apellido;
        uint nro_afiliado;
        uint dni;
        string plan;
        uint edad;
        Rp rp;
    }

    Receta[] public recetas;

    function agregarReceta(
        string memory _nombre, 
        string memory _apellido, 
        uint _nro_afiliado, 
        uint _dni, 
        string memory _plan, 
        uint _edad, 
        string memory _medicacion, 
        uint _cantidad
    ) public {
        Rp memory nuevaRp = Rp(_medicacion, _cantidad);
        Receta memory nuevaReceta = Receta({
            nombre: _nombre, 
            apellido: _apellido, 
            nro_afiliado: _nro_afiliado, 
            dni: _dni, 
            plan: _plan, 
            edad: _edad, 
            rp: nuevaRp
        });
        recetas.push(nuevaReceta);
    }

    function obtenerCantidadRecetas() public view returns (uint) {
        return recetas.length;
    }

    function obtenerReceta(uint index) public view returns (Receta memory) {
        require(index < recetas.length, "Receta no encontrada");
        return recetas[index];
    }
}
