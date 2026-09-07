import { useState } from "react";
import "./Contact.css";

function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });

    const [status, setStatus] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setStatus("Sending...");

        try {
            const response = await fetch("http://localhost:5000/api/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setStatus("Message sent successfully!");

                setFormData({
                    name: "",
                    email: "",
                    message: ""
                });
            } else {
                setStatus(data.message || "Failed to send message.");
            }
        } catch (error) {
            console.error(error);
            setStatus("Unable to connect to the server.");
        }
    };

    return (
        <section className="contact" id="contact">
            <h2>Contact Me</h2>

            <p>
                Have a project or job opportunity? Feel free to contact me.
            </p>

            <form
                className="contact-form"
                onSubmit={handleSubmit}
            >
                <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                <br />

                <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <textarea
                    rows={8}
                    name="message"
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                ></textarea>

                <button type="submit">
                    Send Message
                </button>

                {status && <p>{status}</p>}
            </form>
        </section>
    );
}

export default Contact;