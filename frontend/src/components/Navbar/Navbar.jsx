import "./Navbar.css";

function Navbar(){
    
 
    return (
        <nav className="navbar">
           <div className="navbar-logo">Million.dev</div>
            <ul className="navbar-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#skills">Skills</a></li>
                <li><a href="#projects">Projects</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
          
        </nav>
    );
};
export default Navbar;