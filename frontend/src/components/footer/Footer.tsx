import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer>
      <div
        style={{
          width: "100%",
          minHeight: "20vh",
          maxHeight: "30vh",
          marginTop: 60,
        }}
      >
        <p style={{ fontSize: "30px", textAlign: "center", padding: "20px" }}>
          Built With love by
          <span>
            <a
              style={{ color: "white" }}
              className="nav-link"
              href="https://youtube.com/indiancoders"
              target="_blank"
              rel="noreferrer"
            >
              Indian Coders
            </a>
          </span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;