document.getElementById('apkForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const fileInput = document.getElementById('apkInput');
  const status = document.getElementById('status');
  const frame = document.getElementById('emulatorFrame');

  if (!fileInput.files.length) return;

  const apk = fileInput.files[0];
  const formData = new FormData();
  formData.append('apk', apk);

  status.textContent = 'Uploading APK to backend...';

  try {
    const response = await fetch('https://your-backend-url/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (data.success && data.emulatorUrl) {
      status.textContent = 'Launching emulator...';
      frame.src = data.emulatorUrl;
      frame.style.display = 'block';
    } else {
      status.textContent = 'Failed to launch emulator.';
    }
  } catch (error) {
    console.error(error);
    status.textContent = 'Error connecting to backend.';
  }
});
