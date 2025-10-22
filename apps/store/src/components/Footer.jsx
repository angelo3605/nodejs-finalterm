export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="about">
          <div className="brand">
            <span className="logo">🌿</span>
            <span className="brand-name">Plantly</span>
          </div>
          <p>123 Green St, District 1, HCMC</p>
          <p>Open daily 9:00–21:00</p>
        </div>
        <div className="map">
          <iframe
            title="Map"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5020302486343!2d106.700!3d10.772!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3f4a9f62ad%3A0x1b7b7d5af2!2sHo%20Chi%20Minh%20City!5e0!3m2!1sen!2sVN!4v1680000000000"
            allowFullScreen
          ></iframe>
        </div>
      </div>
      <div className="subfooter">
        © {new Date().getFullYear()} Plantly. All rights reserved.
      </div>
    </footer>
  );
}
