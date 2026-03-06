# 🌐 Google OAuth Setup Guide

To enable Google Sign-In for **CODE-SENSEI**, follow these steps to get your credentials from the Google Cloud Console.

## 1. Create a New Project
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Click on the project dropdown (top left) and select **New Project**.
3. Name it `CODE-SENSEI` and click **Create**.

## 2. Configure OAuth Consent Screen
1. In the sidebar, go to **APIs & Services** > **OAuth consent screen**.
2. Select **External** and click **Create**.
3. Fill in the required app information:
   - **App name**: `CODE-SENSEI`
   - **User support email**: Your email.
   - **Developer contact info**: Your email.
4. Click **Save and Continue** until you reach the dashboard.

## 3. Create Credentials
1. Go to **APIs & Services** > **Credentials**.
2. Click **+ CREATE CREDENTIALS** and select **OAuth client ID**.
3. Set **Application type** to **Web application**.
4. **Authorized JavaScript origins**:
   - `http://localhost:3000`
5. **Authorized redirect URIs**:
   - `http://localhost:3000/api/auth/callback/google`
6. Click **Create**.

## 4. Copy Your Keys
A window will appear with your **Client ID** and **Client Secret**. copy them immediately.

## 5. Update Your Project
Open your `c:\Users\Acer\CODE-SENSEI\.env` file and paste the values:

```bash
GOOGLE_CLIENT_ID=paste_your_client_id_here
GOOGLE_CLIENT_SECRET=paste_your_client_secret_here
```

> [!TIP]
> After saving the file, you may need to restart your development server (`npm run dev`) for the changes to take effect.
