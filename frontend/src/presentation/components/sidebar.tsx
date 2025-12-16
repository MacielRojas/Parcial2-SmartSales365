import React from "react";

export interface SidebarSection {
  id: number;
  title: string;
  options: SidebarOption[];
}

interface SidebarOption {
  id: number;
  label: string;
  icon?: string;
  path: string;
}

interface SidebarProps {
  sections: SidebarSection[];
  onNavigate: (path: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sections, onNavigate }) => {
  // const [isCollapsed, setIsCollapsed] = useState(true);

  // Altura del topbar definida (coincide con tu navbar sticky-top)
  const topbarHeight = 56; // Bootstrap navbar standard

  return (
    <>

      {/* Sidebar principal */}
      <div
        className={`bg-dark text-white position-fixed start-0 p-3 transition-all`}
        style={{
          top: `${topbarHeight}px`, // empieza justo debajo del topbar
          width: "250px",
          height: `calc(100vh - ${topbarHeight}px)`, // ocupa el resto del alto
          overflowY: "auto",
          zIndex: 1030, // debajo del topbar
          transition: "transform 0.3s ease-in-out",
        }}
      >
        <h5 className="mb-4">Menú</h5>

        {sections.map((section, idx) => (
          <div key={section.id} className="mb-4">
            <h6 className="text-muted text-uppercase small mb-2">
              {section.title}
            </h6>
            <ul className="list-unstyled">
              {section.options.map((option) => (
                <li key={option.id} className="mb-2">
                  <button
                    className="btn btn-dark w-100 text-start"
                    onClick={() => onNavigate(option.path)}
                  >
                    {option.icon && (
                      <i className={`bi bi-${option.icon} me-2`}></i>
                    )}
                    {option.label}
                  </button>
                </li>
              ))}
            </ul>
            {idx < sections.length - 1 && <hr className="border-secondary" />}
          </div>
        ))}
      </div>
    </>
  );
};

export default Sidebar;
