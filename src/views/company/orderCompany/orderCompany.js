import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './orderCompany.css';
import eliminar from './image/eliminar.png';
import rechasado from './image/rechazado.png';
import modificar from './image/escribir.png';
import cancelar from './image/cancelar.png';
import guardar from './image/actualizar.png';

import { Actualizar_Compra_Usuario, Create_Lista_Order_Company } from '../../../Redux/actions';
import axios from 'axios';
import alertify from 'alertifyjs';

function OrderCompany() {
  const Order_List_Company = useSelector((state) => state.ListaOrderCompany || []);
  const [activeOrder, setActiveOrder] = useState(null);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    id: '',
    user_name: '',
    order_date: '',
    active: false,
    total_price: '',
    items: []
  });

  const handleEliminar = async (id) => {
    try {
      console.log(id);
      const endpoint = `http://localhost:5000/orders/delete/${id}`;
      //const response = 
      await axios.put(endpoint);
   //   const data = response.data;
      //alert("Esta es la respuesta " + JSON.stringify(data));
      dispatch(Create_Lista_Order_Company())
    } catch (error) {
      console.error("Error eliminando la orden:", error);
      alert("Ocurrió un error al eliminar la orden.");
    }
  };

  const handleModificar = (order) => {
    setActiveOrder(order);
    setFormData({
      id: order.id,
      user_name: order.user_name,
      order_date: order.order_date,
      active: order.active,
      total_price: order.total_price,
      items: Array.isArray(order.items) ? order.items.map((item, index) => ({ ...item, index })) : []
    });
  };

  const handleGuardar = async() => {
    //alert("Guardar id: " + JSON.stringify(formData));
    dispatch(Actualizar_Compra_Usuario(formData));
    await dispatch(Create_Lista_Order_Company())
    alertify.alert("Mensaje", "Actualizacion desarrollada correctamente")
  };

  const handleCancelar = () => {
    setActiveOrder(null);
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = formData.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setFormData((prevData) => ({
      ...prevData,
      items: updatedItems
    }));
  };

  return (
    <div>
      <h1>OrderCompany</h1>
      <div className="container">
        <table className="styled-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Nombre</th>
              <th>Productos</th>
              <th>Fecha</th>
              <th>Estado Compra</th>
              <th>Costo Total</th>
              <th>Eliminar</th>
              <th>Modificar</th>
            </tr>
          </thead>
          <tbody>
            {Order_List_Company.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.user_name || 'Sin nombre'}</td>
                <td>
                  {Array.isArray(order.items) ? order.items.map((item, index) => (
                    <div key={index}>
                      {item.quantity || item.cont} x {item.name_item || item.name} (${item.partial_price || item.price})
                    </div>
                  )) : 'No items'}
                </td>
                <td>{order.order_date.substr(0, 19)}</td>
                <td>{order.active ? 'Aprobado' : 'Eliminado'}</td>
                <td>{order.total_price ? `$${order.total_price}` : 'N/A'}</td>
                <td>
                  <div className="btn btn-delete" onClick={() => handleEliminar(order.id)}>
                    <img src={order.active ? eliminar : rechasado} alt='Eliminar order' className='img_List_Order' />
                  </div>
                </td>
                <td>
                  <div className="btn btn-modify" onClick={() => handleModificar(order)}>
                    <img src={modificar} alt='Modificar order' className='img_List_Order' />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {
        //!desde aqui en adelante se desarrolla la tajeta de modificaicon 
      }
      {activeOrder && (
        <div className="modal" style={{ display: 'block' }}>
          <div className="modal-content">
            <span className="close" onClick={handleCancelar}>&times;</span>
            <h2 className='Texto-Name-title'>Modificar Orden</h2>
            <div className="form-group">
              <label className='Texto-Name'>Nombre de Usuario:</label>
              <span>{formData.user_name}</span>
            </div>
            <div className="form-group">
              <label className='Texto-Name'>Fecha:</label>
              <span>{formData.order_date}</span>
            </div>
            
            <div className="form-group">
              <label className='Texto-Name'>Costo Total:</label>
              <input
                type="text"
                name="total_price"
                value={formData.total_price}
                onChange={handleChange}
                className='input-textos'
              />
            </div>
            <div className="items-container">
              <h3>Items</h3>
              {formData.items.map((item, index) => (
                <div className="item" key={index}>
                  <div className="form-group">
                    <label>Cantidad:</label>
                    <input
                      type="number"
                      value={item.quantity || item.cont}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      className='input-Numero'
                    />
                  </div>
                  <div className="form-group">
                    <label>Nombre:</label>
                    <input
                      type="text"
                      value={item.name_item || item.name}
                      onChange={(e) => handleItemChange(index, 'name_item', e.target.value)}
                      className='input-Numero'
                    />
                  </div>
                  <div className="form-group">
                    <label>Precio:</label>
                    <input
                      type="number"
                      value={item.partial_price || item.price}
                      onChange={(e) => handleItemChange(index, 'partial_price', e.target.value)}
                      className='input-Numero'
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="form-group-btn">
              <img src={guardar} alt="Guardar Cambios" onClick={handleGuardar} className='img_List_Order-Guardar' />
              <img src={cancelar} alt="Cancelar" onClick={handleCancelar} className='img_List_Order-Guardar' />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderCompany;