from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import HTMLResponse

router = APIRouter(
    tags=["test"]
    )

@router.get("/tes-ws")
async def get_test_page():
    html_content = """
    <!DOCTYPE html>
    <html>
        <head>
            <title>Tes WebSocket Pelanggan</title>
        </head>
        <body>
            <h2>Log Real-time Data Pelanggan:</h2>
            <div id="log" style="border:1px solid #ccc; padding:10px; height:300px; overflow-y:scroll; background:#f9f9f9;"></div>

            <script>
                // Koneksi ke endpoint WebSocket kamu
                const ws = new WebSocket("ws://127.0.0.1:8000/api/router/pelanggan");
                const logDiv = document.getElementById("log");

                ws.onopen = () => {
                    logDiv.innerHTML += "<p style='color:green;'><b>[CONNECTED]</b> Sukses terhubung ke FastAPI!</p>";
                };

                ws.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    logDiv.innerHTML += `<p><b>[DATA RECEIVED]:</b> ${JSON.stringify(data)}</p>`;
                    logDiv.scrollTop = logDiv.scrollHeight; // Auto scroll ke bawah
                };

                ws.onerror = (error) => {
                    logDiv.innerHTML += `<p style='color:red;'><b>[ERROR]</b> Koneksi bermasalah: ${error}</p>`;
                };

                ws.onclose = () => {
                    logDiv.innerHTML += "<p style='color:orange;'><b>[DISCONNECTED]</b> Koneksi ditutup.</p>";
                };
            </script>
        </body>
    </html>
    """
    return HTMLResponse(content=html_content)