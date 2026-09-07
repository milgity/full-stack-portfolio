import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [unreadCount, setUnreadCount] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("adminToken");

        if (!token) {
            navigate("/admin/login");
            return;
        }

        fetchMessages(token);

        const interval = setInterval(() => {
            fetchMessages(token);
        }, 10000);

        return () => clearInterval(interval);
    }, [navigate]);

    const fetchMessages = async (token) => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/messages",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (response.status === 401) {
                localStorage.removeItem("adminToken");
                navigate("/admin/login");
                return;
            }

            if (!response.ok) {
                setError(data.message || "Failed to load messages");
                return;
            }

            setMessages(data);

        } catch (error) {
            console.error(error);
            setError("Unable to connect to the server.");
        } finally {
            setLoading(false);
        }
    };
    //Unread count fucntion
    const fetchUnreadCount = async () => {
        try {
            const token = localStorage.getItem("adminToken");

            const response = await fetch(
                "http://localhost:5000/api/messages/unread-count",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (response.ok) {
                setUnreadCount(data.unreadCount);
            }
        } catch (error) {
            console.error("Error fetching unread count:", error);
        }
    };

    useEffect(() => {
        fetchUnreadCount();

        const interval = setInterval(() => {
            fetchUnreadCount();
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    //Mark as read
    const markAsRead = async (messageId) => {
    try {
        const token = localStorage.getItem("adminToken");

        const response = await fetch(
            `http://localhost:5000/api/messages/${messageId}/read`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (response.ok) {
            setMessages((currentMessages) =>
                currentMessages.map((message) =>
                    message.id === messageId
                        ? { ...message, is_read: 1 }
                        : message
                )
            );

            setUnreadCount((currentCount) =>
                Math.max(currentCount - 1, 0)
            );
        }
    } catch (error) {
        console.error("Error marking message as read:", error);
    }
};
    const deleteMessage = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this message?"
        );

        if (!confirmDelete) {
            return;
        }

        const token = localStorage.getItem("adminToken");

        try {
            const response = await fetch(
                `http://localhost:5000/api/messages/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (response.status === 401) {
                localStorage.removeItem("adminToken");
                navigate("/admin/login");
                return;
            }

            if (!response.ok) {
                alert(data.message || "Failed to delete message");
                return;
            }

            setMessages((currentMessages) =>
                currentMessages.filter(
                    (message) => message.id !== id
                )
            );

        } catch (error) {
            console.error(error);
            alert("Unable to connect to the server.");
        }
    };

    const logout = () => {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
    };

    return (
        <div className="admin-dashboard">

            <header className="dashboard-header">

                <div>
                    <h1>Portfolio Admin</h1>
                    <p>Manage your portfolio messages</p>
                </div>

                <button
                    className="logout-btn"
                    onClick={logout}
                >
                    Logout
                </button>

            </header>

            <main className="dashboard-content">

                <section className="dashboard-title">
                    <h2>Dashboard</h2>
                    <p>Welcome back, Admin.</p>
                </section>

                

                <section className="messages-section">

                    <div className="section-header">
                        <h2>Contact Messages</h2>
                        <span>
                            {messages.length} message
                            {messages.length !== 1 ? "s" : ""}
                        </span>
                        <div className="notification-area">
                            <button className="messages-button">
                                🔔 Messages

                                {unreadCount > 0 && (
                                    <span className="notification-badge">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {unreadCount > 0 && (
                                <span className="new-message-text">
                                    You have {unreadCount} unread
                                    {unreadCount === 1 ? " message" : " messages"}
                                </span>
                            )}
                        </div>
                    </div>

                    {loading && (
                        <div className="status-message">
                            Loading messages...
                        </div>
                    )}

                    {error && (
                        <div className="status-message error">
                            {error}
                        </div>
                    )}

                    {!loading &&
                        !error &&
                        messages.length === 0 && (
                            <div className="empty-message">
                                <h3>No messages yet</h3>
                                <p>
                                    Messages submitted through your
                                    portfolio will appear here.
                                </p>
                            </div>
                        )}

                    {!loading &&
                        !error &&
                        messages.length > 0 && (

                            <div className="messages-container">

                                <table>

                                    <thead>
                                        <tr>
                                        <th>Status</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Message</th>
                                        <th>Date</th>
                                        <th>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {messages.map((message) => (
                                            <tr key={message.id}
                                            className={message.is_read ? "read-message" : "unread-message"}>
                                                <td>
                                                    {message.is_read ? (
                                                        <span className="read-badge">
                                                            ✓ Read
                                                        </span>
                                                    ) : (
                                                        <span className="unread-badge">
                                                            ● Unread
                                                        </span>
                                                    )}
                                                </td>

                                                <td>
                                                    <strong>
                                                        {message.name}
                                                    </strong>
                                                </td>

                                                <td>
                                                    {message.email}
                                                </td>

                                                <td className="message-cell">
                                                    {message.message}
                                                </td>

                                                <td>
                                                    {new Date(
                                                        message.created_at
                                                    ).toLocaleString()}
                                                </td>

                                                <td>
                                                    <td>
                                                        {!message.is_read && (
                                                            <button
                                                                className="read-btn"
                                                                onClick={() => markAsRead(message.id)}
                                                            >
                                                                ✓ Mark as Read
                                                            </button>
                                                        )}

                                                        <button
                                                            className="delete-btn"
                                                            onClick={() => deleteMessage(message.id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </td>

                                            </tr>
                                        ))}

                                    </tbody>

                                </table>

                            </div>
                        )}

                </section>

            </main>

        </div>
    );
}

export default AdminDashboard;