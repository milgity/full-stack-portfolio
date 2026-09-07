import "./Skills.css";
import skills from "../../data/skills";

function Skills() {
    return (
        <section className="skills" id="skills">
            <h2>My Skills</h2>

            <div className="skills-container">
                {skills.map((skill) => {
                    const Icon = skill.icon;

                    return (
                        <div className="skill-card" key={skill.name}>
                            <div className="icon" style={{ color: skill.color }}>
                                <Icon />
                            </div>

                            <h3>{skill.name}</h3>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

export default Skills;