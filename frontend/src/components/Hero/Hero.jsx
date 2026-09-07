import "./Hero.css";

function Hero() {
    return (
        <section className="hero" id="home">
            <div className="hero-text">
                <h3>Hello. I'm</h3>
                <h1>Million Tesfaye</h1>
                <h2>Full Stack Developer</h2>
                <p>
                    I am a passionate and skilled full-stack developer with expertise in both front-end and back-end technologies. I enjoy creating dynamic and responsive web applications that provide seamless user experiences. With a strong foundation in programming languages, frameworks, and databases, I am dedicated to delivering high-quality code and innovative solutions. I thrive in collaborative environments and am always eager to learn and adapt to new technologies. Let's build something amazing together!
                </p>
                <div className="hero-buttons">
                    <a href="./Public/MCV.pdf" 
                    download
                    className="btn"
                    >Download CV</a>
                    <a href="https://github.com/milgity" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" className="btn-outline">
                        GitHub
                    </a>
                </div>
            </div>
            <div className="hero-image">
                <img src="profile2.jpg" alt="Hero Image" />
            </div>
        </section>
    )
}
export default Hero;