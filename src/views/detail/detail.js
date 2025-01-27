import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.min.css';
import 'alertifyjs/build/css/themes/default.min.css';

import { useEffect, useState, useRef } from "react";
import "./detail.css";
import axios from "axios";

import carrito from '../../images/carrito.png';
import Carrito from "../../Components/Carrito/Carrito";
import { obtenerContCarrito, handleSumar, handleDisminuir } from '../../Components/localStorage-car/LocalStorageCar';

function Detail({ isOpen, handleCloseModal, menuItemId }) {
  const [viewCard, setViewCard] = useState(false);
  const [menuItem, setMenuItem] = useState({});
  const [cant, setCant] = useState(1);

  const detailRef = useRef(null);

  useEffect(() => {
    const fetchMenuItem = async () => {
      try {
        const { data } = await axios(`http://localhost:5000/menuitems/${menuItemId}`);
        if (data?.id) {
          setMenuItem(data);
          const storedCant = obtenerContCarrito(data.id);
          setCant(storedCant || 0);
        }
      } catch (error) {
        console.log("Error al ingresar al menuItem", error);
      }
    };

    if (menuItemId) {
      fetchMenuItem();
    }

    return () => setMenuItem({});
  }, [menuItemId]);

  useEffect(() => {
    const storedCant = obtenerContCarrito(menuItemId);
    setCant(storedCant || 0);
  }, [menuItemId]);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key && event.key.startsWith('card-')) {
        const storedCant = obtenerContCarrito(menuItemId);
        setCant(storedCant || 0);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [menuItemId]);

  const handleMenuCarrito = () => {
    setViewCard(!viewCard);
  };

  const handleDisminuirItem = async (idcard) => {
    if (cant === 0) {
      alertify.warning("No puedes disminuir de 0");
    } else {
      const newCant = await handleDisminuir(idcard);
      setCant(newCant);
    }
  };

  const handleAumentarItem = async (idcard) => {
    const newCant = await handleSumar(idcard);
    setCant(newCant);
  };

  if (!isOpen || !menuItem) return null;

  return (
    <div>
      <div className="detailContainer">
        <div ref={detailRef} className="detailCardContainer">
          <div className="buttonClose">
            <button onClick={handleCloseModal}>X</button>
          </div>
          <div className="imageDetail">
            <img src={menuItem?.image_url} alt={menuItem.name} />
          </div>
          <div className="cardDetail">
            <div className="titleDetail">
              <h2>{menuItem?.name}</h2>
            </div>
            <p className="description-detal">{menuItem?.description}</p>
          </div>
          <div className="cantContainer">
            <h2>Unidades</h2>
            <div className="botones-flex">
              <div className="buttonDecInc-Menu">
                <label className="aumentardisminuir" onClick={() => handleDisminuirItem(menuItem.id)}>
                  -
                </label>
                <input
                  className="inputcard"
                  type="text"
                  value={obtenerContCarrito(menuItem.id)} 
                  disabled
                />
                <label className="aumentardisminuir" onClick={() => handleAumentarItem(menuItem.id)}>
                  +
                </label>
              </div>
              <img
                src={carrito}
                title="Ve Al Carrito"
                alt="Carrito"
                className="aumentardisminuir"
                onClick={handleMenuCarrito}
              />
            </div>
          </div>
        </div>
      </div>
      {viewCard && <Carrito onClose={handleMenuCarrito} />}
    </div>
  );
}

export default Detail;
