import {
  CREATECOMPRA,
  UPDATE_USER,
  GET_CATEGORIES,
  REGISTERUSER,
  REGISTERBUSINESS,
  RECOVERYKEY,
  USERLOGIN,
  USERLOGINGOOGLE,
  CREATE_MENU,
  CREATE_MENU_ITEMS,
  LOGOUT_USER,
  GET_MENUITEMS,
  GET_RESTAURANTS,
  GET_MENUS,
  GET_MENUITEMS_BYNAME,
  CREATE_CATEGORIES,
} from "./action-types";

// import {GET_RESTAURANTS} from "./action-types"

import axios from "axios";

export const logoutUser = () => {
  return {
    type: LOGOUT_USER,
  };
};
//Registramos usuario
export const register_user = (dataquery) => {
  return async (dispatch) => {
    try {
      // alert("Entro al dispach")
      const userData = {
        username: dataquery.username,
        email: dataquery.email,
        password: dataquery.password,
      };
      //  alert ("usuario "+userData.username)
      const endpoint = "http://localhost:5000/users/create";

      const response = await axios.post(endpoint, userData);
      const { id, username, email, password, google_id, role_id } =
        response.data;

      // alert("El data es " + {id, username, email, password, google_id, role_id })

      const userDatauser = {
        id,
        username,
        email,
        password,
        google_id,
        role_id,
      };
      // console.log("Datos encontrados", JSON.stringify(userDatauser));
      dispatch({
        type: REGISTERUSER,
        payload: userDatauser,
      });
    } catch (error) {
      console.log("Error al enviar la información", error.message);
    }
  };
};

//Registramos empresa
export const register_business = (dataquery) => {
  return async (dispatch) => {
    try {
      const endpoint = "http://localhost:3001/atleticos/register";
      const response = await axios.post(endpoint, dataquery);
      const userData = response.data;

      console.log("Datos encontrados", JSON.stringify(userData));

      if (userData && userData.save === "yes") {
        dispatch({
          type: REGISTERBUSINESS,
          payload: userData,
        });
      } else {
        alert("Error al registrar el usuario");
      }
    } catch (error) {
      console.log("Error al enviar la información", error.message);
    }
  };
};

//REcuperar contraseña

export const recovery_key_user = (dataquery) => {
  return async (dispatch) => {
    try {
      const endpoint = "http://localhost:3001/atleticos/register";
      const response = await axios.post(endpoint, dataquery);
      const userData = response.data;

      console.log("Datos encontrados", JSON.stringify(userData));

      if (userData && userData.save === "yes") {
        dispatch({
          type: RECOVERYKEY,
          payload: userData,
        });
      } else {
        alert("Error al registrar el usuario");
      }
    } catch (error) {
      console.log("Error al enviar la información", error.message);
    }
  };
};

//Loguear usuario
export const login_User = (dataquery) => {
  return async (dispatch) => {
    try {
      if (dataquery === "invitado") {
        dispatch({
          type: USERLOGIN,
          payload: dataquery,
        });
      } else {
        const userData = {
          email: dataquery.emailOrPhone,
          password: dataquery.password,
        };

        // const params = new URLSearchParams(userData).toString();

        // alert ("Lo que tienen el username en el anme es "+ userData.username )

        const endpoint = "http://localhost:5000/users/login";

        //const response = await axios.get(`${endpoint}?${params}`);

        const response = await axios.post(endpoint, userData);
        const auser = response.data;
        //const auser = 'yes';

        // console.log("lo que tengo de retorno "+ user)
        //console.log("lo que tengo de retorno " + JSON.stringify(userDatauser));
        //const userDatauser= {id, username, email, password, google_id, role_id }
        //  localStorage.setItem('token', token);
        // console.log(token)
        dispatch({
          type: USERLOGIN,
          payload: auser,
        });
      }
    } catch (error) {
      // alert("Usuario no encontrado")
      console.log("Error al enviar mensaje", error.message);
    }
  };
};

//Loguear usuario
export const login_User_Google = (dataquery) => {
  return async (dispatch) => {
    try {
      const endpoint = "http://localhost:3001/atleticos/recuperarkey";

      const response = await axios.post(endpoint, dataquery);

      dispatch({
        type: USERLOGINGOOGLE,
        payload: response,
      });
    } catch (error) {
      console.log("Error al enviar mensaje", error.message);
    }
  };
};

export function getAllMenus() {
  return async function (dispatch) {
    const response = await axios("http://localhost:5000/menus");
    return dispatch({
      type: GET_MENUS,
      payload: response.data,
    });
  };
}

export function getAllMenuitems() {
  return async function (dispatch) {
    const response = await axios("http://localhost:5000/menuitems");
    return dispatch({
      type: GET_MENUITEMS,
      payload: response.data,
    });
  };
}
// export function  getAllCategories(){
//   return async function(dispatch){
//       const response = await axios("http://localhost:5000/categories")
//       return dispatch({
//           type:"GET_RESTAURANT",
//           payload:response.data
//       })
//   }
// }

export function getMenuItemsByName(name) {
  return async function (dispatch) {
    const response = await axios(
      `http://localhost:5000/menuitems/search?name=${name}`
    );
    return dispatch({
      type: GET_MENUITEMS_BYNAME,
      payload: response.data,
    });
  };
}

export function getAllRestaurants() {
  return async function (dispatch) {
    const response = await axios("http://localhost:5000/restaurants");
    return dispatch({
      type: GET_RESTAURANTS,
      payload: response.data,
    });
  };
}

export function sortedMenuItemsAsc(sortedMenuItems) {
  return {
    type: "SORTER_ASC",
    payload: sortedMenuItems,
  };
}

export function CreateMenu(dataquery) {
  return async (dispatch) => {
    try {
      const endpoint = "http://localhost:5000/menus/create";
      const response = await axios.post(endpoint, dataquery);
      const menuData = response.data;

      console.log("Datos encontrados", JSON.stringify(menuData));

      dispatch({
        type: CREATE_MENU,
        payload: menuData,
      });
    } catch (error) {
      alert("Error al enviar la información", error.message);
      console.log("Error al enviar la información", error.message);
    }
  };
}
export function CreateMenuItems(formData) {
  return async (dispatch) => {
    try {
      const endpoint = "http://localhost:5000/menuitems/create";

      // Verifica el contenido de FormData antes de enviarlo
      console.log("FormData contenido:", Array.from(formData.entries()));

      const response = await axios.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const menuItemData = response.data;

      console.log("Datos encontrados", JSON.stringify(menuItemData));

      dispatch({
        type: CREATE_MENU_ITEMS,
        payload: menuItemData,
      });
    } catch (error) {
      alert("Error al enviar la información", error.message);
      console.log(error);
    }
  };
}

export function CreateCategory(dataquery) {
  return async (dispatch) => {
    try {
      const endpoint = "http://localhost:5000/categories/create";
      const response = await axios.post(endpoint, dataquery);
      const categoriesData = response.data;
      console.log("Datos encontrados", JSON.stringify(categoriesData));
      dispatch({
        type: CREATE_CATEGORIES,
        payload: categoriesData,
      });
    } catch (error) {
      alert("Error al enviar la información", error.message);
      console.log("Error al enviar la información", error.message);
    }
  };
}

export function getAllCategories() {
  return async function (dispatch) {
    const response = await axios("http://localhost:5000/categories");
    return dispatch({
      type: GET_CATEGORIES,
      payload: response.data,
    });
  };
}

export const updateUser = (userData) => {
  return async (dispatch) => {
    try {
      const endpoint = `http://localhost:5000/users/${userData}`;
      const respuesta = await axios.put(endpoint, userData);

      return dispatch({
        type: UPDATE_USER,
        payload: respuesta,
      });
    } catch (error) {
      alert("Este es el error " + error.message);
      console.log("Este es el error " + error.message);
    }
  };
};

export const Desarrollode_Compra = (cards, id, res_id) => {
  return async (dispatch) => {
    try {
      // Calcular el costo total de todos los productos
      const totalCost = cards.reduce((acc, item) => {
        return acc + parseFloat(item.price) * item.cont;
      }, 0);

      // Log para verificación
      cards.forEach((item) => {
        console.log(`ID: ${item.id}`);
        console.log(`Name: ${item.name}`);
        console.log(`Description: ${item.description}`);
        console.log(`Price: ${item.price}`);
        console.log(`Image: ${item.image}`);
        console.log(`Cont: ${item.cont}`);
        console.log("---------------------------");
      });

      console.log(`Total Cost: ${totalCost}`);

      const dataquery = {
        user_id: id,
        restaurant_id: res_id,
        total_price: parseFloat(totalCost),
      };
      const endpoint = "http://localhost:5000/orders/create";
      const response = await axios.post(endpoint, dataquery);
      const compra = response.data;

      console.log("esta es la compra" + JSON.stringify(compra));

      dispatch({
        type: CREATECOMPRA,
        payload: compra,
      });
    } catch (error) {
      alert("Error al enviar la información", error.message);
      console.log("Error al enviar la información", error.message);
    }
  };
};
