import { NavLink } from "react-router";
import "../styles/Navbar.css";

export default function Navbar() {
  return (
    <nav className="site-nav">
      <NavLink className="brand" to="/">
        mellemrum<span>.</span>
      </NavLink>

      <ul className="nav-links">
        <li>
          <NavLink to="/">Events</NavLink>
        </li>
        <li>
          <NavLink to="/om">Om Mellemrum</NavLink>
        </li>
      </ul>
    </nav>
  );
}
