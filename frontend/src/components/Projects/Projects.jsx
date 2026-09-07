import "./Projects.css";
import { FaGithub } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
function Projects() {
    const projects = [
        {
            title: "Calculator App",
            image: "/projects/calculator.png",
            description: "A responsive calculator built using HTML, CSS and JavaScript.",
            tech: ["HTML", "CSS", "JavaScript"],
            github: "https://github.com/milgity/Calculator-app",
            live: "#",
        },
        {
            title: "Portfolio Website",
            image: "/projects/portfolio1.png",
            description: "A personal portfolio built with React and CSS.",
            tech: ["React", "CSS"],
            github: "https://github.com/milgity/portfolio",
            live: "https://https://portfolio-py0jxfnu3-milgitys-projects.vercel.app",
        },
    ];
   

    return (
        <section className="projects" id="projects">
            <h2>My Projects</h2>

            <div className="projects-container">
                {projects.map((project) => (
                    <div className="project-card" key={project.title}>
                        <img src={project.image} alt={project.title} />

                        <div className="project-info">
                            <h3>{project.title}</h3>

                            <p>{project.description}</p>

                            <div className="tech">
                                {project.tech.map((item) => (
                                    <span key={item}>{item}</span>
                                ))}
                            </div>

                            <div className="buttons">
                                <a href={project.github} target="_blank" rel="noreferrer">
                                    <FaGithub/>
                                    <spa>GitHub</spa>
                                </a>

                                <a href={project.live} target="_blank" rel="noreferrer">
                                    <FiExternalLink />
                                    <span>Live Demo</span>
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Projects;