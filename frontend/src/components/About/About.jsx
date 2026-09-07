import "./About.css";

function About() {
    return(
        <section className="about" id="about">
            <h2>About me</h2>
            <p>
                I am Million Tesfaye Bekele, a Computer Science graduate and certified Full Stack Developer from Ethiopia. I enjoy building responsive
                web applications using React, Node.js, Express, mySQL, and MongoDB. I am passionate about learning new technologies and solving
                real-world problems through software.
            </p>

            <div className="about-info">
                <div className="card">
                    <h3>Education</h3>
                    <p>B.Sc Computer Science</p>
                </div>

                <div className="card">
                    <h3>Experience</h3>
                    <p>Personal and Academic Projects</p>
                </div>

                <div className="card">
                    <h3>Location</h3>
                    <p>Oromia, Ethiopia</p>
                </div>

            </div>
        </section>
    )
}
export default About;