import { Button, Card, CardContent } from "@mui/joy";
import { useState } from "react";
import QRCode from "react-qr-code";

import { http } from "@/utils/libs/axios";
import { notifyError } from "@/utils/helpers/notify";
export default function WaPage() {
  const [qrValue, setQrValue] = useState("");

  function handleQr() {
    http
      .get("/wa/qr")
      .then(({ data }) => {
        setQrValue(data.qr);
      })
      .catch((err) => notifyError(err));
  }

  return (
    <Card>
      <CardContent>
        <div className="grid grid-cols-2">
          <div>
            <Button onClick={handleQr}>Generate QRCode</Button>
          </div>
          <div className="max-w-xs">
            {qrValue && (
              <QRCode
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={qrValue}
                viewBox={`0 0 256 256`}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
