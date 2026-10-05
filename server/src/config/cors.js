const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "https://vanta-bags-ecomm-1.onrender.com",
];

if (process.env.CLIENT_URL && !allowedOrigins.includes(process.env.CLIENT_URL)) {
  allowedOrigins.push(process.env.CLIENT_URL);
}
  
  export const corsOptions = {
    origin: function (origin, callback) {
      // Allow requests without an Origin header
      if (!origin) {
        return callback(null, true);
      }
  
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
  
      return callback(new Error("Not allowed by CORS"));
    },
  
    credentials: true,
  
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  
    allowedHeaders: ["Content-Type", "Authorization"],
  };