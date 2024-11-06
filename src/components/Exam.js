import React, { useState, useEffect } from "react";

const Exam = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isTabActive, setIsTabActive] = useState(true);
  const [isRecording, setIsRecording] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Function to show the modal with a specific message
  const triggerModal = (message) => {
    setModalMessage(message);
    setShowModal(true);
  };

  // Handle user actions in the modal
  const handleModalAccept = () => {
    requestFullscreen();
    setShowModal(false);
    // Additional logic for accepting the alert can be added here
  };

  const handleModalReject = () => {
    setIsTabActive(false);
    setShowModal(false);
    // Logic for rejecting (e.g., exit the exam) can be implemented here
  };

  useEffect(() => {
    // Fullscreen change detection
    const handleFullScreenChange = () => {
      setIsTabActive(true);
      const isFullscreen = document.fullscreenElement !== null;
      setIsFullScreen(isFullscreen);
      if (!isFullscreen) {
        triggerModal("You must remain in fullscreen mode during the exam.");
      }
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);

    // Tab visibility change detection
    const handleVisibilityChange = () => {
      const isTabCurrentlyActive = !document.hidden;
      setIsTabActive(isTabCurrentlyActive);
      setIsRecording(isTabCurrentlyActive);

      if (!isTabCurrentlyActive) {
        triggerModal(
          "Tab is not active. Please keep this tab open to continue the exam."
        );
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Key press restriction
    const handleKeyDown = (e) => {
      if (e.key === "F12" || (e.ctrlKey && ["r", "c", "v"].includes(e.key))) {
        e.preventDefault();
        triggerModal("Keyboard shortcuts are disabled during the exam.");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Clean up event listeners on component unmount
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Function to enable fullscreen
  const requestFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Failed to enter fullscreen mode:", err);
      });
    }
  };

  return (
    <div
      style={{
        height: "99vh",
        width: "99.5vw",
        backgroundColor: isTabActive ? "#f4f6f8" : "#f8d7da",
        border: isTabActive ? "5px solid green" : "5px solid red",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Fullscreen button */}
      {!isFullScreen && (
        <button
          onClick={requestFullscreen}
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            padding: "12px 24px",
            backgroundColor: "#4CAF50",
            color: "white",
            fontSize: "18px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            transition: "background-color 0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#45a049")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#4CAF50")}
        >
          Enter Fullscreen
        </button>
      )}

      <div style={{ textAlign: "center" }}>
        <h1 style={{ color: isTabActive ? "#333" : "#721c24" }}>
          {isTabActive ? "Exam in Progress" : "Please Return to the Exam"}
        </h1>
        <p style={{ color: "#666", marginTop: "10px" }}>
          {isTabActive ? "Recording in progress..." : "Recording paused."}
        </p>
      </div>

      {/* Modal Popup */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              maxWidth: "400px",
              textAlign: "center",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            <h2 style={{ marginBottom: "15px", color: "#333" }}>Alert</h2>
            <p style={{ marginBottom: "20px", color: "#555" }}>
              {modalMessage}
            </p>
            <button
              onClick={handleModalAccept}
              style={{
                padding: "10px 20px",
                backgroundColor: "#4CAF50",
                color: "white",
                fontSize: "16px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              Accept
            </button>
            <button
              onClick={handleModalReject}
              style={{
                padding: "10px 20px",
                backgroundColor: "#f44336",
                color: "white",
                fontSize: "16px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Reject
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exam;
