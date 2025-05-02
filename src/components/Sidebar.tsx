import { useState } from "react";
import { Modal, Button as Btn, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getRoleName } from "../types/User";
import { LogOut } from "lucide-react";

import {
  X,
  LaptopMinimal,
  Tag,
  SquareDashedMousePointer,
  CopySlash,
  Waypoints,
  Settings,
  Home,
  UserRoundPlus,
  CircleUser,
  Bell,
  Trash
} from "lucide-react";
import { useWebSocket, useDeleteNotification } from "../context/NotificationContext";


export default function Sidebar() {
  const deleteNotification = useDeleteNotification();
  const { notifications } = useWebSocket();
  const unreadCounts = notifications.length;


  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showModalN, setShowModalN] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const confirmLogout = () => {
    localStorage.clear();
    setShowLogoutModal(false);
    navigate("/");
  };

  const user = JSON.parse(localStorage.getItem("user") || '{}');
  const { name, email, role } = user;

  const handleItemClick = (text: string) => {
    if (!isOpen) {
      setIsOpen(true);
      setTimeout(() => setActiveItem(text), 300);
    } else {
      setActiveItem(activeItem === text ? null : text);
    }
  };

  return (

    <div
      className="bg-dark text-white d-flex flex-column p-3"
      style={{
        width: isOpen ? "270px" : "73px",
        transition: "width 0.3s ease",
        height: "auto",
        minHeight: "100vh",
        maxHeight: "auto"
      }}
    >
      <div
        className="d-flex align-items-center mb-3"
        style={{ cursor: "pointer" }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <img
          src="/images/sige_02.png"
          alt="Logo"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            objectFit: "cover"
          }}
        />
        {isOpen && <span className="ms-2 fs-5 fw-bold">SIGE</span>}
        {isOpen && <span className="ms-auto"><X /></span>}
      </div>

      <hr style={{ marginBottom: "10px" }} />

      <nav className="nav flex-column">
        <SidebarItem
          icon={<Home />}
          text="HOME"
          isOpen={isOpen}
          isActive={activeItem === ""}
          onClick={() => navigate("/auth/dashboard")}
        >
        </SidebarItem>
        <hr style={{ marginTop: "0px" }} />
      </nav>



      <nav className="nav flex-column">
        {role === 2 && (
          <SidebarItem
            icon={<LaptopMinimal />}
            text="Equipos"
            isOpen={isOpen}
            isActive={activeItem === "Equipos"}
            onClick={() => handleItemClick("Equipos")}
          >
            <SubMenu isOpen={activeItem === "Equipos"} items={[
              { text: "Agregar equipo", onClick: () => navigate("/auth/equipment/create") },
              { text: "Ver equipos", onClick: () => navigate("/auth/equipment") }
            ]} />
          </SidebarItem>
        )}

        {[1, 2, 3].includes(role) && (
          <SidebarItem
            icon={<Tag />}
            text="Tickets"
            isOpen={isOpen}
            isActive={activeItem === "Tickets"}
            onClick={() => handleItemClick("Tickets")}
          >
            <SubMenu isOpen={activeItem === "Tickets"} items={[
              { text: "Crear ticket", onClick: () => navigate("/auth/ticket/create") },
              { text: "Ver tickets", onClick: () => navigate("/auth/ticket") }]} /></SidebarItem>
        )}

        {role === 2 && (
          <SidebarItem
            icon={<SquareDashedMousePointer />}
            text="Áreas"
            isOpen={isOpen}
            isActive={activeItem === "Áreas"}
            onClick={() => handleItemClick("Áreas")}
          >
            <SubMenu isOpen={activeItem === "Áreas"} items={[
              { text: "Agregar área", onClick: () => navigate("/auth/area/create") },
              { text: "Listar áreas", onClick: () => navigate("/auth/area") },
              { text: "Detalles aulas", onClick: () => navigate("/auth/classroom") },
            ]} />
          </SidebarItem>
        )}

        {role === 2 && (
          <SidebarItem
            icon={<CopySlash />}
            text="Préstamos"
            isOpen={isOpen}
            isActive={activeItem === "Préstamos"}
            onClick={() => handleItemClick("Préstamos")}
          >
            <SubMenu isOpen={activeItem === "Préstamos"} items={[
              { text: "Nuevo préstamo", onClick: () => navigate("/auth/loans/create") },
              { text: "Historial", onClick: () => navigate("/auth/loans") }
            ]} />
          </SidebarItem>
        )}

        {[1, 2].includes(role) && (
          <SidebarItem
            icon={<Waypoints />}
            text="Subredes"
            isOpen={isOpen}
            isActive={activeItem === "Subredes e IPs"}
            onClick={() => handleItemClick("Subredes e IPs")}
          >
            <SubMenu isOpen={activeItem === "Subredes e IPs"} items={[
              { text: "Agregar subredes", onClick: () => navigate("/auth/subnets/create") },
              { text: "Listar Subredes", onClick: () => navigate("/auth/subnets") }
            ]} />
          </SidebarItem>
        )}

        {role === 3 && (
          <SidebarItem
            icon={<UserRoundPlus />}
            text="Administrar usuarios"
            isOpen={isOpen}
            isActive={activeItem === "Usuarios"}
            onClick={() => handleItemClick("Usuarios")}
          >
            <SubMenu
              isOpen={activeItem === "Usuarios"}
              items={[
                { text: "Agregar usuario", onClick: () => navigate("/auth/users/create") },
                { text: "Listar usuarios", onClick: () => navigate("/auth/users") }
              ]}
            />
          </SidebarItem>
        )}
        <br />

        <div>
          <div>
            <button
              type="button"
              className="btn btn-primary position-relative"
              style={{
                cursor: "pointer",
                backgroundColor: "#1370af",
              }}
              onClick={() => setShowModalN(true)}>
              <Bell />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" >
                {unreadCounts}
                <span className="visually-hidden">unread messages</span>
              </span>
            </button>
            {isOpen && <span className="ms-2"><strong>Notificaciones</strong></span>}

          </div>
          <SubMenu isOpen={activeItem === "Notificaciones"} />
        </div>

        <hr />

        <div>
          <div
            className="d-flex align-items-center p-2 text-white rounded mb-2 sidebar-item"
            style={{
              cursor: "pointer",
              transition: "background 0.3s ease",
              backgroundColor: "#1370af",
            }}
            onClick={() => setShowModal(true)}
          >
            <CircleUser />
            {isOpen && <span className="ms-2">{name}</span>}
          </div>
          <SubMenu isOpen={activeItem === "User"} />
        </div>

        <hr />


        {/* Modal */}
        <Modal show={showModal} onHide={() => setShowModal(true)}>
          <Modal.Header closeButton onClick={() => setShowModal(false)}>
            <Modal.Title>Informacion de usuario</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Nombre: {name}</p>
            <p>Correo: {email}</p>
            <p>Rol: {getRoleName(role)}</p>
          </Modal.Body>
          <Modal.Footer>
            <Btn variant="secondary" onClick={() => setShowModal(false)}>
              Cerrar
            </Btn>
          </Modal.Footer>
        </Modal>


        <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmar cierre de sesión</Modal.Title>
          </Modal.Header>
          <Modal.Body>¿Estás seguro de que deseas cerrar sesión?</Modal.Body>
          <Modal.Footer>
            <Btn variant="secondary" onClick={() => setShowLogoutModal(false)}>
              Cancelar
            </Btn>
            <Btn variant="danger" onClick={confirmLogout}>
              Cerrar sesión
            </Btn>
          </Modal.Footer>
        </Modal>



        <Modal show={showModalN} onHide={() => setShowModalN(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Notificaciones</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {notifications.length === 0 ? (
              <p>No tienes nuevas notificaciones</p>
            ) : (
              <>
                <style>
                  {`
                    ol.bold-numbers {
                      list-style: decimal;
                      padding-left: 1.5rem;
                    }

                    ol.bold-numbers li::marker {
                      font-weight: bold;
                    }
                  `}
                </style>

                <ol className="bold-numbers">
                  {notifications.map((notification, index) => (
                    <li key={index}>
                      <Card className="p-3 mb-3">
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="text-break me-3">
                            <strong>{notification.title}</strong>: {notification.message}
                          </div>
                          <Btn
                            variant="danger"
                            onClick={() => deleteNotification(notification.id)}
                            className="flex-shrink-0"
                          >
                            <Trash />
                          </Btn>
                        </div>
                      </Card>
                    </li>
                  ))}
                </ol>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Btn variant="secondary" onClick={() => setShowModalN(false)}>
              Cerrar
            </Btn>
          </Modal.Footer>
        </Modal>


        <SidebarItem
          icon={<Settings />}
          text="Configuracion"
          isOpen={isOpen}
          isActive={activeItem === "Configuracion"}
          onClick={() => handleItemClick("Configuracion")}
        >
        </SidebarItem>

        <SidebarItem
          icon={<LogOut />}
          text="Cerrar sesión"
          isOpen={isOpen}
          isActive={false}
          onClick={() => setShowLogoutModal(true)}
        />
      </nav >
    </div >
  );
}

// Componente de ítems del Sidebar
function SidebarItem({
  icon,
  text,
  isOpen,
  isActive,
  onClick,
  children
}: {
  icon: JSX.Element;
  text: string;
  isOpen?: boolean;
  isActive: boolean;
  onClick: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <div
        className={`d-flex align-items-center p-2 text-white rounded mb-2 sidebar-item ${isActive ? "bg-secondary" : ""}`}
        style={{
          cursor: "pointer",
          transition: "background 0.3s ease"
        }}
        onClick={onClick}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#495057")}
        onMouseLeave={(e) => (e.currentTarget.style.background = isActive ? "#6c757d" : "transparent")}
      >
        {icon}
        {isOpen && <span className="ms-2">{text}</span>}
      </div>
      {isOpen && children}
    </div>
  );
}

// Componente para las subopciones con `onClick` opcional
function SubMenu({ isOpen, items = [] }: { isOpen: boolean; items?: { text?: string; onClick?: () => void }[] }) {
  return (
    <div
      className="ms-4"
      style={{
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? "translateY(0)" : "translateY(-10px)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
        height: isOpen ? "auto" : "0",
        overflow: "hidden"
      }}
    >
      {items?.map((item, index) => (
        <div
          key={index}
          className="text-white ps-3 py-1"
          style={{ cursor: "pointer" }}
          onClick={item.onClick}
        >
          - {item.text}
        </div>
      ))}
    </div>
  );
}