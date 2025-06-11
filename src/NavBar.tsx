import { Link, useMatch, useResolvedPath } from "react-router-dom";
import type { LinkProps } from "react-router-dom"; // Type-only import for LinkProps

interface CustomLinkProps extends LinkProps {
  to: string; // Explicitly defining the 'to' prop as a string
  children: React.ReactNode; // Define children as ReactNode
}

export default function Navbar() {
  return (
    <div className='flex justify-center '>
      <nav className="nav mb-4">
        <ul className="menu menu-horizontal bg-base-200 rounded-box mt-6">

          <CustomLink to="/dashboard">
            <div>Dashboard</div>
          </CustomLink>

        </ul>
      </nav>
    </div>
  )
}

function CustomLink({ to, children, ...props }: CustomLinkProps) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  return (
    <li className={isActive ? "bg-neutral rounded-box" : ""}>
      <Link to={to} {...props} className={isActive ? "text-white" : "text-black"}>
        {children}
      </Link>
    </li>
  );
}