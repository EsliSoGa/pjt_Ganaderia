import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Menubar } from 'primereact/menubar';
import { SplitButton } from 'primereact/splitbutton';
import { logout } from "../../actions/auth";
import { clearMessage } from "../../actions/message";
//import logo from "../../images/fondo2.ico";
const Navigation = () => {
    const dispatch = useDispatch();
    const { user: currentUser } = useSelector((state) => state.auth);
    const logOut = useCallback(() => {
        dispatch(logout());
    }, [dispatch]);
    let location = useLocation();
    useEffect(() => {
        if (["/login", "/register"].includes(location.pathname)) {
            dispatch(clearMessage()); // clear message when changing location
        }
    }, [dispatch, location]);
    useEffect(() => {
        if (currentUser) {

        } else {

        }
    }, [currentUser]);
    /* Items */
    const navlistInicio = [
        {
            label: "Inicio",
            icon: "pi pi-fw pi-home",
            command: () => {
                window.location.href = '/';
            },
        }
    ];
    const navlistJefe = [
        {
            label: "Inicio",
            icon: "pi pi-fw pi-home",
            command: () => {
                window.location.href = '/profile';
            }
        },
        {
            label: "Ganado",
            icon: "pi pi-fw pi-bolt",
            command: () => {
                window.location.href = '/ganado';
            }
        },
        {
            label: "Aprobaciones",
            icon: "pi pi-fw pi-compass",
            items: [
                {
                    label: "Salidas",
                    icon: "pi pi-fw pi-shopping-bag",
                    command: () => {
                        window.location.href = '/aprobarsalida';
                    }
                },
                {
                    label: "Ventas",
                    icon: "pi pi-fw pi-shopping-cart",
                    command: () => {
                        window.location.href = '/aprobarventa';
                    }
                },
            ],
        },
        {
            label: "Lista de salidas",
            icon: "pi pi-fw pi-users",
            command: () => {
                window.location.href = '/salida';
            }
        },
        {
            label: "Lista de ventas",
            icon: "pi pi-fw pi-users",
            command: () => {
                window.location.href = '/venta';
            }
        },
    ];

    const navListVaquero = [
        {
            label: "Inicio",
            icon: "pi pi-fw pi-home",
            command: () => {
                window.location.href = '/profile';
            }
        },
        {
            label: "Ganado",
            icon: "pi pi-fw pi-spinner",
            command: () => {
                window.location.href = '/ganado';
            }
        }
    ]

    const navListAdmin = [
        {
            label: "Inicio",
            icon: "pi pi-fw pi-home",
            command: () => {
                window.location.href = '/profile';
            }
        },
        {
            label: "Ganado",
            icon: "pi pi-fw pi-bolt",
            command: () => {
                window.location.href = '/ganado';
            }
        },
        {
            label: "Aprobaciones",
            icon: "pi pi-fw pi-compass",
            items: [
                {
                    label: "Salidas",
                    icon: "pi pi-fw pi-shopping-bag",
                    command: () => {
                        window.location.href = '/aprobarsalida';
                    }
                },
                {
                    label: "Ventas",
                    icon: "pi pi-fw pi-shopping-cart",
                    command: () => {
                        window.location.href = '/aprobarventa';
                    }
                },
            ],
        },
        {
            label: "Lista de salidas",
            icon: "pi pi-fw pi-users",
            command: () => {
                window.location.href = '/salida';
            }
        },
        {
            label: "Lista de ventas",
            icon: "pi pi-fw pi-users",
            command: () => {
                window.location.href = '/venta';
            }
        },
        {
            label: "Ususarios",
            icon: "pi pi-fw pi-bolt",
            command: () => {
                window.location.href = '/usuario';
            }
        },
    ]

    const navListUsuario = [
        {
            label: "Inicio",
            icon: "pi pi-fw pi-home",
            command: () => {
                window.location.href = '/profile';
            }
        }
    ]
    /*Items 2 */
    const itemsInicio = [
        {
            label: "Inicio de sesión",
            icon: "pi pi-fw pi-user",
            command: () => {
                window.location.href = '/login';
            }
        },
        {
            label: "Registrarse",
            icon: "pi pi-fw pi-sign-in",
            command: () => {
                window.location.href = '/register';
            }
        }
    ]
    const itemsCerrar = [
        {
            label: "Perfil",
            icon: "pi pi-fw pi-user",
            command: () => {
                window.location.href = '/profile';
            }
        },
        {
            label: "Editar perfil",
            icon: "pi pi-fw pi-users",
            command: () => {
                window.location.href = '/edituser';
            }
        },
        {
            label: "Salir",
            icon: "pi pi-fw pi-sign-out",
            command: () => {
                window.location.href = '/profile';
                window.onclick = logOut();
            }
        }
    ]

    if (!currentUser) {

    } else if (currentUser) {
        if (currentUser.estado === 0) {
            logOut();
        } else {

        }
    }

    function isLogin(currentUser, itemsInicio, itemsCerrar) {
        if (!currentUser) {
            return <SplitButton className="mr-2 mb-2 p-button-rounded p-button-info" label="Acciones" model={itemsInicio} />;
        } else if (currentUser) {
            return <SplitButton className="mr-2 mb-2 p-button-rounded p-button-success" label={currentUser.Nombre} model={itemsCerrar} />;
        }
    }

    function isRol(currentUser, navlistInicio, navListAdmin, navListJefe, navListVaquero, navListUsuario) {
        if (!currentUser) {
            return navlistInicio;
        } else if (currentUser.rol === "Administrador") {
            return navListAdmin;
        } else if (currentUser.rol === "Jefe") {
            return navListJefe;
        } else if (currentUser.rol === "Vaquero") {
            return navListVaquero;
        } else if (currentUser.rol === "Usuario") {
            return navListUsuario;
        }
    }
    const end = isLogin(currentUser, itemsInicio, itemsCerrar);
    const start = <img alt="logo" onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} height="40" className="mr-2"></img>;
    return (
        <header>
            <Menubar model={isRol(currentUser, navlistInicio, navListAdmin, navlistJefe, navListVaquero, navListUsuario)} start={start} end={end} />
        </header>
    );
}

export default Navigation;