import React from "react";
import { QRCode } from "react-qrcode-logo";

const QRCodeDisplay = ({ value }) => {
  if (!value) return null;

  return (
    <div className="flex justify-center p-4">
      <QRCode
        value={value}
        size={180}
        fgColor="#2563eb"
        bgColor="#ffffff"
        logoImage=""  // Aquí puedes poner URL o importar un logo si quieres
        logoWidth={40}
        logoHeight={40}
        removeQrCodeBehindLogo={true}
      />
    </div>
  );
};

export default QRCodeDisplay;