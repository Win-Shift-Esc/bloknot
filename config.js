// Настройки Firebase для синхронизации между телефоном и компьютером.
// Проект: bloknot-182a8. Эти значения не секретные: данные защищают правила Firestore и вход в аккаунт.
const firebaseConfig = {
  apiKey: "AIzaSyAoawkZ080gvrXEvT-qzssQmSWujEoS9A4",
  authDomain: "bloknot-182a8.firebaseapp.com",
  projectId: "bloknot-182a8",
  storageBucket: "bloknot-182a8.firebasestorage.app",
  messagingSenderId: "880226437080",
  appId: "1:880226437080:web:9b1f0265ff395d3d2694ad"
};

// Напоминания (Web Push): открытый ключ сервера рассылки. Он не секретный.
const PUSH_PUBLIC_KEY = "BCGAQ_e6QrFtr2C_VNfVYC2GL95w7h9erc3_gIoxJ5uOrbtCYQBd4rqQ2pry9EAfJoFi8bqJJInMrgNM2J_yPXs";
// Станет true, когда подключим сервер рассылки (Cloudflare).
const PUSH_SERVER_READY = false;
